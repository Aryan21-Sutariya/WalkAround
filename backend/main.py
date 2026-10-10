import os
import io
import time
import json
import random
import logging
from base64 import b64encode
import httpx
from fastapi import FastAPI, UploadFile, File, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from PIL import Image, UnidentifiedImageError

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("walkaround-backend")

app = FastAPI(title="WalkAround AI Backend", version="1.0.0")

# Read environment variables
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma4:e2b")
DEMO_MODE = os.getenv("DEMO_MODE", "false").lower() in ("true", "1", "yes")

# Curated Sample Observations for Fast, Honest Public Demo Mode
SAMPLE_OBSERVATIONS = [
    {
        "title": "Wood Fern (Dryopteris carthusiana)",
        "type": "Fern / Vascular Plant",
        "description": "Graceful bipinnate fronds with intricate triangular pinnae, thriving in moist, shaded forest understories.",
        "look_closer": "Inspect the undersides of the fronds for tiny, kidney-shaped indusia protecting clusters of spore-bearing sporangia.",
        "certainty": "high",
        "is_uncertain": False
    },
    {
        "title": "Turkey Tail (Trametes versicolor)",
        "type": "Polypore Fungus",
        "description": "Concentric, velvety bands of earthy colors layering outwards on decaying hardwood logs.",
        "look_closer": "Touch the upper surface to feel the fine, velvety fuzz, then look at the white pore surface underneath.",
        "certainty": "high",
        "is_uncertain": False
    },
    {
        "title": "Honey Bee (Apis mellifera) on Clover",
        "type": "Insect / Pollinator",
        "description": "Worker bee actively gathering nectar and pollen from blooming white clover florets.",
        "look_closer": "Look closely at the hind legs for pollen baskets (corbiculae) packed with bright yellow pollen pellets.",
        "certainty": "high",
        "is_uncertain": False
    },
    {
        "title": "English Oak (Quercus robur) with Foliose Lichen",
        "type": "Tree Bark & Lichen Symbiont",
        "description": "Deeply furrowed bark hosting pale blue-green lichen rosettes, signaling good local air quality.",
        "look_closer": "Notice how the lichen lobes curl slightly away from the bark ridges, absorbing morning humidity.",
        "certainty": "high",
        "is_uncertain": False
    }
]

# Allowed CORS origins
env_origins = os.getenv("ALLOWED_ORIGINS", "*")
if env_origins == "*":
    origins = ["*"]
else:
    origins = [o.strip() for o in env_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Observation(BaseModel):
    title: str = Field(description="Short, useful observation title")
    type: str = Field(description="Concise description of the kind of subject")
    description: str = Field(description="Friendly explanation of what is visibly present")
    look_closer: str = Field(description="One specific detail the user can examine in person")
    certainty: str = Field(description="'high', 'medium', or 'low'")
    is_uncertain: bool = Field(description="Boolean indicating if the model is uncertain")

def extract_json_from_text(text: str) -> dict:
    clean = text.strip()
    if clean.startswith("```json"):
        clean = clean[7:]
    elif clean.startswith("```"):
        clean = clean[3:]
    if clean.endswith("```"):
        clean = clean[:-3]
    clean = clean.strip()
    
    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        pass

    # Fallback substring extraction
    start_idx = clean.find("{")
    end_idx = clean.rfind("}")
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        candidate = clean[start_idx:end_idx + 1]
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            pass

    raise ValueError("Could not extract valid JSON from response")

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "demo_mode": DEMO_MODE,
        "model": OLLAMA_MODEL,
        "environment": "demo" if DEMO_MODE else "local_ai"
    }

@app.get("/api/health/model")
async def model_health():
    if DEMO_MODE:
        return {
            "status": "ok",
            "demo_mode": True,
            "message": "Demo mode active - fast curated sample observations enabled."
        }
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if res.status_code == 200:
                models = [m.get("name") for m in res.json().get("models", [])]
                model_loaded = any(OLLAMA_MODEL in m for m in models)
                return {
                    "status": "ok",
                    "ollama_connected": True,
                    "model_available": model_loaded,
                    "model": OLLAMA_MODEL,
                    "all_models": models
                }
            return {"status": "error", "ollama_connected": False, "status_code": res.status_code}
    except Exception as e:
        return {"status": "error", "ollama_connected": False, "error": str(e)}

@app.get("/api/sample-observation")
async def get_sample_observation():
    """Returns a fast, curated sample observation for demonstration purposes."""
    sample = random.choice(SAMPLE_OBSERVATIONS)
    return {
        "status": "success",
        "is_demo": True,
        "demo_disclaimer": "Demo Mode — Curated Sample Observation. This specimen is displayed for demonstration and is not an analysis of an uploaded photograph.",
        "observation": sample,
        "timings": {
            "preprocessing_ms": 0.0,
            "total_wall_clock_s": 0.02
        }
    }

@app.post("/api/analyze")
async def analyze_image(
    file: UploadFile = File(...),
    demo: bool = Query(False, description="Explicitly request a fast sample observation")
):
    t_start = time.time()
    
    # 1. Validate file size and type
    content = await file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    if len(content) > 8 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image size exceeds 8MB maximum limit."
        )

    # 2. Fast Demo Mode Bypass (Immediate return if DEMO_MODE or demo query requested)
    if DEMO_MODE or demo:
        logger.info("Serving fast honest sample observation (Demo Mode).")
        sample = random.choice(SAMPLE_OBSERVATIONS)
        return {
            "status": "success",
            "is_demo": True,
            "demo_disclaimer": "Demo Mode — Curated Sample Observation. This specimen is displayed for demonstration and is not an analysis of an uploaded photograph.",
            "observation": sample,
            "timings": {
                "preprocessing_ms": 0.0,
                "total_wall_clock_s": round(time.time() - t_start, 3)
            }
        }

    # 3. Validate image and downscale with Pillow for local inference
    t_prep_start = time.time()
    try:
        img = Image.open(io.BytesIO(content))
        original_size = img.size
        
        # Convert paletted or RGBA to RGB for standard JPEG encoding
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        # Proportionally resize large images so max dimension is 512px
        MAX_DIM = 512
        if max(img.width, img.height) > MAX_DIM:
            img.thumbnail((MAX_DIM, MAX_DIM), Image.Resampling.LANCZOS)
            
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=80, optimize=True)
        optimized_bytes = buf.getvalue()
    except UnidentifiedImageError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format. Supported formats: JPEG, PNG, WebP."
        )
    except Exception as e:
        logger.error(f"Image preprocessing error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to process image: {str(e)}"
        )
        
    t_prep = time.time() - t_prep_start
    logger.info(
        f"Preprocessed image: {original_size} -> {img.size}, "
        f"bytes: {len(content)} -> {len(optimized_bytes)} ({t_prep*1000:.1f}ms)"
    )

    # 4. Local Ollama inference with Gemma 4 (bounded at 25.0s timeout to prevent hanging)
    image_base64 = b64encode(optimized_bytes).decode("utf-8")

    prompt = (
        "You are a helpful nature observation assistant. Your task is to analyze the provided image.\n"
        "Return a JSON object containing the exact following keys:\n"
        "- title: A short, useful observation title.\n"
        "- type: A concise description of the kind of subject (e.g., 'Plant', 'Fungus', 'Insect', 'Geological formation').\n"
        "- description: A friendly explanation of what is visibly present and why it might be interesting.\n"
        "- look_closer: One specific detail the user can examine in person.\n"
        "- certainty: 'high', 'medium', or 'low'.\n"
        "- is_uncertain: true or false.\n\n"
        "CRITICAL INSTRUCTIONS:\n"
        "1. Do not invent exact species names, causes, or scientific facts if you are not certain.\n"
        "2. Distinguish visible evidence from guesses.\n"
        "3. Acknowledge uncertainty explicitly.\n"
        "4. Respond with ONLY valid JSON."
    )

    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {
                "role": "user",
                "content": prompt,
                "images": [image_base64]
            }
        ],
        "format": "json",
        "stream": False,
        "keep_alive": "30m",
        "options": {
            "num_predict": 768,
            "temperature": 0.2,
            "num_ctx": 2048
        }
    }

    t_ollama_start = time.time()
    try:
        # Bounded at 25s timeout to stop slow inference bottlenecks
        async with httpx.AsyncClient(timeout=25.0) as client:
            response = await client.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload)
            response.raise_for_status()
            result = response.json()
    except httpx.ConnectError:
        logger.error(f"Cannot connect to Ollama at {OLLAMA_BASE_URL}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Ollama server is unavailable at {OLLAMA_BASE_URL}. Switch to Demo Mode or ensure Ollama is running."
        )
    except httpx.TimeoutException:
        logger.error("Ollama inference timed out after 25s")
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Local AI inference timed out (>25s). Your local GPU/CPU is too slow for real-time inference. Switch to Demo Mode for instant sample observations."
        )
    except httpx.HTTPStatusError as e:
        logger.error(f"Ollama returned HTTP error: {e.response.status_code}")
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Ollama server returned error {e.response.status_code}: {e.response.text}"
        )
    except Exception as e:
        logger.error(f"Unexpected request error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error communicating with local AI model: {str(e)}"
        )

    t_ollama_elapsed = time.time() - t_ollama_start
    total_elapsed = time.time() - t_start

    load_duration = result.get("load_duration", 0) / 1e9
    prompt_eval_duration = result.get("prompt_eval_duration", 0) / 1e9
    prompt_eval_count = result.get("prompt_eval_count", 0)
    eval_duration = result.get("eval_duration", 0) / 1e9
    eval_count = result.get("eval_count", 0)

    logger.info(
        f"Ollama timings: load={load_duration:.2f}s, "
        f"prompt_eval={prompt_eval_duration:.2f}s ({prompt_eval_count} tokens), "
        f"eval={eval_duration:.2f}s ({eval_count} tokens), "
        f"wall_clock={total_elapsed:.2f}s"
    )

    message = result.get("message", {}).get("content", "")
    try:
        parsed = extract_json_from_text(message)
    except Exception as err:
        logger.error(f"Failed to extract JSON from message: {message}. Error: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Model returned invalid JSON format."
        )

    normalized_observation = {
        "title": str(parsed.get("title") or "Nature Subject").strip(),
        "type": str(parsed.get("type") or "Living organism").strip(),
        "description": str(parsed.get("description") or "Observed specimen in natural setting.").strip(),
        "look_closer": str(parsed.get("look_closer") or "Notice the texture, color pattern, and surrounding habitat.").strip(),
        "certainty": str(parsed.get("certainty") or "medium").lower(),
        "is_uncertain": bool(parsed.get("is_uncertain", False))
    }

    if normalized_observation["certainty"] not in ("high", "medium", "low"):
        normalized_observation["certainty"] = "medium"

    return {
        "status": "success",
        "is_demo": False,
        "observation": normalized_observation,
        "timings": {
            "preprocessing_ms": round(t_prep * 1000, 1),
            "model_load_s": round(load_duration, 2),
            "prompt_eval_s": round(prompt_eval_duration, 2),
            "token_eval_s": round(eval_duration, 2),
            "total_wall_clock_s": round(total_elapsed, 2),
            "eval_tokens": eval_count
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting server on port {port} (DEMO_MODE={DEMO_MODE})")
    uvicorn.run("main:app", host="0.0.0.0", port=port)

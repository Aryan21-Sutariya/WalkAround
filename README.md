# WalkAround 🌿

> *A paper-cut nature journal encouraging mindful outdoor exploration, powered by local open-weight Google Gemma AI and instant cloud demo modes.*<br />
> Built for the **Hacktoberfest 2026 Week 1 "Touch Grass"** Challenge.

---

## 🧭 Overview

**WalkAround** inverts typical smartphone habits:
1. **Phone Away**: When you begin a walk, WalkAround encourages you to look around you, listen to the wind, and keep your phone in your pocket.
2. **On-Demand Capture**: When you spot an interesting botanical or wildlife specimen, you can capture a photo with your camera, upload an image from your device, or explore curated specimens.
3. **Open-Weight Gemma AI & Fast Demo**: Analyzes specimens using Google's open-weight Gemma 4 vision model locally, or instantly serves authentic curated specimens in Demo Mode (<50ms).
4. **Field Journal & Summary**: Records your walk route, noticed specimens, and generates a downloadable PDF Field Journal.

---

## 🚀 Two Running Modes

### 1. Fast Public Demo Mode (Recommended for Render & Web Previews)
- Set `DEMO_MODE=true` in `backend/.env` or as an environment variable.
- Responds in **< 50 milliseconds** using authentic curated nature observations (Wood Fern, Turkey Tail Fungus, Honey Bee, Oak Lichen).
- Does **not** require Ollama or local GPU hardware.
- Transparently labels observations with a prominent **Demo Mode — Sample Observations** badge.

### 2. Local Google Gemma AI Mode
- Requires [Ollama](https://ollama.com) running locally with `gemma4:e2b`.
- Uses Pillow proportional image preprocessing (Lanczos downscaled to 512px, JPEG quality 80) to optimize inference speed.
- Automatically falls back to offering Demo Mode if local inference exceeds 25 seconds.

---

## 💻 Local Setup & Development

### 1. AI Backend (FastAPI)

```bash
# Navigate to backend
cd backend

# Create & activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn main:app --reload --port 8000
```

*Backend runs at `http://127.0.0.1:8000`. Health check available at `http://127.0.0.1:8000/api/health`.*

### 2. Frontend UI (React + Vite)

```bash
# In a separate terminal, navigate to frontend
cd frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```

*Frontend runs at `http://localhost:3000` (or `http://localhost:5173`).*

---

## ☁️ Render Deployment (One-Click Blueprint)

WalkAround includes a pre-configured `render.yaml` Blueprint for deploying both services to Render's free tier.

### Option A: Using Render Blueprint (Recommended)
1. Push your repository to GitHub.
2. Go to the [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Blueprint**.
3. Select your `WalkAround` repository.
4. Render will automatically configure:
   - **`walkaround-backend`**: Python Web Service running on `$PORT` with `DEMO_MODE=true`.
   - **`walkaround-frontend`**: Static Site publishing `frontend/dist` with `VITE_API_URL` pointing to the backend.

### Option B: Manual Render Setup
- **Backend Service**:
  - Runtime: Python 3
  - Build Command: `pip install -r backend/requirements.txt`
  - Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
  - Environment Variables: `DEMO_MODE=true`, `ALLOWED_ORIGINS=*`
- **Frontend Static Site**:
  - Build Command: `cd frontend && npm install && npm run build`
  - Publish Directory: `frontend/dist`
  - Environment Variables: `VITE_API_URL=https://<your-backend-name>.onrender.com`

---

## 🧪 Verification & Testing

- **Backend Test Suite**:
  ```bash
  python backend/test_api.py
  ```
  *Tests health endpoints, sample observations, demo queries, and image validation.*

- **Frontend Production Build**:
  ```bash
  cd frontend && npm run build
  ```
  *Verifies that the entire application bundles with zero syntax or typescript errors.*

---

## 📜 License
MIT License. Created for Hacktoberfest 2026.

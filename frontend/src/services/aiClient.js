const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

// Client-side fallback sample observations in case the backend is completely offline
const OFFLINE_SAMPLE_OBSERVATIONS = [
  {
    title: "Wood Fern (Dryopteris carthusiana)",
    type: "Fern / Vascular Plant",
    description: "Graceful bipinnate fronds with intricate triangular pinnae, thriving in moist, shaded forest understories.",
    look_closer: "Inspect the undersides of the fronds for tiny, kidney-shaped indusia protecting clusters of spore-bearing sporangia.",
    certainty: "high",
    is_uncertain: false
  },
  {
    title: "Honey Bee (Apis mellifera) on Clover",
    type: "Insect / Pollinator",
    description: "Worker bee actively gathering nectar and pollen from blooming white clover florets.",
    look_closer: "Look closely at the hind legs for pollen baskets (corbiculae) packed with bright yellow pollen pellets.",
    certainty: "high",
    is_uncertain: false
  }
];

/**
 * Directly fetches a fast, honest sample observation for public demonstration.
 */
export async function fetchSampleObservation(externalSignal) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/sample-observation`, {
      signal: externalSignal
    });
    if (res.ok) {
      const data = await res.json();
      return {
        observation: data.observation,
        is_demo: true,
        demo_disclaimer: data.demo_disclaimer || "Demo Mode — Curated Sample Observation. Displayed for public demonstration.",
        timings: data.timings || {}
      };
    }
  } catch (_) {}

  // Fallback if backend is offline
  const sample = OFFLINE_SAMPLE_OBSERVATIONS[Math.floor(Math.random() * OFFLINE_SAMPLE_OBSERVATIONS.length)];
  return {
    observation: sample,
    is_demo: true,
    demo_disclaimer: "Demo Mode — Curated Sample Observation. Displayed for public demonstration without active GPU.",
    timings: { total_wall_clock_s: 0.01 }
  };
}

/**
 * Analyzes an image with the WalkAround AI backend.
 * Supports caller-provided AbortSignal and enforces a 30-second client timeout for local inference.
 * 
 * @param {string} imageDataUrl - Object URL or data URL of the image to analyze
 * @param {AbortSignal} [externalSignal] - Optional caller AbortSignal for user cancellation
 * @param {boolean} [useDemo=false] - Explicitly request fast demo mode
 * @returns {Promise<{observation: object, is_demo?: boolean, demo_disclaimer?: string, timings?: object}>}
 */
export async function analyzeImage(imageDataUrl, externalSignal, useDemo = false) {
  if (useDemo) {
    return fetchSampleObservation(externalSignal);
  }

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort(new Error("Local AI inference timed out (>30s). Gemma 4 takes too long on this device. Please switch to Demo Mode."));
  }, 32000);

  let combinedSignal = timeoutController.signal;
  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timeoutId);
      throw new Error("Analysis cancelled by user.");
    }
    externalSignal.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      timeoutController.abort(new Error("Analysis cancelled by user."));
    });
  }

  try {
    const res = await fetch(imageDataUrl);
    if (!res.ok) {
      throw new Error("Unable to read captured image data.");
    }
    const blob = await res.blob();

    const formData = new FormData();
    formData.append('file', blob, 'capture.jpg');

    const response = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
      signal: combinedSignal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMsg = `Server error (HTTP ${response.status})`;
      try {
        const errData = await response.json();
        if (errData?.detail) {
          errorMsg = errData.detail;
        }
      } catch (_) {}

      if (response.status === 503) {
        throw new Error(errorMsg || "AI inference service is currently unavailable. Switch to Demo Mode for instant sample observations.");
      } else if (response.status === 504) {
        throw new Error("Local AI model timed out (>25s). Your hardware is too slow for real-time inference. Switch to Demo Mode.");
      } else if (response.status === 400) {
        throw new Error(errorMsg || "Invalid or unsupported image file.");
      } else {
        throw new Error(errorMsg);
      }
    }

    const data = await response.json();
    return {
      observation: data.observation,
      is_demo: data.is_demo || false,
      demo_disclaimer: data.demo_disclaimer || "",
      timings: data.timings || {}
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError' || combinedSignal.aborted) {
      const reasonMsg = combinedSignal.reason?.message || combinedSignal.reason;
      if (reasonMsg && typeof reasonMsg === 'string' && reasonMsg.includes("timed out")) {
        throw new Error(reasonMsg);
      }
      throw new Error("Analysis cancelled.");
    }

    if (err.message && (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"))) {
      throw new Error(`Cannot connect to AI backend at ${BACKEND_URL}. You can still explore with Demo Mode.`);
    }

    throw new Error(err.message || "Failed to analyze image.");
  }
}

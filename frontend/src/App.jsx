import { useState, useEffect, useRef } from "react";
import { Atmosphere } from "./components/Atmosphere";
import { HomeScreen } from "./pages/HomeScreen";
import { ActiveWalkScreen } from "./pages/ActiveWalkScreen";
import { CameraScreen } from "./pages/CameraScreen";
import { AnalysisScreen } from "./pages/AnalysisScreen";
import { ObservationScreen } from "./pages/ObservationScreen";
import { SummaryScreen } from "./pages/SummaryScreen";
import { MapScreen } from "./features/map/MapScreen";
import { DISCOVERIES_POOL } from "./data/discoveries";
import { useGeolocation } from "./hooks/useGeolocation";
import { getHistory, clearHistory, saveActiveSession, getActiveSession, clearActiveSession } from "./services/historyStorage";
import { analyzeImage } from "./services/aiClient";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [previousScreen, setPreviousScreen] = useState("home");
  const [walkStartTime, setWalkStartTime] = useState(null);
  const [savedObservations, setSavedObservations] = useState([]);
  const [currentCapturedImage, setCurrentCapturedImage] = useState("");
  const [currentObservation, setCurrentObservation] = useState(null);
  const [discoveryIndex, setDiscoveryIndex] = useState(0);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const session = getActiveSession();
    if (session) {
      setShowResumePrompt(true);
    }
  }, []);

  const isWalking = screen === "active_walk" || screen === "camera" || screen === "analyzing" || screen === "observation" || screen === "map";
  const { hasPermission, currentPosition } = useGeolocation(isWalking);

  const getCurrentFormattedTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleStartWalk = () => {
    const start = Date.now();
    setWalkStartTime(start);
    setSavedObservations([]);
    setDiscoveryIndex(0);
    saveActiveSession({ startTime: start });
    setScreen("active_walk");
  };

  const handleResumeWalk = () => {
    const session = getActiveSession();
    setWalkStartTime(session.startTime);
    setShowResumePrompt(false);
    setScreen("active_walk");
  };

  const handleDiscardWalk = () => {
    clearActiveSession();
    setShowResumePrompt(false);
  };

  const handleOpenCapture = () => {
    setScreen("camera");
  };

  const cleanupImage = () => {
    if (currentCapturedImage && currentCapturedImage.startsWith('blob:')) {
      URL.revokeObjectURL(currentCapturedImage);
    }
    setCurrentCapturedImage("");
  };

  const handleCapture = async (imageDataUrl) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setCurrentCapturedImage(imageDataUrl);
    setAnalysisError(null);
    setScreen("analyzing");
    
    try {
      const res = await analyzeImage(imageDataUrl, controller.signal);
      if (res && res.observation) {
        const obsData = res.observation;
        const newObservation = {
          id: `obs-${Date.now()}`,
          title: obsData.title,
          type: obsData.type,
          description: obsData.description,
          closerDetail: obsData.look_closer,
          confidence: obsData.certainty === "high" ? 0.95 : (obsData.certainty === "medium" ? 0.75 : 0.4),
          is_uncertain: obsData.is_uncertain,
          is_demo: res.is_demo || false,
          demo_disclaimer: res.demo_disclaimer || "",
          imageUrl: imageDataUrl,
          timestamp: getCurrentFormattedTime(),
          capturedAt: Date.now(),
          ...(currentPosition && { lat: currentPosition.lat, lng: currentPosition.lng })
        };
        setCurrentObservation(newObservation);
        setScreen("observation");
      }
    } catch (err) {
      if (controller.signal.aborted) {
        return; // Aborted by user
      }
      setAnalysisError(err.message || "Failed to analyze image.");
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  };

  const handleAnalysisCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    cleanupImage();
    setAnalysisError(null);
    setScreen("camera");
  };

  const handleAnalysisRetry = () => {
    if (currentCapturedImage) {
      handleCapture(currentCapturedImage);
    }
  };

  const handleSwitchToDemo = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setAnalysisError(null);
    setScreen("analyzing");

    try {
      const res = await analyzeImage(currentCapturedImage || "", controller.signal, true);
      if (res && res.observation) {
        const obsData = res.observation;
        const newObservation = {
          id: `obs-${Date.now()}`,
          title: obsData.title,
          type: obsData.type,
          description: obsData.description,
          closerDetail: obsData.look_closer,
          confidence: obsData.certainty === "high" ? 0.95 : (obsData.certainty === "medium" ? 0.75 : 0.4),
          is_uncertain: obsData.is_uncertain,
          is_demo: true,
          demo_disclaimer: res.demo_disclaimer || "Demo Mode — Curated Sample Observation. Displayed for demonstration without GPU requirements.",
          imageUrl: currentCapturedImage || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80",
          timestamp: getCurrentFormattedTime(),
          capturedAt: Date.now(),
          ...(currentPosition && { lat: currentPosition.lat, lng: currentPosition.lng })
        };
        setCurrentObservation(newObservation);
        setScreen("observation");
      }
    } catch (err) {
      setAnalysisError(err.message || "Failed to load sample observation.");
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  };

  const handleSaveObservation = () => {
    if (currentObservation) {
      setSavedObservations((prev) => [...prev, currentObservation]);
    }
    setCurrentObservation(null);
    setCurrentCapturedImage("");
    // Specifically don't revoke object URL here if we saved it because Observation uses it in Summary
    setScreen("active_walk");
  };

  const handleTryAgain = () => {
    setCurrentObservation(null);
    cleanupImage();
    setScreen("camera");
  };

  const handleEndWalk = () => {
    if (savedObservations.length === 0) {
      const sampleTime = getCurrentFormattedTime();
      const defaultSamples = [
        {
          id: "sample-1",
          title: DISCOVERIES_POOL[0].title,
          type: DISCOVERIES_POOL[0].type,
          description: DISCOVERIES_POOL[0].description,
          closerDetail: DISCOVERIES_POOL[0].closerDetail,
          confidence: DISCOVERIES_POOL[0].confidence,
          imageUrl: DISCOVERIES_POOL[0].fallbackImage,
          timestamp: sampleTime,
          capturedAt: Date.now() - 25 * 60 * 1e3
        },
        {
          id: "sample-2",
          title: DISCOVERIES_POOL[1].title,
          type: DISCOVERIES_POOL[1].type,
          description: DISCOVERIES_POOL[1].description,
          closerDetail: DISCOVERIES_POOL[1].closerDetail,
          confidence: DISCOVERIES_POOL[1].confidence,
          imageUrl: DISCOVERIES_POOL[1].fallbackImage,
          timestamp: sampleTime,
          capturedAt: Date.now() - 12 * 60 * 1e3
        }
      ];
      setSavedObservations(defaultSamples);
    }
    clearActiveSession();
    setScreen("summary");
  };

  const handleDone = () => {
    setWalkStartTime(null);
    // Cleanup any lingering internal object URLs
    savedObservations.forEach(obs => {
        if (obs.imageUrl && obs.imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(obs.imageUrl);
        }
    });
    setSavedObservations([]);
    setCurrentObservation(null);
    setDiscoveryIndex(0);
    setScreen("home");
  };

  const getWalkDuration = () => {
    if (!walkStartTime) return 37;
    const elapsedMinutes = Math.round((Date.now() - walkStartTime) / 6e4);
    return Math.max(elapsedMinutes, 1);
  };

  const handleOpenMap = () => {
    setPreviousScreen(screen);
    setScreen("map");
  };

  return (
    <div className="relative h-[100dvh] w-full bg-[#8AC7EA] text-[#2E1B10] overflow-hidden flex flex-col">
      <Atmosphere showCelestial={screen !== "camera"} />

      {showResumePrompt && (
        <div className="absolute inset-0 z-50 bg-[#2E1B10]/80 flex items-center justify-center p-4">
          <div className="bg-[#FAF6ED] p-6 rounded-2xl border-4 border-[#2E1B10] shadow-[0_8px_0_#2E1B10] text-center max-w-sm">
            <h2 className="font-display font-black text-xl mb-4">Resume active walk?</h2>
            <div className="flex gap-4 w-full">
               <button onClick={handleDiscardWalk} className="flex-1 py-3 text-sm font-bold bg-[#EF476F] border-2 border-[#2E1B10] rounded-xl shadow-[0_4px_0_#2E1B10] text-white pointer-events-auto">Discard</button>
               <button onClick={handleResumeWalk} className="flex-1 py-3 text-sm font-bold bg-[#42A85F] border-2 border-[#2E1B10] rounded-xl shadow-[0_4px_0_#2E1B10] text-white block pointer-events-auto">Resume</button>
            </div>
          </div>
        </div>
      )}

      {screen === "home" && <HomeScreen onStartWalk={handleStartWalk} onOpenMap={handleOpenMap} />}
      {screen === "active_walk" && <ActiveWalkScreen noticedCount={savedObservations.length} onOpenCapture={handleOpenCapture} onUploadPhoto={handleCapture} onEndWalk={handleEndWalk} onOpenMap={handleOpenMap} />}
      {screen === "camera" && <CameraScreen onCapture={handleCapture} onClose={() => setScreen("active_walk")} />}
      {screen === "analyzing" && <AnalysisScreen capturedImageUrl={currentCapturedImage} error={analysisError} onRetry={handleAnalysisRetry} onCancel={handleAnalysisCancel} onSwitchToDemo={handleSwitchToDemo} />}
      {screen === "observation" && currentObservation && <ObservationScreen observation={currentObservation} onSave={handleSaveObservation} onTryAgain={handleTryAgain} />}
      {screen === "summary" && <SummaryScreen observations={savedObservations} durationMinutes={getWalkDuration()} onDone={handleDone} />}
      
      {screen === "map" && <MapScreen onClose={() => setScreen(previousScreen)} points={getHistory()} onClearHistory={() => { clearHistory(); setScreen(previousScreen); }} />}
    </div>
  );
}

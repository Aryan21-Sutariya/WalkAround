import { useState } from "react";
import { Atmosphere } from "./components/Atmosphere";
import { HomeScreen } from "./components/HomeScreen";
import { ActiveWalkScreen } from "./components/ActiveWalkScreen";
import { CameraScreen } from "./components/CameraScreen";
import { AnalysisScreen } from "./components/AnalysisScreen";
import { ObservationScreen } from "./components/ObservationScreen";
import { SummaryScreen } from "./components/SummaryScreen";
import { DISCOVERIES_POOL } from "./data/discoveries";
export default function App() {
  const [screen, setScreen] = useState("home");
  const [walkStartTime, setWalkStartTime] = useState(null);
  const [savedObservations, setSavedObservations] = useState([]);
  const [currentCapturedImage, setCurrentCapturedImage] = useState("");
  const [currentObservation, setCurrentObservation] = useState(null);
  const [discoveryIndex, setDiscoveryIndex] = useState(0);
  const getCurrentFormattedTime = () => {
    const now = /* @__PURE__ */ new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const handleStartWalk = () => {
    setWalkStartTime(Date.now());
    setSavedObservations([]);
    setDiscoveryIndex(0);
    setScreen("active_walk");
  };
  const handleOpenCapture = () => {
    setScreen("camera");
  };
  const handleCapture = (imageDataUrl) => {
    setCurrentCapturedImage(imageDataUrl);
    const template = DISCOVERIES_POOL[discoveryIndex % DISCOVERIES_POOL.length];
    setDiscoveryIndex((prev) => prev + 1);
    const newObservation = {
      id: `obs-${Date.now()}`,
      title: template.title,
      type: template.type,
      description: template.description,
      closerDetail: template.closerDetail,
      confidence: template.confidence,
      imageUrl: imageDataUrl || template.fallbackImage,
      timestamp: getCurrentFormattedTime(),
      capturedAt: Date.now()
    };
    setCurrentObservation(newObservation);
    setScreen("analyzing");
  };
  const handleAnalysisComplete = () => {
    setScreen("observation");
  };
  const handleSaveObservation = () => {
    if (currentObservation) {
      setSavedObservations((prev) => [...prev, currentObservation]);
    }
    setCurrentObservation(null);
    setCurrentCapturedImage("");
    setScreen("active_walk");
  };
  const handleTryAgain = () => {
    setCurrentObservation(null);
    setCurrentCapturedImage("");
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
    setScreen("summary");
  };
  const handleDone = () => {
    setWalkStartTime(null);
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
  return <div className="relative h-[100dvh] w-full bg-[#8AC7EA] text-[#2E1B10] overflow-hidden flex flex-col">
      {
    /* Living Animated Whimsical Block Nature Atmosphere */
  }
      <Atmosphere showCelestial={screen !== "camera"} />

      {
    /* Screen Router */
  }
      {screen === "home" && <HomeScreen onStartWalk={handleStartWalk} />}

      {screen === "active_walk" && <ActiveWalkScreen
    noticedCount={savedObservations.length}
    onOpenCapture={handleOpenCapture}
    onEndWalk={handleEndWalk}
  />}

      {screen === "camera" && <CameraScreen
    onCapture={handleCapture}
    onClose={() => setScreen("active_walk")}
  />}

      {screen === "analyzing" && <AnalysisScreen
    capturedImageUrl={currentCapturedImage}
    onAnalysisComplete={handleAnalysisComplete}
  />}

      {screen === "observation" && currentObservation && <ObservationScreen
    observation={currentObservation}
    onSave={handleSaveObservation}
    onTryAgain={handleTryAgain}
  />}

      {screen === "summary" && <SummaryScreen
    observations={savedObservations}
    durationMinutes={getWalkDuration()}
    onDone={handleDone}
  />}
    </div>;
}

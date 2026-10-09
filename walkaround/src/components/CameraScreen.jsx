import { useEffect, useRef, useState } from "react";
import { X, RefreshCw, Upload, Crosshair } from "lucide-react";
import { DISCOVERIES_POOL } from "../data/discoveries";
export const CameraScreen = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [cameraError, setCameraError] = useState(false);
  const streamRef = useRef(null);
  useEffect(() => {
    let isMounted = true;
    async function initCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(true);
        return;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 960 }
          },
          audio: false
        });
        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {
          });
        }
        setStreamActive(true);
        setCameraError(false);
      } catch (err) {
        console.warn("Camera fallback activated", err);
        if (isMounted) {
          setCameraError(true);
          setStreamActive(false);
        }
      }
    }
    initCamera();
    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);
  const handleShutter = () => {
    if (streamActive && videoRef.current) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
          onCapture(dataUrl);
          return;
        }
      } catch (err) {
        console.warn("Canvas capture fallback", err);
      }
    }
    const randomTemplate = DISCOVERIES_POOL[Math.floor(Math.random() * DISCOVERIES_POOL.length)];
    onCapture(randomTemplate.fallbackImage);
  };
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCapture(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  return <div className="fixed inset-0 z-50 bg-[#85C7E8] flex flex-col justify-between select-none overflow-hidden">
      {
    /* Top Header Bar */
  }
      <header className="relative z-20 flex items-center justify-between px-6 py-5">
        <button
    onClick={onClose}
    type="button"
    aria-label="Close viewfinder"
    className="w-11 h-11 rounded-2xl bg-[#FAF6ED] border-3 border-[#2E1B10] shadow-[0_3px_0_#2E1B10] text-[#2E1B10] flex items-center justify-center hover:bg-[#FFFFFF] active:translate-y-1 active:shadow-[0_1px_0_#2E1B10] transition-all cursor-pointer"
  >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="px-5 py-1.5 bg-[#FFB703] border-3 border-[#2E1B10] rounded-xl shadow-[0_3px_0_#2E1B10]">
          <p className="font-display font-black text-sm text-[#2E1B10] uppercase tracking-wider">
            Found something?
          </p>
        </div>

        <div className="w-11 flex justify-end">
          {streamActive && <button
    onClick={() => setFacingMode((prev) => prev === "environment" ? "user" : "environment")}
    type="button"
    aria-label="Flip camera"
    className="w-11 h-11 rounded-2xl bg-[#FAF6ED] border-3 border-[#2E1B10] shadow-[0_3px_0_#2E1B10] text-[#2E1B10] flex items-center justify-center hover:bg-[#FFFFFF] active:translate-y-1 active:shadow-[0_1px_0_#2E1B10] transition-all cursor-pointer"
  >
              <RefreshCw className="w-4 h-4 stroke-[2]" />
            </button>}
        </div>
      </header>

      {
    /* Storybook Wooden Viewfinder Frame */
  }
      <main className="relative flex-1 flex items-center justify-center px-4 sm:px-8">
        <div className="relative w-full max-w-md aspect-[3/4] sm:aspect-[4/3] rounded-3xl overflow-hidden border-4 border-[#2E1B10] shadow-[0_8px_0_#2E1B10,0_16px_30px_rgba(46,27,16,0.3)] bg-[#2F4F38]">
          {
    /* Live Video or Cozy Game Viewfinder Fallback */
  }
          {streamActive ? <video
    ref={videoRef}
    autoPlay
    playsInline
    muted
    className="w-full h-full object-cover"
  /> : <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#42A85F] via-[#2F7C48] to-[#1C4425] flex flex-col items-center justify-center p-6 text-center">
              <div className="relative z-10 max-w-xs flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-[#FFB703] border-3.5 border-[#2E1B10] shadow-[0_4px_0_#2E1B10] flex items-center justify-center mb-3">
                  <Crosshair className="w-8 h-8 text-[#2E1B10] animate-spin" style={{ animationDuration: "12s" }} />
                </div>
                <h3 className="font-display font-black text-xl text-[#FFFDF8] drop-shadow-[0_2px_0_#2E1B10] mb-1">
                  Nature Viewfinder
                </h3>
                <p className="text-xs font-sans text-[#E8F5E9] leading-relaxed mb-4 font-medium">
                  Point toward any curious flower, bark pattern, butterfly, or mushroom.
                </p>
                <label className="wood-btn-amber inline-flex items-center gap-2 px-4 py-2 text-xs font-display font-black cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo</span>
                  <input
    type="file"
    accept="image/*"
    capture="environment"
    onChange={handleFileUpload}
    className="hidden"
  />
                </label>
              </div>

              {
    /* Background Nature Tile Grid */
  }
              <div
    className="absolute inset-0 opacity-15 pointer-events-none"
    style={{
      backgroundImage: `
                    linear-gradient(to right, #2E1B10 2px, transparent 2px),
                    linear-gradient(to bottom, #2E1B10 2px, transparent 2px)
                  `,
      backgroundSize: "32px 32px"
    }}
  />
            </div>}

          {
    /* Chunky Brass & Leaf Corner Brackets */
  }
          <div className="absolute top-3 left-3 w-7 h-7 border-t-4 border-l-4 border-[#FFB703] rounded-tl-lg pointer-events-none drop-shadow-[0_2px_0_#2E1B10]" />
          <div className="absolute top-3 right-3 w-7 h-7 border-t-4 border-r-4 border-[#FFB703] rounded-tr-lg pointer-events-none drop-shadow-[0_2px_0_#2E1B10]" />
          <div className="absolute bottom-3 left-3 w-7 h-7 border-b-4 border-l-4 border-[#FFB703] rounded-bl-lg pointer-events-none drop-shadow-[0_2px_0_#2E1B10]" />
          <div className="absolute bottom-3 right-3 w-7 h-7 border-b-4 border-r-4 border-[#FFB703] rounded-br-lg pointer-events-none drop-shadow-[0_2px_0_#2E1B10]" />

          {
    /* Center Target Flower Reticle */
  }
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-2xl border-2.5 border-dashed border-[#FFFDF8]/80 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFB703] border border-[#2E1B10]" />
            </div>
          </div>
        </div>
      </main>

      {
    /* Bottom Shutter Button */
  }
      <footer className="relative z-20 pb-8 pt-2 flex flex-col items-center justify-center">
        <button
    onClick={handleShutter}
    type="button"
    aria-label="Capture photo"
    className="group relative flex items-center justify-center w-20 h-20 rounded-3xl bg-[#56C275] border-4 border-[#2E1B10] shadow-[0_6px_0_#2E1B10,0_12px_20px_rgba(46,27,16,0.3)] hover:shadow-[0_8px_0_#2E1B10] hover:-translate-y-1 active:translate-y-1.5 active:shadow-[0_2px_0_#2E1B10] transition-all duration-150 cursor-pointer"
  >
          <div className="w-12 h-12 rounded-2xl bg-[#FFFDF8] border-2.5 border-[#2E1B10] group-hover:scale-95 group-active:scale-90 transition-transform" />
        </button>
      </footer>
    </div>;
};

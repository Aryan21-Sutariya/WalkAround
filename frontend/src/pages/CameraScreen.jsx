import { useEffect, useRef, useState, useCallback } from "react";
import { X, RefreshCw, Upload, Crosshair, AlertCircle, Camera, Image as ImageIcon } from "lucide-react";

export const CameraScreen = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [cameraRequested, setCameraRequested] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [cameraError, setCameraError] = useState("");
  const [fileError, setFileError] = useState("");

  const stopTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
    setVideoPlaying(false);
  }, []);

  const handleClose = () => {
    stopTracks();
    setCameraRequested(false);
    onClose();
  };

  const startCamera = () => {
    setCameraError("");
    setCameraRequested(true);
  };

  useEffect(() => {
    if (!cameraRequested) {
      stopTracks();
      return;
    }

    let isMounted = true;

    async function initCamera() {
      setCameraError("");
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (isMounted) {
          setCameraError("Camera access is not supported by this browser. Please upload a photo instead.");
          setStreamActive(false);
        }
        return;
      }

      // Stop previous tracks before starting new stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
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
          videoRef.current.play().then(() => {
            if (isMounted) setVideoPlaying(true);
          }).catch((err) => {
            console.warn("Video playback auto-play error:", err);
          });
        }

        setStreamActive(true);
        setCameraError("");
      } catch (err) {
        console.warn("Camera access failed:", err);
        if (isMounted) {
          const errMsg = err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
            ? "Camera permission denied. Enable camera access in your browser or choose a photo below."
            : "No camera found or camera is in use by another app. You can upload a photo instead.";
          setCameraError(errMsg);
          setStreamActive(false);
          setVideoPlaying(false);
        }
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [cameraRequested, facingMode, stopTracks]);

  // Handle video element mount callback to guarantee srcObject connection
  const videoRefCallback = useCallback((el) => {
    videoRef.current = el;
    if (el && streamRef.current && el.srcObject !== streamRef.current) {
      el.srcObject = streamRef.current;
      el.play().then(() => {
        setVideoPlaying(true);
      }).catch((e) => console.warn("Video play error on ref bind:", e));
    }
  }, []);

  const handleShutter = () => {
    if (!streamActive || !videoPlaying || !videoRef.current) {
      return;
    }

    const video = videoRef.current;
    if (video.videoWidth <= 0 || video.videoHeight <= 0) {
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob && blob.size > 0) {
            stopTracks();
            const url = URL.createObjectURL(blob);
            onCapture(url);
          }
        }, "image/jpeg", 0.85);
      }
    } catch (err) {
      console.error("Canvas capture error:", err);
    }
  };

  const handleFileUpload = (e) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setFileError("Upload failed: Image exceeds 8MB limit.");
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setFileError("Upload failed: Only JPEG, PNG, and WebP are supported.");
        return;
      }
      stopTracks();
      const url = URL.createObjectURL(file);
      onCapture(url);
    }
    // Clear input so same file can be selected again if retried
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#85C7E8] flex flex-col justify-between select-none overflow-hidden">
      {/* Hidden file input with NO capture attribute to strictly open system file dialog */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileUpload}
        className="hidden"
      />

      <header className="relative z-20 flex items-center justify-between px-6 py-5">
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close viewfinder"
          className="w-11 h-11 rounded-2xl bg-[#FAF6ED] border-3 border-[#2E1B10] shadow-[0_3px_0_#2E1B10] text-[#2E1B10] flex items-center justify-center hover:bg-[#FFFFFF] active:translate-y-1 active:shadow-[0_1px_0_#2E1B10] transition-all cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="px-5 py-1.5 bg-[#FFB703] border-3 border-[#2E1B10] rounded-xl shadow-[0_3px_0_#2E1B10]">
          <p className="font-display font-black text-sm text-[#2E1B10] uppercase tracking-wider">
            {streamActive ? "Capturing Nature" : "Choose Capture Method"}
          </p>
        </div>

        <div className="w-11 flex justify-end">
          {streamActive && (
            <button
              onClick={() => setFacingMode((prev) => prev === "environment" ? "user" : "environment")}
              type="button"
              aria-label="Flip camera"
              className="w-11 h-11 rounded-2xl bg-[#FAF6ED] border-3 border-[#2E1B10] shadow-[0_3px_0_#2E1B10] text-[#2E1B10] flex items-center justify-center hover:bg-[#FFFFFF] active:translate-y-1 active:shadow-[0_1px_0_#2E1B10] transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 stroke-[2]" />
            </button>
          )}
        </div>
      </header>

      {fileError && (
        <div className="absolute top-24 inset-x-0 mx-auto z-30 max-w-sm flex items-center gap-2 p-3 bg-[#E63946] border-3 border-[#2E1B10] rounded-xl shadow-[0_4px_0_#2E1B10] text-white">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-xs font-mono font-black uppercase">{fileError}</span>
        </div>
      )}

      <main className="relative flex-1 flex items-center justify-center px-4 sm:px-8">
        <div className="relative w-full max-w-md aspect-[3/4] sm:aspect-[4/3] rounded-3xl overflow-hidden border-4 border-[#2E1B10] shadow-[0_8px_0_#2E1B10,0_16px_30px_rgba(46,27,16,0.3)] bg-[#2F4F38]">
          {/* Always mount video element so ref is bound, toggle visibility based on streamActive */}
          <video
            ref={videoRefCallback}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${streamActive ? 'block' : 'hidden'}`}
          />

          {!streamActive && (
            <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#42A85F] via-[#2F7C48] to-[#1C4425] flex flex-col items-center justify-center p-6 text-center">
              <div className="relative z-10 max-w-xs flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-[#FFB703] border-3.5 border-[#2E1B10] shadow-[0_4px_0_#2E1B10] flex items-center justify-center mb-3">
                  <Crosshair className="w-8 h-8 text-[#2E1B10] animate-spin" style={{ animationDuration: "16s" }} />
                </div>
                <h3 className="font-display font-black text-xl text-[#FFFDF8] drop-shadow-[0_2px_0_#2E1B10] mb-1">
                  Nature Viewfinder
                </h3>
                <p className="text-xs font-sans text-[#E8F5E9] leading-relaxed mb-5 font-medium px-2">
                  {cameraError || "Start your device camera or upload an existing nature photo from your files."}
                </p>

                {/* Two Clear Choices: Camera vs Upload */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={startCamera}
                    type="button"
                    className="flex-1 wood-btn-primary py-3 px-4 flex items-center justify-center gap-2 text-xs font-display font-black uppercase tracking-wider cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Start Camera</span>
                  </button>

                  <button
                    onClick={triggerFilePicker}
                    type="button"
                    className="flex-1 wood-btn-amber py-3 px-4 flex items-center justify-center gap-2 text-xs font-display font-black uppercase tracking-wider cursor-pointer"
                  >
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    <span>Upload Photo</span>
                  </button>
                </div>
              </div>

              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, #2E1B10 2px, transparent 2px), linear-gradient(to bottom, #2E1B10 2px, transparent 2px)`,
                  backgroundSize: "32px 32px"
                }}
              />
            </div>
          )}

          <div className="absolute top-3 left-3 w-7 h-7 border-t-4 border-l-4 border-[#FFB703] rounded-tl-lg pointer-events-none drop-shadow-[0_2px_0_#2E1B10]" />
          <div className="absolute top-3 right-3 w-7 h-7 border-t-4 border-r-4 border-[#FFB703] rounded-tr-lg pointer-events-none drop-shadow-[0_2px_0_#2E1B10]" />
          <div className="absolute bottom-3 left-3 w-7 h-7 border-b-4 border-l-4 border-[#FFB703] rounded-bl-lg pointer-events-none drop-shadow-[0_2px_0_#2E1B10]" />
          <div className="absolute bottom-3 right-3 w-7 h-7 border-b-4 border-r-4 border-[#FFB703] rounded-br-lg pointer-events-none drop-shadow-[0_2px_0_#2E1B10]" />

          {streamActive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-2xl border-2.5 border-dashed border-[#FFFDF8]/80 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFB703] border border-[#2E1B10]" />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-20 pb-8 pt-3 flex items-center justify-center gap-6 px-6">
        {streamActive ? (
          <>
            {/* Upload button always available even during live camera */}
            <button
              onClick={triggerFilePicker}
              type="button"
              title="Upload photo from disk instead"
              className="wood-btn-secondary px-4 py-3 flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider cursor-pointer"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>Choose File</span>
            </button>

            {/* Shutter Button */}
            <button
              onClick={handleShutter}
              type="button"
              aria-label="Capture photo"
              disabled={!streamActive || !videoPlaying}
              className="group relative flex items-center justify-center w-20 h-20 rounded-3xl border-4 border-[#2E1B10] bg-[#56C275] cursor-pointer shadow-[0_6px_0_#2E1B10,0_12px_20px_rgba(46,27,16,0.3)] hover:shadow-[0_8px_0_#2E1B10] hover:-translate-y-1 active:translate-y-1.5 active:shadow-[0_2px_0_#2E1B10] transition-all duration-150"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFFDF8] border-2.5 border-[#2E1B10] group-hover:scale-95 group-active:scale-90 transition-transform" />
            </button>

            {/* Stop Camera button to switch back */}
            <button
              onClick={() => { stopTracks(); setCameraRequested(false); }}
              type="button"
              title="Turn camera off"
              className="wood-btn-secondary px-4 py-3 flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Off</span>
            </button>
          </>
        ) : (
          /* Footer when camera is not running */
          <div className="flex items-center gap-4">
            <button
              onClick={triggerFilePicker}
              type="button"
              className="wood-btn-amber px-6 py-3 flex items-center gap-2 text-xs font-display font-black uppercase tracking-wider cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 stroke-[2.5]" />
              <span>Choose From Device</span>
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

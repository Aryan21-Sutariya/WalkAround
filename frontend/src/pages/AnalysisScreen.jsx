import { useEffect, useState } from "react";
import { Sparkles, Search, AlertCircle, RefreshCcw, ArrowLeft, Clock, X, Zap } from "lucide-react";

export const AnalysisScreen = ({
  capturedImageUrl,
  error,
  onRetry,
  onCancel,
  onSwitchToDemo
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (error) return;
    setElapsedSeconds(0);
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [error, capturedImageUrl]);

  const getProgressMessage = (seconds) => {
    if (seconds < 3) return "Validating & optimizing image…";
    if (seconds < 10) return "Scanning visual structures & patterns…";
    if (seconds < 20) return "Consulting Gemma 4 vision model…";
    return "Local AI taking longer than usual. You can switch to Demo Mode.";
  };

  if (error) {
    return (
      <div className="relative z-10 flex h-full w-full overflow-y-auto hide-scrollbar flex-col items-center justify-center px-4 sm:px-6 pt-10 pb-24 sm:pb-32 text-center max-w-lg mx-auto">
        <div className="relative w-full max-w-sm aspect-[4/3] rounded-3xl overflow-hidden border-4 border-[#2E1B10] shadow-[0_8px_0_#2E1B10,0_16px_30px_rgba(46,27,16,0.3)] bg-[#FAF6ED] mb-4">
          <img src={capturedImageUrl} alt="Captured specimen" className="w-full h-full object-cover opacity-50 grayscale" />
          <div className="absolute inset-0 flex items-center justify-center bg-[#2E1B10]/20 p-4">
            <div className="bg-[#FAF6ED] p-4 border-3 border-[#2E1B10] rounded-2xl shadow-[0_4px_0_#2E1B10] flex flex-col items-center max-w-xs">
              <AlertCircle className="w-8 h-8 text-[#E63946] mb-2" />
              <p className="font-display font-bold text-[#E63946] text-sm break-words">Analysis Notice</p>
              <p className="font-sans font-medium text-[#2E1B10] text-xs mt-1.5 leading-snug">{error}</p>
            </div>
          </div>
        </div>

        {/* Demo Mode Button on Error */}
        {onSwitchToDemo && (
          <button
            onClick={onSwitchToDemo}
            type="button"
            className="w-full max-w-xs mb-3 wood-btn-amber py-3 px-4 flex items-center justify-center gap-2 text-xs font-display font-black uppercase tracking-wider cursor-pointer shadow-[0_3px_0_#2E1B10] hover:-translate-y-0.5 active:translate-y-1 transition-transform"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Explore Sample Observation (Demo Mode)</span>
          </button>
        )}

        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={onCancel}
            type="button"
            className="flex-1 wood-btn-secondary py-3 flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel
          </button>
          <button
            onClick={onRetry}
            type="button"
            className="flex-1 wood-btn-primary py-3 flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex h-full w-full overflow-y-auto hide-scrollbar flex-col items-center justify-center px-4 sm:px-6 pt-10 pb-24 sm:pb-32 text-center max-w-lg mx-auto">
      <div className="relative w-full max-w-sm aspect-[4/3] rounded-3xl overflow-hidden border-4 border-[#2E1B10] shadow-[0_8px_0_#2E1B10,0_16px_30px_rgba(46,27,16,0.3)] bg-[#FAF6ED] mb-4">
        <img src={capturedImageUrl} alt="Captured specimen" className="w-full h-full object-cover" />
        
        {/* Animated scanning bar */}
        <div className="absolute inset-x-0 h-3.5 bg-[#FFB703] border-y-2 border-[#2E1B10] animate-scan-block shadow-[0_0_15px_#FFB703] pointer-events-none flex items-center justify-around">
          <div className="w-2 h-2 bg-[#2E1B10] rounded-full" />
          <div className="w-2 h-2 bg-[#2E1B10] rounded-full" />
          <div className="w-2 h-2 bg-[#2E1B10] rounded-full" />
        </div>

        {/* Viewfinder corner brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-3 border-l-3 border-[#FFB703]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-3 border-r-3 border-[#FFB703]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-3 border-l-3 border-[#FFB703]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-3 border-r-3 border-[#FFB703]" />

        {/* Live Elapsed Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#FAF6ED] text-[#2E1B10] border-2 border-[#2E1B10] rounded-xl shadow-[0_2px_0_#2E1B10] text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 tabular-nums">
          <Clock className="w-3 h-3 text-[#E67E22]" />
          <span>{elapsedSeconds}s</span>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-[#42A85F] text-[#FFFFFF] border-2 border-[#1C4425] rounded-xl shadow-[0_2px_0_#1C4425] text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#FFF275]" />
          <span>Observing Nature</span>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FAF6ED] border-2.5 border-[#2E1B10] rounded-xl shadow-[0_3px_0_#2E1B10] text-xs font-mono font-black text-[#2E1B10] uppercase tracking-wider mb-1.5">
        <Search className="w-3.5 h-3.5 text-[#E67E22] animate-bounce" />
        <span>Looking Closer</span>
      </div>

      <p className="font-display font-black text-xl sm:text-2xl text-[#2E1B10] max-w-xs leading-snug drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] mb-1">
        Analyzing your discovery…
      </p>

      {/* Dynamic progress stage text */}
      <p className="text-xs font-sans font-medium text-[#4A3B2C] max-w-xs mb-3 min-h-[1.25rem]">
        {getProgressMessage(elapsedSeconds)}
      </p>

      <div className="flex gap-2 mb-4">
        <div className="w-2.5 h-2.5 bg-[#56C275] border-2 border-[#2E1B10] rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="w-2.5 h-2.5 bg-[#FFB703] border-2 border-[#2E1B10] rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
        <div className="w-2.5 h-2.5 bg-[#48CAE4] border-2 border-[#2E1B10] rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
      </div>

      {/* Options: Instant Demo Mode switch vs Cancel */}
      <div className="flex flex-col gap-2.5 w-full max-w-xs">
        {onSwitchToDemo && (
          <button
            onClick={onSwitchToDemo}
            type="button"
            className="wood-btn-amber py-2 px-4 flex items-center justify-center gap-1.5 text-xs font-display font-black uppercase tracking-wider cursor-pointer shadow-[0_2px_0_#2E1B10]"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Fast Sample Specimen (Demo Mode)</span>
          </button>
        )}

        <button
          onClick={onCancel}
          type="button"
          className="wood-btn-secondary py-2 px-4 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider font-bold cursor-pointer"
        >
          <X className="w-3.5 h-3.5" /> Cancel Analysis
        </button>
      </div>
    </div>
  );
};

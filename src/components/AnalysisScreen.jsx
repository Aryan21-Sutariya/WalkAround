import { useEffect } from "react";
import { Sparkles, Search } from "lucide-react";
export const AnalysisScreen = ({
  capturedImageUrl,
  onAnalysisComplete
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnalysisComplete();
    }, 2600);
    return () => clearTimeout(timer);
  }, [onAnalysisComplete]);
  return <div className="relative z-10 flex h-full w-full overflow-y-auto hide-scrollbar flex-col items-center justify-center px-4 sm:px-6 pt-10 pb-24 sm:pb-32 text-center max-w-lg mx-auto">
      {
    /* Captured Diorama Block with Animated Golden Sunbeam Scan */
  }
      <div className="relative w-full max-w-sm aspect-[4/3] rounded-3xl overflow-hidden border-4 border-[#2E1B10] shadow-[0_8px_0_#2E1B10,0_16px_30px_rgba(46,27,16,0.3)] bg-[#FAF6ED] mb-6">
        <img
    src={capturedImageUrl}
    alt="Captured specimen"
    className="w-full h-full object-cover"
  />

        {
    /* Animated Golden Sunbeam Scan Line */
  }
        <div className="absolute inset-x-0 h-3.5 bg-[#FFB703] border-y-2 border-[#2E1B10] animate-scan-block shadow-[0_0_15px_#FFB703] pointer-events-none flex items-center justify-around">
          <div className="w-2 h-2 bg-[#2E1B10] rounded-full" />
          <div className="w-2 h-2 bg-[#2E1B10] rounded-full" />
          <div className="w-2 h-2 bg-[#2E1B10] rounded-full" />
        </div>

        {
    /* Brass Corner Accents */
  }
        <div className="absolute top-2 left-2 w-4 h-4 border-t-3 border-l-3 border-[#FFB703]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-3 border-r-3 border-[#FFB703]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-3 border-l-3 border-[#FFB703]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-3 border-r-3 border-[#FFB703]" />

        {
    /* Floating Explorer Tag */
  }
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-[#42A85F] text-[#FFFFFF] border-2 border-[#1C4425] rounded-xl shadow-[0_2px_0_#1C4425] text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#FFF275]" />
          <span>Observing Nature</span>
        </div>
      </div>

      {
    /* Storybook Inscribed Tag */
  }
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FAF6ED] border-2.5 border-[#2E1B10] rounded-xl shadow-[0_3px_0_#2E1B10] text-xs font-mono font-black text-[#2E1B10] uppercase tracking-wider mb-2">
        <Search className="w-3.5 h-3.5 text-[#E67E22] animate-bounce" />
        <span>Looking Closer</span>
      </div>

      <p className="font-display font-black text-xl sm:text-2xl text-[#2E1B10] max-w-xs leading-snug drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
        Understanding what caught your attention.
      </p>

      {
    /* Playful Floating Pollen Dots */
  }
      <div className="flex gap-2 mt-4">
        <div className="w-3 h-3 bg-[#56C275] border-2 border-[#2E1B10] rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="w-3 h-3 bg-[#FFB703] border-2 border-[#2E1B10] rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
        <div className="w-3 h-3 bg-[#48CAE4] border-2 border-[#2E1B10] rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>;
};

import { Camera, TreePine, Sparkles } from "lucide-react";
export const ActiveWalkScreen = ({
  noticedCount,
  onOpenCapture,
  onEndWalk
}) => {
  return <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-4 sm:px-6 py-8 sm:py-12 text-center max-w-lg mx-auto">
      {
    /* Top Milestone Sign */
  }
      <header className="pt-2 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#FAF6ED] border-2.5 border-[#2E1B10] rounded-xl shadow-[0_3px_0_#2E1B10] text-[11px] font-mono font-black tracking-widest text-[#2E1B10] uppercase mb-4">
          <TreePine className="w-3.5 h-3.5 text-[#42A85F]" />
          <span>Walking in the Wild</span>
        </div>

        {
    /* Quiet Wooden Banner */
  }
        <div className="bg-[#FAF6ED]/95 border-3 border-[#2E1B10] rounded-2xl px-6 py-3.5 shadow-[0_4px_0_#2E1B10]">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#2E1B10] tracking-tight mb-0.5">
            Keep your phone away.
          </h2>
          <p className="font-display font-extrabold text-sm sm:text-base text-[#D97706]">
            Look around you.
          </p>
        </div>
      </header>

      {
    /* Cozy Wooden Field Milestone Counter */
  }
      <div className="my-auto py-6 flex flex-col items-center">
        <div className="relative group">
          {
    /* Hanging Forest Token Plaque */
  }
          <div className="w-32 h-32 sm:w-36 sm:h-36 bg-[#FAF6ED] border-3.5 border-[#2E1B10] rounded-3xl shadow-[0_6px_0_#2E1B10,0_12px_24px_rgba(46,27,16,0.2)] flex flex-col items-center justify-center p-3 transform hover:scale-105 transition-transform duration-200">
            {
    /* Top Hanging Loop */
  }
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-4 border-2.5 border-[#2E1B10] rounded-t-full bg-[#8B5E3C]" />

            <div className="w-full h-full bg-[#EFE8D6] border-2 border-[#2E1B10] rounded-2xl flex flex-col items-center justify-center">
              <span className="font-display font-black text-5xl sm:text-6xl text-[#2E1B10] tabular-nums tracking-tight">
                {noticedCount}
              </span>
              <span className="text-[10px] font-mono font-black tracking-widest uppercase text-[#42A85F] mt-0.5">
                Noticed
              </span>
            </div>
          </div>

          {
    /* Mini Gold Badge */
  }
          <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 bg-[#FFB703] border-2 border-[#2E1B10] rounded-lg shadow-[0_2px_0_#2E1B10] text-[10px] font-mono font-black text-[#2E1B10] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>LOG</span>
          </div>
        </div>

        <p className="mt-4 text-xs font-mono font-bold text-[#2E1B10]/70">
          Listen to the wind · Notice tiny details
        </p>
      </div>

      {
    /* Explorer Controls */
  }
      <footer className="w-full pb-3 flex flex-col items-center gap-5">
        {
    /* Brass & Wood Shutter Button */
  }
        <div className="flex flex-col items-center gap-2">
          <button
    onClick={onOpenCapture}
    type="button"
    aria-label="Capture observation"
    className="group relative flex items-center justify-center w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-br from-[#FFC436] to-[#F49D1A] border-3.5 border-[#2E1B10] shadow-[0_6px_0_#2E1B10,0_12px_20px_rgba(46,27,16,0.25)] hover:shadow-[0_8px_0_#2E1B10] hover:-translate-y-1 active:translate-y-1.5 active:shadow-[0_2px_0_#2E1B10] transition-all duration-150 cursor-pointer"
  >
            {
    /* Inner Lens Rim */
  }
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3B0] border-2.5 border-[#2E1B10] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Camera className="w-7 h-7 text-[#2E1B10] stroke-[2.4]" />
            </div>
          </button>
          <span className="font-display font-black text-xs tracking-widest text-[#2E1B10] uppercase">
            Capture
          </span>
        </div>

        {
    /* End Walk Button */
  }
        <button
    onClick={onEndWalk}
    type="button"
    className="wood-btn-secondary px-5 py-2 text-xs font-mono font-black tracking-wider uppercase cursor-pointer"
  >
          End Walk
        </button>
      </footer>
    </div>;
};

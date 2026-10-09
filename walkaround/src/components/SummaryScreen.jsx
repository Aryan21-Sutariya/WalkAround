import { Download, Sparkles } from "lucide-react";
export const SummaryScreen = ({
  observations,
  durationMinutes,
  onDone
}) => {
  const count = observations.length;
  const handleDownloadPDF = () => {
    window.print();
  };
  return <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-4 sm:px-6 py-8 sm:py-12 max-w-2xl mx-auto">
      {
    /* Top Field Journal Header */
  }
      <header className="w-full text-center pt-2 mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FFB703] border-3 border-[#2E1B10] rounded-xl shadow-[0_3px_0_#2E1B10] text-xs font-mono font-black text-[#2E1B10] tracking-wider uppercase mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Expedition Logbook</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-5xl text-[#2E1B10] tracking-tight mb-2 drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
          Your Walk
        </h1>

        {
    /* Stats Pill Ribbon */
  }
        <div className="inline-flex items-center gap-2 p-1.5 bg-[#FAF6ED] border-3 border-[#2E1B10] rounded-2xl shadow-[0_4px_0_#2E1B10] mb-3">
          <div className="px-3.5 py-1 bg-[#42A85F] text-[#FFFFFF] rounded-xl font-mono font-black text-xs">
            {durationMinutes} minutes
          </div>
          <span className="text-[#8B5E3C] font-black">·</span>
          <div className="px-3.5 py-1 bg-[#FFB703] text-[#2E1B10] rounded-xl font-mono font-black text-xs">
            {count} noticed
          </div>
        </div>

        <p className="text-xs sm:text-sm font-sans font-bold text-[#4A3B2C] max-w-sm mx-auto leading-relaxed">
          You noticed {count} {count === 1 ? "thing" : "things"} you might normally have walked past.
        </p>
      </header>

      {
    /* Vertical Nature Trail Timeline */
  }
      <main className="w-full relative mb-10 sm:mb-12">
        {
    /* Wooden Trail Connecting Line */
  }
        <div className="absolute top-4 bottom-4 left-6 sm:left-24 w-1.5 bg-[#8B5E3C] border-x border-[#2E1B10] pointer-events-none" />

        <div className="space-y-6 sm:space-y-7">
          {observations.map((obs, idx) => <article
    key={obs.id || idx}
    className="relative flex flex-col sm:flex-row items-start gap-3 sm:gap-7 pl-12 sm:pl-0"
  >
              {
    /* Timestamp & Carved Trail Marker Node */
  }
              <div className="sm:w-24 sm:text-right shrink-0 flex items-center sm:justify-end gap-2">
                <span className="text-xs font-mono font-black text-[#2E1B10] tracking-wider tabular-nums px-2.5 py-1 bg-[#FAF6ED] border-2 border-[#2E1B10] rounded-lg shadow-[0_2px_0_#2E1B10]">
                  {obs.timestamp}
                </span>

                {
    /* Trail Marker Node */
  }
                <div className="absolute left-6 sm:left-24 -translate-x-1/2 w-5 h-5 rounded-lg bg-[#56C275] border-2.5 border-[#2E1B10] shadow-[0_2px_0_#2E1B10] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#2E1B10] rounded-full" />
                </div>
              </div>

              {
    /* Storybook Observation Card */
  }
              <div className="wood-board flex-1 w-full p-4 sm:p-5 hover:-translate-y-1 transition-transform">
                <div className="flex flex-col-reverse sm:flex-row items-start gap-4">
                  <div className="flex-1">
                    <span className="inline-block px-2.5 py-0.5 bg-[#42A85F] text-[#FFFFFF] border border-[#1C4425] rounded-md text-[10px] font-mono font-black uppercase tracking-wider mb-1.5">
                      {obs.type}
                    </span>
                    <h3 className="font-display font-black text-lg sm:text-xl text-[#2E1B10] mb-1">
                      {obs.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-sans text-[#4A3B2C] leading-relaxed mb-3 font-medium">
                      {obs.description}
                    </p>
                    <div className="p-2.5 bg-[#EFE8D6] border border-[#2E1B10] rounded-xl text-[11px] font-sans font-bold text-[#8A5A2B]">
                      "{obs.closerDetail}"
                    </div>
                  </div>

                  {
    /* 3D Diorama Thumbnail */
  }
                  <div className="w-full sm:w-28 aspect-[4/3] rounded-2xl overflow-hidden border-2.5 border-[#2E1B10] shadow-[0_3px_0_#2E1B10] shrink-0 bg-[#E5DFC9]">
                    <img
    src={obs.imageUrl}
    alt={obs.title}
    className="w-full h-full object-cover"
  />
                  </div>
                </div>
              </div>
            </article>)}
        </div>
      </main>

      {
    /* Action Buttons */
  }
      <footer className="w-full max-w-sm flex flex-col items-center gap-3 pb-6">
        <button
    onClick={handleDownloadPDF}
    type="button"
    className="wood-btn-amber w-full py-3.5 px-6 text-sm font-display font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
  >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Download Walk PDF</span>
        </button>

        <button
    onClick={onDone}
    type="button"
    className="wood-btn-secondary py-2.5 px-6 text-xs font-mono font-black uppercase tracking-wider cursor-pointer"
  >
          Done
        </button>
      </footer>
    </div>;
};

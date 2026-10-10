import { Check, RefreshCcw, Sparkles, Leaf, AlertCircle } from "lucide-react";
export const ObservationScreen = ({
  observation,
  onSave,
  onTryAgain
}) => {
  const confNum = parseInt(observation.confidence, 10) || 95;
  const filledBars = Math.round(confNum / 10);
  return <div className="relative z-10 flex h-full w-full overflow-y-auto hide-scrollbar flex-col items-center justify-center px-4 sm:px-6 pt-8 sm:pt-12 pb-24 sm:pb-32 max-w-lg mx-auto">
      {
    /* Handcrafted Naturalist Field Tablet */
  }
      <div className="wood-board w-full p-6 sm:p-7 relative flex flex-col">
        {
    /* Header Kicker */
  }
        <header className="mb-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#42A85F] text-[#FFFFFF] border-2 border-[#1C4425] rounded-xl shadow-[0_2px_0_#1C4425] text-[10px] font-mono font-black uppercase tracking-wider">
            <Leaf className="w-3 h-3" />
            <span>What You Noticed</span>
          </div>

          <div className="px-3 py-1 bg-[#EFE8D6] border-2 border-[#2E1B10] rounded-xl text-xs font-mono font-black text-[#2E1B10] tabular-nums">
            {observation.timestamp}
          </div>
        </header>

        {observation.is_demo && (
          <div className="mb-4 p-3.5 bg-[#FFB703]/25 border-2.5 border-[#2E1B10] rounded-2xl shadow-[0_2px_0_#2E1B10] flex items-start gap-2.5 text-left">
            <AlertCircle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            <div>
              <p className="font-display font-black text-xs text-[#2E1B10] uppercase tracking-wider">Demo Mode — Sample Observations</p>
              <p className="font-sans text-[11px] font-semibold text-[#6D5A47] leading-snug mt-0.5">
                {observation.demo_disclaimer || "This specimen is displayed as a curated sample demonstration. It was not generated from an uploaded photograph."}
              </p>
            </div>
          </div>
        )}

        {
    /* 3D Diorama Specimen Photo */
  }
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-3.5 border-[#2E1B10] bg-[#E5DFC9] shadow-[0_4px_0_#2E1B10] mb-4">
          <img
    src={observation.imageUrl}
    alt={observation.title}
    className="w-full h-full object-cover"
  />

          {
    /* Type Badge on Corner */
  }
          <div className="absolute top-3 left-3 px-3 py-1 bg-[#FFB703] text-[#2E1B10] border-2 border-[#2E1B10] rounded-xl shadow-[0_2px_0_#2E1B10] text-[10px] font-mono font-black uppercase tracking-wider">
            {observation.type}
          </div>

          {
    /* Diorama Badge */
  }
          <div className="absolute bottom-3 right-3 px-2.5 py-0.5 bg-[#FAF6ED] text-[#2E1B10] border-2 border-[#2E1B10] rounded-lg shadow-[0_2px_0_#2E1B10] text-[10px] font-mono font-black">
            ✦ DIORAMA SPECIMEN
          </div>
        </div>

        {
    /* Title */
  }
        <div className="mb-2.5">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#2E1B10] leading-tight">
            {observation.title}
          </h2>
        </div>

        {
    /* Description */
  }
        <p className="text-sm font-sans text-[#4A3B2C] leading-relaxed mb-4 font-medium">
          {observation.description}
        </p>

        {
    /* Inscribed Parchment: LOOK CLOSER */
  }
        <div className="bg-[#EFE8D6] border-2.5 border-[#2E1B10] rounded-2xl p-4 shadow-[0_3px_0_#2E1B10] mb-4">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-black text-[#D97706] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Look Closer</span>
          </div>
          <p className="font-sans font-bold text-xs sm:text-sm text-[#2E1B10] leading-relaxed">
            {observation.closerDetail}
          </p>
        </div>

        {
    /* Confidence Block Meter */
  }
        <div className="flex items-center justify-between text-xs font-mono font-bold text-[#6D5A47] mb-5 px-1">
          <span>Discovery Confidence {observation.confidence}</span>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => <div
    key={i}
    className={`w-2.5 h-3.5 rounded-sm border-2 border-[#2E1B10] ${i < filledBars ? "bg-[#42A85F]" : "bg-[#D6CBB7]"}`}
  />)}
          </div>
        </div>

        {
    /* Action Buttons */
  }
        <footer className="flex flex-col sm:flex-row gap-3 pt-2 border-t-2.5 border-[#2E1B10]">
          <button
    onClick={onSave}
    type="button"
    className="wood-btn-primary flex-1 py-3.5 px-5 text-sm font-display font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
  >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Save Observation</span>
          </button>

          <button
    onClick={onTryAgain}
    type="button"
    className="wood-btn-secondary py-3 px-4 text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
  >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </footer>
      </div>
    </div>;
};

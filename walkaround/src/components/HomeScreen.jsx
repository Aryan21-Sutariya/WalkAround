import { Compass, Footprints, Leaf, Sparkles } from "lucide-react";
export const HomeScreen = ({ onStartWalk }) => {
  return <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-4 sm:px-6 py-8 sm:py-12 text-center max-w-4xl mx-auto">
      {
    /* Top Floating Wooden Trail Marker */
  }
      <header className="w-full pt-1 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FAF6ED] border-3 border-[#2E1B10] rounded-xl shadow-[0_4px_0_#2E1B10] text-xs font-mono font-black tracking-wider text-[#2E1B10] uppercase transform -rotate-1 hover:rotate-0 transition-transform">
          <Leaf className="w-4 h-4 text-[#42A85F] animate-bounce" />
          <span>Sunny Meadow Trailhead</span>
        </div>
      </header>

      {
    /* Main Storybook Wooden Signboard */
  }
      <main className="flex flex-col items-center my-auto py-4 sm:py-6 w-full max-w-lg">
        {
    /* Carved Wooden Plaque Panel */
  }
        <div className="wood-board w-full p-6 sm:p-8 relative">
          {
    /* Decorative Corner Pegs */
  }
          <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-[#8B5E3C] border-2 border-[#2E1B10]" />
          <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#8B5E3C] border-2 border-[#2E1B10]" />
          <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-[#8B5E3C] border-2 border-[#2E1B10]" />
          <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-[#8B5E3C] border-2 border-[#2E1B10]" />

          {
    /* Whimsical 3D Compass Token */
  }
          <div className="mb-4 inline-flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FFB703] border-3.5 border-[#2E1B10] rounded-2xl shadow-[0_4px_0_#2E1B10] flex items-center justify-center transform hover:rotate-12 transition-transform duration-200">
              <Compass className="w-9 h-9 sm:w-11 sm:h-11 text-[#2E1B10] stroke-[2.2]" />
            </div>
          </div>

          {
    /* Heading */
  }
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-[#2E1B10] mb-2 drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
            WalkAround
          </h1>

          {
    /* Tagline Ribbon Banner */
  }
          <div className="inline-block px-4 py-1.5 bg-[#42A85F] text-[#FFFFFF] border-2.5 border-[#1C4425] rounded-xl shadow-[0_3px_0_#1C4425] transform -rotate-1 mb-5">
            <p className="font-display font-black text-xs sm:text-sm tracking-wide">
              "Notice what you normally walk past."
            </p>
          </div>

          {
    /* Invitation Text */
  }
          <p className="font-sans text-sm sm:text-base text-[#4A3B2C] leading-relaxed max-w-sm mx-auto mb-7 font-medium">
            Take a walk. Look around.
            <br />
            When something catches your attention,
            <br className="hidden sm:inline" /> show it to us.
          </p>

          {
    /* Start Walk Wooden/Grass Block Button */
  }
          <button
    onClick={onStartWalk}
    type="button"
    className="wood-btn-primary group inline-flex items-center gap-3 px-8 py-3.5 sm:py-4 text-base font-display font-black uppercase tracking-wider cursor-pointer"
  >
            <Footprints className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Start Walk</span>
            <Sparkles className="w-4 h-4 text-[#FFF275]" />
          </button>

          {
    /* Reassurance Label */
  }
          <p className="mt-5 text-xs font-mono font-bold text-[#8C7A68]">
            No account required · Your walk is temporary
          </p>
        </div>

        {
    /* Trail Discovery Cards (Mini Handcrafted Dioramas) */
  }
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full mt-6">
          <div className="p-2 sm:p-2.5 bg-[#FAF6ED] border-2.5 border-[#2E1B10] rounded-xl shadow-[0_3px_0_#2E1B10] text-center hover:-translate-y-1 transition-transform">
            <span className="text-xl block mb-0.5">🌸</span>
            <span className="text-[11px] font-mono font-bold text-[#2E1B10] block">Meadow Flora</span>
          </div>
          <div className="p-2 sm:p-2.5 bg-[#FAF6ED] border-2.5 border-[#2E1B10] rounded-xl shadow-[0_3px_0_#2E1B10] text-center hover:-translate-y-1 transition-transform">
            <span className="text-xl block mb-0.5">🍄</span>
            <span className="text-[11px] font-mono font-bold text-[#2E1B10] block">Wild Fungi</span>
          </div>
          <div className="p-2 sm:p-2.5 bg-[#FAF6ED] border-2.5 border-[#2E1B10] rounded-xl shadow-[0_3px_0_#2E1B10] text-center hover:-translate-y-1 transition-transform">
            <span className="text-xl block mb-0.5">🦋</span>
            <span className="text-[11px] font-mono font-bold text-[#2E1B10] block">Curious Moths</span>
          </div>
        </div>
      </main>

      {
    /* Footer */
  }
      <footer className="w-full pb-1 text-[11px] font-mono font-extrabold text-[#2E1B10]/70 tracking-widest uppercase">
        <span>Cozy Storybook Forest Edition</span>
      </footer>
    </div>;
};

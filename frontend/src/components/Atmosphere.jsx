import { useEffect, useState, useMemo } from "react";
export const Atmosphere = ({ showCelestial = true }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x: normX, y: normY });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  const pollenMotes = useMemo(() => {
    return [
      { id: 1, left: "15%", bottom: "20%", delay: "0s", duration: "9s", size: 6 },
      { id: 2, left: "35%", bottom: "30%", delay: "2.5s", duration: "11s", size: 5 },
      { id: 3, left: "60%", bottom: "15%", delay: "4s", duration: "10s", size: 7 },
      { id: 4, left: "80%", bottom: "25%", delay: "1.2s", duration: "12s", size: 5 },
      { id: 5, left: "25%", bottom: "40%", delay: "5.5s", duration: "8s", size: 6 },
      { id: 6, left: "72%", bottom: "35%", delay: "3.8s", duration: "13s", size: 4 },
      { id: 7, left: "48%", bottom: "10%", delay: "6.2s", duration: "10s", size: 6 }
    ];
  }, []);
  return <div
    className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
    aria-hidden="true"
  >
      {
    /* ── LAYER 0: Sky, Sun & Distant Mountains (Slow Parallax) ── */
  }
      <div
    className="absolute inset-0 transition-transform duration-700 ease-out"
    style={{
      transform: `translate3d(${mousePos.x * 6}px, ${mousePos.y * 4}px, 0)`
    }}
  >
        {
    /* Sky Gradient */
  }
        <div className="absolute inset-0 bg-gradient-to-b from-[#78BEEB] via-[#A8DAF0] to-[#DCF4DE]" />

        {
    /* Soft Sunbeams Filtering from Sky */
  }
        <svg
    className="absolute -top-10 -right-10 w-[700px] h-[700px] opacity-25 pointer-events-none"
    viewBox="0 0 500 500"
  >
          <defs>
            <radialGradient id="sunbeamGrad" cx="100%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#FFF2A3" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFE066" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FFE066" stopOpacity="0" />
            </radialGradient>
          </defs>
          <polygon points="500,0 320,500 240,500" fill="url(#sunbeamGrad)" />
          <polygon points="500,0 120,500 40,500" fill="url(#sunbeamGrad)" />
          <polygon points="500,0 0,380 0,260" fill="url(#sunbeamGrad)" />
        </svg>

        {
    /* Cartoon Block Sun */
  }
        {showCelestial && <div className="absolute top-6 right-8 sm:top-10 sm:right-20">
            <div className="relative w-16 h-16 sm:w-22 sm:h-22">
              {
    /* Spinning Sun Rays Block */
  }
              <div className="absolute inset-0 animate-sun-cartoon flex items-center justify-center">
                <div className="w-full h-3 bg-[#FFB703]/60 rounded-md" />
                <div className="absolute w-3 h-full bg-[#FFB703]/60 rounded-md" />
                <div className="absolute w-full h-3 bg-[#FFB703]/60 rounded-md rotate-45" />
                <div className="absolute w-3 h-full bg-[#FFB703]/60 rounded-md rotate-45" />
              </div>
              {
    /* Sun Core Disc */
  }
              <div className="relative z-10 w-full h-full rounded-2xl bg-gradient-to-br from-[#FFE169] to-[#FB8500] border-3 border-[#2E1B10] shadow-[3px_3px_0px_#2E1B10] flex items-center justify-center">
                <div className="w-8 h-8 rounded-xl bg-[#FFF3B0] border-2 border-[#2E1B10] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FB8500]" />
                </div>
              </div>
            </div>
          </div>}

        {
    /* Puffy Floating Cartoon Block Clouds */
  }
        <div className="absolute top-12 left-0 w-full overflow-hidden h-32">
          {
    /* Cloud 1 */
  }
          <div className="absolute top-2 animate-cloud-puffy-1 flex items-end">
            <div className="w-14 h-8 bg-[#FFFFFF] border-2.5 border-[#2E1B10] rounded-l-xl shadow-[3px_3px_0px_rgba(46,27,16,0.3)]" />
            <div className="w-22 h-16 bg-[#FFFFFF] border-2.5 border-[#2E1B10] -ml-3 rounded-t-2xl shadow-[3px_3px_0px_rgba(46,27,16,0.3)]" />
            <div className="w-16 h-10 bg-[#FFFFFF] border-2.5 border-[#2E1B10] -ml-3 rounded-r-xl shadow-[3px_3px_0px_rgba(46,27,16,0.3)]" />
          </div>

          {
    /* Cloud 2 */
  }
          <div
    className="absolute top-16 animate-cloud-puffy-2 flex items-end"
    style={{ animationDelay: "-32s" }}
  >
            <div className="w-16 h-10 bg-[#FFFFFF] border-2.5 border-[#2E1B10] rounded-l-xl shadow-[3px_3px_0px_rgba(46,27,16,0.3)]" />
            <div className="w-24 h-18 bg-[#FFFFFF] border-2.5 border-[#2E1B10] -ml-4 rounded-t-2xl shadow-[3px_3px_0px_rgba(46,27,16,0.3)]" />
            <div className="w-18 h-12 bg-[#FFFFFF] border-2.5 border-[#2E1B10] -ml-3 rounded-r-xl shadow-[3px_3px_0px_rgba(46,27,16,0.3)]" />
          </div>
        </div>

        {
    /* Distant Low-Poly Mountain Peaks */
  }
        <div className="absolute bottom-40 sm:bottom-48 inset-x-0 h-36">
          <svg
    viewBox="0 0 1200 240"
    preserveAspectRatio="none"
    className="w-full h-full drop-shadow-[0_4px_0_rgba(46,27,16,0.15)]"
  >
            {
    /* Far Range in Soft Sage/Slate */
  }
            <polygon
    points="0,240 0,160 140,80 280,170 420,95 560,180 720,60 880,170 1020,90 1200,160 1200,240"
    fill="#7AA894"
    stroke="#2E1B10"
    strokeWidth="2.5"
  />
            {
    /* Snow/Cloud Mountain Caps */
  }
            <polygon points="140,80 115,100 135,105 145,108 165,100" fill="#FFFFFF" />
            <polygon points="420,95 395,115 415,120 435,115" fill="#FFFFFF" />
            <polygon points="720,60 690,85 715,92 730,88 750,85" fill="#FFFFFF" />
            <polygon points="1020,90 995,112 1015,118 1040,110" fill="#FFFFFF" />

            {
    /* Near Hill Range in Moss Green */
  }
            <polygon
    points="0,240 0,190 200,130 400,200 600,140 820,210 1000,145 1200,195 1200,240"
    fill="#56A573"
    stroke="#2E1B10"
    strokeWidth="2.5"
  />
          </svg>
        </div>
      </div>

      {
    /* ── LAYER 1: Midground Rolling Meadows, Winding Stream & Cubic Trees ── */
  }
      <div
    className="absolute inset-0 transition-transform duration-500 ease-out"
    style={{
      transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 8}px, 0)`
    }}
  >
        {
    /* Layered Grass Block Meadows & Winding Blue Stream */
  }
        <div className="absolute bottom-16 sm:bottom-20 inset-x-0 h-44 sm:h-56">
          <svg
    viewBox="0 0 1200 300"
    preserveAspectRatio="none"
    className="w-full h-full"
  >
            {
    /* Rolling Grass Meadow Block */
  }
            <path
    d="M0 160 Q 250 110, 500 150 T 1000 130 T 1200 160 L 1200 300 L 0 300 Z"
    fill="#42A85F"
    stroke="#2E1B10"
    strokeWidth="3.5"
  />

            {
    /* Winding Blue Cartoon Stream with Sparkling Ripples */
  }
            <path
    d="M 120 300 C 240 240, 360 210, 480 200 C 620 190, 740 170, 840 140 L 920 145 C 800 185, 660 210, 520 225 C 380 240, 260 280, 180 300 Z"
    fill="#4EA8DE"
    stroke="#2E1B10"
    strokeWidth="3"
  />
            {
    /* Stream Animated Water Ripple Lines */
  }
            <path
    d="M 210 270 C 310 235, 430 215, 540 208"
    fill="none"
    stroke="#E0F2FE"
    strokeWidth="2.5"
    className="animate-water-stream"
  />
            <path
    d="M 580 200 C 680 185, 780 165, 850 148"
    fill="none"
    stroke="#E0F2FE"
    strokeWidth="2.5"
    className="animate-water-stream"
  />

            {
    /* Cute Wooden Plank Bridge Crossing the Stream */
  }
            <g transform="translate(490, 190)">
              {
    /* Bridge Shadow */
  }
              <rect x="0" y="24" width="75" height="12" rx="4" fill="rgba(46,27,16,0.3)" />
              {
    /* Wooden Planks */
  }
              <rect x="2" y="8" width="14" height="26" rx="2" fill="#8B5E3C" stroke="#2E1B10" strokeWidth="2" />
              <rect x="18" y="7" width="14" height="27" rx="2" fill="#A26E47" stroke="#2E1B10" strokeWidth="2" />
              <rect x="34" y="6" width="14" height="28" rx="2" fill="#8B5E3C" stroke="#2E1B10" strokeWidth="2" />
              <rect x="50" y="7" width="14" height="27" rx="2" fill="#A26E47" stroke="#2E1B10" strokeWidth="2" />
              <rect x="66" y="8" width="14" height="26" rx="2" fill="#8B5E3C" stroke="#2E1B10" strokeWidth="2" />
              {
    /* Handrails */
  }
              <path d="M 0 10 L 82 8" stroke="#583922" strokeWidth="3.5" strokeLinecap="round" />
            </g>

            {
    /* Tiny Flowers & Red Toadstools Scattered */
  }
            {
    /* Mushroom 1 */
  }
            <g transform="translate(280, 195)">
              <rect x="4" y="8" width="4" height="8" rx="1" fill="#F8F4EC" stroke="#2E1B10" strokeWidth="1.5" />
              <path d="M 0 8 Q 6 0, 12 8 Z" fill="#E63946" stroke="#2E1B10" strokeWidth="1.5" />
              <circle cx="4" cy="5" r="1" fill="#FFFFFF" />
              <circle cx="8" cy="4" r="1" fill="#FFFFFF" />
            </g>
            {
    /* Daisy 1 */
  }
            <g transform="translate(680, 165)">
              <line x1="6" y1="6" x2="6" y2="16" stroke="#2F7C48" strokeWidth="2" />
              <circle cx="6" cy="6" r="3.5" fill="#FFD166" stroke="#2E1B10" strokeWidth="1.5" />
              <circle cx="2" cy="6" r="2" fill="#FFFFFF" />
              <circle cx="10" cy="6" r="2" fill="#FFFFFF" />
              <circle cx="6" cy="2" r="2" fill="#FFFFFF" />
              <circle cx="6" cy="10" r="2" fill="#FFFFFF" />
            </g>
            {
    /* Daisy 2 */
  }
            <g transform="translate(980, 175)">
              <circle cx="6" cy="6" r="3" fill="#FFD166" stroke="#2E1B10" strokeWidth="1.5" />
              <circle cx="2" cy="6" r="2" fill="#FFFFFF" />
              <circle cx="10" cy="6" r="2" fill="#FFFFFF" />
            </g>
          </svg>
        </div>

        {
    /* Left Side: Whimsical Cubic Tree Cluster */
  }
        <div className="absolute bottom-28 left-4 sm:left-12 flex items-end">
          <div className="flex flex-col items-center animate-sway-slow">
            {
    /* Top foliage cube */
  }
            <div className="w-14 h-14 bg-[#56C275] border-3 border-[#2E1B10] rounded-xl shadow-[4px_4px_0px_#2E1B10] relative z-20 flex items-center justify-center">
              <div className="w-8 h-8 bg-[#6CE08E] border-2 border-[#2E1B10] rounded-lg" />
            </div>
            {
    /* Bottom foliage cube */
  }
            <div className="w-22 h-16 bg-[#3EA55C] border-3 border-[#2E1B10] rounded-2xl -mt-4 shadow-[4px_4px_0px_#2E1B10] relative z-10" />
            {
    /* Wooden block trunk */
  }
            <div className="w-6 h-14 bg-[#8B5E3C] border-3 border-[#2E1B10] -mt-2 rounded-b-md shadow-[3px_3px_0px_#2E1B10]" />
          </div>

          {
    /* Smaller cubic tree */
  }
          <div className="flex flex-col items-center -ml-4 mb-2 hidden sm:flex">
            <div className="w-12 h-12 bg-[#48B066] border-2.5 border-[#2E1B10] rounded-xl shadow-[3px_3px_0px_#2E1B10] z-20" />
            <div className="w-16 h-12 bg-[#338A4D] border-2.5 border-[#2E1B10] rounded-xl -mt-3 shadow-[3px_3px_0px_#2E1B10] z-10" />
            <div className="w-5 h-10 bg-[#734A2E] border-2.5 border-[#2E1B10] -mt-2 rounded-b-sm" />
          </div>
        </div>

        {
    /* Right Side: Whimsical Cubic Tree Cluster */
  }
        <div className="absolute bottom-32 right-4 sm:right-16 flex items-end">
          <div className="flex flex-col items-center animate-sway-slow" style={{ animationDelay: "-2.5s" }}>
            <div className="w-16 h-14 bg-[#56C275] border-3 border-[#2E1B10] rounded-xl shadow-[4px_4px_0px_#2E1B10] z-20" />
            <div className="w-24 h-18 bg-[#3BA158] border-3 border-[#2E1B10] rounded-2xl -mt-3 shadow-[4px_4px_0px_#2E1B10] z-10" />
            <div className="w-7 h-16 bg-[#8B5E3C] border-3 border-[#2E1B10] -mt-2 rounded-b-md shadow-[3px_3px_0px_#2E1B10]" />
          </div>
        </div>
      </div>

      {
    /* ── LAYER 2: Foreground Terraced Grass Blocks, Giant Leaves & Butterflies ── */
  }
      <div
    className="absolute inset-0 transition-transform duration-300 ease-out"
    style={{
      transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 14}px, 0)`
    }}
  >
        {
    /* Animated Fluttering Cartoon Butterflies */
  }
        {
    /* Butterfly 1 (Amber / Gold) */
  }
        <div className="absolute top-1/3 left-1/4 animate-butterfly-1">
          <div className="relative w-8 h-8 animate-wing-flap">
            {
    /* Butterfly Wings SVG */
  }
            <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[2px_2px_0_rgba(46,27,16,0.3)]">
              <path d="M16 16 C12 6, 2 8, 4 16 C6 22, 14 20, 16 16 Z" fill="#FFB703" stroke="#2E1B10" strokeWidth="2" />
              <path d="M16 16 C20 6, 30 8, 28 16 C26 22, 18 20, 16 16 Z" fill="#FB8500" stroke="#2E1B10" strokeWidth="2" />
              <ellipse cx="16" cy="16" rx="2" ry="6" fill="#2E1B10" />
            </svg>
          </div>
        </div>

        {
    /* Butterfly 2 (Azure / Sky Blue) */
  }
        <div className="absolute top-1/2 right-1/4 animate-butterfly-2">
          <div className="relative w-7 h-7 animate-wing-flap">
            <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[2px_2px_0_rgba(46,27,16,0.3)]">
              <path d="M16 16 C12 6, 2 8, 4 16 C6 22, 14 20, 16 16 Z" fill="#48CAE4" stroke="#2E1B10" strokeWidth="2" />
              <path d="M16 16 C20 6, 30 8, 28 16 C26 22, 18 20, 16 16 Z" fill="#0096C7" stroke="#2E1B10" strokeWidth="2" />
              <ellipse cx="16" cy="16" rx="2" ry="5" fill="#2E1B10" />
            </svg>
          </div>
        </div>

        {
    /* Floating Pollen Spores Rising from Meadow */
  }
        {pollenMotes.map((mote) => <div
    key={mote.id}
    className="absolute pointer-events-none"
    style={{
      left: mote.left,
      bottom: mote.bottom,
      animation: `pollenRise ${mote.duration} ease-in-out infinite`,
      animationDelay: mote.delay
    }}
  >
            <div
    className="rounded-full bg-[#FFF275] border border-[#2E1B10]"
    style={{
      width: `${mote.size}px`,
      height: `${mote.size}px`,
      boxShadow: "0 0 8px #FFD166"
    }}
  />
          </div>)}

        {
    /* Bottom Terraced Grass Block Ground */
  }
        <div className="absolute bottom-0 inset-x-0">
          {
    /* Top Turf Layer with Rounded Block Grass Tufts */
  }
          <div className="h-6 sm:h-7 bg-[#48B066] border-t-3.5 border-b-2.5 border-[#2E1B10] relative flex items-center justify-around px-4">
            <div className="w-10 h-2 bg-[#64CF83] rounded-full border border-[#2E1B10]" />
            <div className="w-16 h-2 bg-[#64CF83] rounded-full border border-[#2E1B10] hidden sm:block" />
            <div className="w-12 h-2 bg-[#64CF83] rounded-full border border-[#2E1B10]" />
            <div className="w-18 h-2 bg-[#64CF83] rounded-full border border-[#2E1B10] hidden sm:block" />
            <div className="w-14 h-2 bg-[#64CF83] rounded-full border border-[#2E1B10]" />
          </div>

          {
    /* Rich Soil Underlayer with Stone Blocks */
  }
          <div className="h-10 sm:h-14 bg-[#6F4E37] border-b-4 border-[#2E1B10] flex items-center justify-around px-8">
            <div className="w-8 h-4 bg-[#543825] border-2 border-[#2E1B10] rounded-md" />
            <div className="w-12 h-5 bg-[#8D6448] border-2 border-[#2E1B10] rounded-md hidden sm:block" />
            <div className="w-10 h-5 bg-[#543825] border-2 border-[#2E1B10] rounded-md" />
            <div className="w-14 h-4 bg-[#8D6448] border-2 border-[#2E1B10] rounded-md" />
            <div className="w-8 h-4 bg-[#543825] border-2 border-[#2E1B10] rounded-md hidden sm:block" />
          </div>
        </div>

        {
    /* Oversized Stylized Leaves Framing Bottom Corners */
  }
        {
    /* Bottom Left Leaf Cluster */
  }
        <div className="absolute -bottom-4 -left-6 sm:left-0 w-32 sm:w-44 text-[#2E7D48] opacity-90 drop-shadow-[4px_4px_0_#2E1B10]">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path
    d="M0 100 C20 40, 80 40, 95 60 C80 90, 40 100, 0 100 Z"
    stroke="#2E1B10"
    strokeWidth="3.5"
  />
          </svg>
        </div>

        {
    /* Bottom Right Leaf Cluster */
  }
        <div className="absolute -bottom-4 -right-6 sm:right-0 w-32 sm:w-44 text-[#3FA65F] opacity-90 drop-shadow-[-4px_4px_0_#2E1B10] transform -scale-x-100">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path
    d="M0 100 C20 40, 80 40, 95 60 C80 90, 40 100, 0 100 Z"
    stroke="#2E1B10"
    strokeWidth="3.5"
  />
          </svg>
        </div>
      </div>
    </div>;
};

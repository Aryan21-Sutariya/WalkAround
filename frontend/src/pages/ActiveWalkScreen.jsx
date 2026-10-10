import { useRef } from "react";
import { Camera, TreePine, Sparkles, Map, Upload } from "lucide-react";

export const ActiveWalkScreen = ({
  noticedCount,
  onOpenCapture,
  onUploadPhoto,
  onEndWalk,
  onOpenMap
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUploadPhoto) {
      const url = URL.createObjectURL(file);
      onUploadPhoto(url);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative z-10 flex h-full w-full overflow-y-auto hide-scrollbar flex-col items-center justify-between px-4 sm:px-6 pt-8 sm:pt-12 pb-24 sm:pb-32 text-center max-w-lg mx-auto">
      {/* Hidden file input with pure file picker, no camera capture override */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Milestone Sign */}
      <header className="pt-2 flex flex-col items-center w-full relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#FAF6ED] border-2.5 border-[#2E1B10] rounded-xl shadow-[0_3px_0_#2E1B10] text-[11px] font-mono font-black tracking-widest text-[#2E1B10] uppercase mb-4">
          <TreePine className="w-3.5 h-3.5 text-[#42A85F]" />
          <span>Walking in the Wild</span>
        </div>
        <button
          onClick={onOpenMap}
          className="absolute right-0 top-0 pointer-events-auto bg-[#F49D1A] border-3 border-[#2E1B10] rounded-xl p-2 shadow-[0_4px_0_#2E1B10] hover:-translate-y-0.5 transition-transform z-10 cursor-pointer"
          aria-label="Open Map"
        >
          <Map className="w-5 h-5 text-[#2E1B10]" />
        </button>

        {/* Quiet Wooden Banner */}
        <div className="bg-[#FAF6ED]/95 border-3 border-[#2E1B10] rounded-2xl px-6 py-3.5 shadow-[0_4px_0_#2E1B10]">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#2E1B10] tracking-tight mb-0.5">
            Keep your phone away.
          </h2>
          <p className="font-display font-extrabold text-sm sm:text-base text-[#D97706]">
            Look around you.
          </p>
        </div>
      </header>

      {/* Cozy Wooden Field Milestone Counter */}
      <div className="my-auto py-6 flex flex-col items-center">
        <div className="relative group">
          {/* Hanging Forest Token Plaque */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 bg-[#FAF6ED] border-3.5 border-[#2E1B10] rounded-3xl shadow-[0_6px_0_#2E1B10,0_12px_24px_rgba(46,27,16,0.2)] flex flex-col items-center justify-center p-3 transform hover:scale-105 transition-transform duration-200">
            {/* Top Hanging Loop */}
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

          {/* Mini Gold Badge */}
          <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 bg-[#FFB703] border-2 border-[#2E1B10] rounded-lg shadow-[0_2px_0_#2E1B10] text-[10px] font-mono font-black text-[#2E1B10] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>LOG</span>
          </div>
        </div>

        <p className="mt-4 text-xs font-mono font-bold text-[#2E1B10]/70">
          Listen to the wind · Notice tiny details
        </p>
      </div>

      {/* Explorer Controls */}
      <footer className="w-full pb-3 flex flex-col items-center gap-5">
        {/* Action Buttons: Camera and Upload */}
        <div className="flex items-center justify-center gap-6">
          {/* Camera Capture Button */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={onOpenCapture}
              type="button"
              aria-label="Capture with Camera"
              className="group relative flex items-center justify-center w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-br from-[#FFC436] to-[#F49D1A] border-3.5 border-[#2E1B10] shadow-[0_6px_0_#2E1B10,0_12px_20px_rgba(46,27,16,0.25)] hover:shadow-[0_8px_0_#2E1B10] hover:-translate-y-1 active:translate-y-1.5 active:shadow-[0_2px_0_#2E1B10] transition-all duration-150 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3B0] border-2.5 border-[#2E1B10] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Camera className="w-7 h-7 text-[#2E1B10] stroke-[2.4]" />
              </div>
            </button>
            <span className="font-display font-black text-xs tracking-widest text-[#2E1B10] uppercase">
              Camera
            </span>
          </div>

          {/* Direct File Upload Button */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              aria-label="Upload Photo from Device"
              className="group relative flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-[#FAF6ED] border-3.5 border-[#2E1B10] shadow-[0_5px_0_#2E1B10,0_10px_16px_rgba(46,27,16,0.18)] hover:shadow-[0_7px_0_#2E1B10] hover:-translate-y-1 active:translate-y-1.5 active:shadow-[0_2px_0_#2E1B10] transition-all duration-150 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#FFB703]/30 border-2 border-[#2E1B10] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5 text-[#2E1B10] stroke-[2.4]" />
              </div>
            </button>
            <span className="font-display font-black text-xs tracking-widest text-[#2E1B10] uppercase">
              Upload
            </span>
          </div>
        </div>

        {/* End Walk Button */}
        <button
          onClick={onEndWalk}
          type="button"
          className="wood-btn-secondary px-5 py-2 text-xs font-mono font-black tracking-wider uppercase cursor-pointer"
        >
          End Walk
        </button>
      </footer>
    </div>
  );
};

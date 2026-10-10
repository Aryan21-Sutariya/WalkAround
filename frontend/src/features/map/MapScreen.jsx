import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { X, Trash2, MapPin } from "lucide-react";
import { useEffect } from "react";

// Nature Blocks Custom Marker Icon
const markerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#EFE8D6" stroke="#2E1B10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
  <circle cx="12" cy="10" r="3" fill="#42A85F"/>
</svg>
`;
const customIcon = L.divIcon({
  className: "custom-leaflet-icon",
  html: markerSvg,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -32],
});

function MapFocus({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
    }
  }, [points, map]);
  return null;
}

export const MapScreen = ({ onClose, points, onClearHistory }) => {
  const polylineCoords = points.map((p) => [p.lat, p.lng]);

  return (
    <div className="relative z-50 h-full w-full bg-[#FAF6ED] flex flex-col items-center">
      <header className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto bg-[#FAF6ED] border-3 border-[#2E1B10] rounded-xl px-4 py-2 shadow-[0_4px_0_#2E1B10] flex items-center gap-2">
          <MapPin className="text-[#42A85F] w-5 h-5" />
          <span className="font-display font-black text-sm uppercase text-[#2E1B10]">Journey Map</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClearHistory}
            className="pointer-events-auto bg-[#F49D1A] border-3 border-[#2E1B10] rounded-xl p-2 shadow-[0_4px_0_#2E1B10] hover:-translate-y-0.5 transition-transform"
            aria-label="Clear History"
          >
            <Trash2 className="w-5 h-5 text-[#2E1B10]" />
          </button>
          <button
            onClick={onClose}
            className="pointer-events-auto bg-[#EF476F] border-3 border-[#2E1B10] rounded-xl p-2 shadow-[0_4px_0_#2E1B10] hover:-translate-y-0.5 transition-transform"
            aria-label="Close Map"
          >
            <X className="w-5 h-5 text-[#2E1B10]" />
          </button>
        </div>
      </header>

      <div className="w-full h-full p-2 pb-24 sm:pb-32 relative">
        <div className="w-full h-full rounded-2xl border-4 border-[#2E1B10] shadow-[0_8px_0_#2E1B10] overflow-hidden bg-[#EFE8D6]">
          <MapContainer 
            center={points.length > 0 ? [points[points.length-1].lat, points[points.length-1].lng] : [0, 0]} 
            zoom={15} 
            className="w-full h-full"
            zoomControl={false}
          >
            {/* Using CartoDB Voyager which matches our warm cream theme nicely */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {points.length > 0 && <Polyline positions={polylineCoords} color="#42A85F" weight={4} dashArray="8, 8" />}
            
            {points.map((pt, i) => (
              <Marker key={i} position={[pt.lat, pt.lng]} icon={customIcon}>
                <Popup className="font-sans font-bold text-[#2E1B10] border-2 border-[#2E1B10] rounded-lg">
                  <div className="p-1">
                    {pt.title ? pt.title : "Visited Path"} <br/>
                    <span className="text-xs text-[#8C7A68]">
                      {new Date(pt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
            <MapFocus points={points} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

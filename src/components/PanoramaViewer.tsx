import { useEffect, useRef, useState } from "react";
import { RotateCcw, ZoomIn, ZoomOut, Move } from "lucide-react";

interface Location {
  name: string;
  id: string;
  imageUrl: string;
  description?: string;
}

const locations: Location[] = [
  {
    name: "Site A - Main Plaza",
    id: "site-a",
    imageUrl:
      "https://placehold.co/2000x1000/1e40af/white?text=Main+Plaza+Panorama+360%C2%B0+View",
    description: "Central gathering area with emergency exits marked",
  },
  {
    name: "Site B - Emergency Center",
    id: "site-b",
    imageUrl:
      "https://placehold.co/2000x1000/7e22ce/white?text=Emergency+Center+Operations+Room",
    description: "Command and control hub for emergency response",
  },
  {
    name: "Site C - Evacuation Point",
    id: "site-c",
    imageUrl:
      "https://placehold.co/2000x1000/0d9488/white?text=Evacuation+Point+Assembly+Area",
    description: "Designated safe zone for personnel assembly",
  },
];

export default function PanoramaViewer() {
  const [selectedLocation, setSelectedLocation] = useState<string>(
    locations[0].id,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState<boolean>(true);

  // Transform state
  const [zoom, setZoom] = useState<number>(1.2);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const pointerRef = useRef<{
    id: number | null;
    lastX: number;
    lastY: number;
  }>({ id: null, lastX: 0, lastY: 0 });

  const currentLocation = locations.find((l) => l.id === selectedLocation)!;

  useEffect(() => {
    // Reset state when location changes
    setIsLoading(true);
    setError(null);
    setZoom(1.2);
    setOffset({ x: 0, y: 0 });
    setIsDragging(false);
  }, [selectedLocation]);

  const clampOffset = (x: number, y: number) => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return { x, y };

    const cRect = container.getBoundingClientRect();
    const maxX = Math.max(0, (img.naturalWidth * zoom - cRect.width) / 2);
    const maxY = Math.max(0, (img.naturalHeight * zoom - cRect.height) / 2);

    const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));
    return { x: clamp(x, maxX), y: clamp(y, maxY) };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    pointerRef.current = {
      id: e.pointerId,
      lastX: e.clientX,
      lastY: e.clientY,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerRef.current.id !== e.pointerId) return;
    const dx = e.clientX - pointerRef.current.lastX;
    const dy = e.clientY - pointerRef.current.lastY;
    pointerRef.current.lastX = e.clientX;
    pointerRef.current.lastY = e.clientY;
    setOffset((prev) => {
      const next = { x: prev.x + dx, y: prev.y + dy };
      return clampOffset(next.x, next.y);
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {}
    pointerRef.current.id = null;
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY / 500; // smooth zoom factor
    setZoom((z) => {
      const next = Math.max(1, Math.min(3, z + delta));
      return next;
    });
  };

  useEffect(() => {
    // Ensure offset stays valid when zoom changes
    setOffset((o) => clampOffset(o.x, o.y));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  const onImgLoad = () => {
    setIsLoading(false);
  };

  const onImgError = () => {
    setIsLoading(false);
    setError("Failed to load panorama image. Please try again.");
  };

  const resetView = () => {
    setZoom(1.2);
    setOffset({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setZoom((z) => Math.min(3, z + 0.2));
  };

  const zoomOut = () => {
    setZoom((z) => Math.max(1, z - 0.2));
  };

  return (
    <div className="w-full h-full bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-white/50 flex flex-col">
      <div className="mb-4">
        <label className="block text-[#1a1a2e] font-semibold mb-2 text-sm">
          Select Location:
        </label>
        <div className="relative">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/80 border-2 border-white/60 shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-700 font-medium transition-all appearance-none"
            disabled={isLoading}
          >
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div
        className="flex-1 rounded-2xl overflow-hidden shadow-inner bg-gray-900 relative"
        onWheel={handleWheel}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-medium text-lg">
                Loading panorama view...
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Preparing immersive experience
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
            <div className="text-center p-8 bg-red-500/20 rounded-xl max-w-md backdrop-blur-sm">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Panorama Load Error
              </h3>
              <p className="text-red-200 mb-6">{error}</p>
              <button
                onClick={() => setSelectedLocation(selectedLocation)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-semibold shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          className="w-full h-full min-h-[400px] relative touch-none cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="absolute inset-0 overflow-hidden">
            <img
              ref={imgRef}
              src={currentLocation.imageUrl}
              alt={`${currentLocation.name} Panorama`}
              onLoad={onImgLoad}
              onError={onImgError}
              style={{
                transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
                transformOrigin: "center center",
                transition: isLoading ? "none" : "transform 0.15s ease",
              }}
              className="w-full h-full object-cover will-change-transform select-none"
              draggable={false}
            />

            {/* Enhanced overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

            {/* Top info panel */}
            <div className="absolute top-4 left-4 right-4 bg-black/60 backdrop-blur-sm text-white px-4 py-3 rounded-xl z-10 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl">{currentLocation.name}</h3>
                  {currentLocation.description && (
                    <p className="text-sm text-gray-300 mt-1">
                      {currentLocation.description}
                    </p>
                  )}
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full text-xs font-bold">
                  360° VIEW
                </div>
              </div>
            </div>

            {/* Bottom controls overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <Move
                    className={`w-4 h-4 ${isDragging ? "text-blue-400" : "text-gray-400"}`}
                  />
                  <span>Drag to explore</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={resetView}
                  className="bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white p-2 rounded-lg transition-all shadow-lg"
                  title="Reset view"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={zoomOut}
                  className="bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white p-2 rounded-lg transition-all shadow-lg"
                  title="Zoom out"
                  disabled={zoom <= 1}
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm flex items-center">
                  {Math.round((zoom - 1) * 100)}%
                </div>
                <button
                  onClick={zoomIn}
                  className="bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white p-2 rounded-lg transition-all shadow-lg"
                  title="Zoom in"
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Help overlay */}
            {showHelp && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/70 backdrop-blur-sm text-white p-6 rounded-2xl text-center max-w-md pointer-events-auto">
                  <div className="text-4xl mb-3">👋</div>
                  <h3 className="text-xl font-bold mb-2">
                    Interactive Panorama Viewer
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Drag to look around, scroll to zoom in/out
                  </p>
                  <button
                    onClick={() => setShowHelp(false)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/80 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-blue-700 font-semibold uppercase tracking-wide mb-1">
            Current View
          </div>
          <div className="text-sm font-bold text-gray-800 truncate">
            {currentLocation?.name}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50/80 to-purple-100/80 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-purple-700 font-semibold uppercase tracking-wide mb-1">
            Zoom Level
          </div>
          <div className="text-sm font-bold text-gray-800">
            {Math.round((zoom - 1) * 100)}%
          </div>
        </div>
        <div className="bg-gradient-to-br from-cyan-50/80 to-cyan-100/80 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-cyan-700 font-semibold uppercase tracking-wide mb-1">
            Navigation
          </div>
          <div className="text-sm font-bold text-gray-800">Drag & Scroll</div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-[#1a1a2e]/70 font-medium flex flex-wrap justify-center gap-3">
        <span className="bg-white/50 px-3 py-1.5 rounded-lg flex items-center gap-1">
          <Move className="w-4 h-4" /> Drag: Look around
        </span>
        <span className="bg-white/50 px-3 py-1.5 rounded-lg flex items-center gap-1">
          <ZoomIn className="w-4 h-4" /> Scroll: Zoom
        </span>
        <span className="bg-white/50 px-3 py-1.5 rounded-lg flex items-center gap-1">
          <RotateCcw className="w-4 h-4" /> Reset: Center view
        </span>
      </div>
    </div>
  );
}

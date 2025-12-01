import { useState, useEffect, useRef } from "react";
import {
  Loader2,
  AlertCircle,
  Copy,
  Download,
  Check,
  X,
  Info,
} from "lucide-react";
import "pannellum/build/pannellum.js";
import "pannellum/build/pannellum.css";

declare global {
  interface Window {
    pannellum: any;
  }
}

interface PanoramaImage {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  description?: string;
}

interface PanoramaGalleryProps {
  folderId?: string;
  title: string;
  useSupabase?: boolean;
}

export default function PanoramaGallery({
  folderId,
  title,
  useSupabase = true,
}: PanoramaGalleryProps) {
  const [images, setImages] = useState<PanoramaImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<PanoramaImage | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const viewerContainer = useRef<HTMLDivElement>(null);
  const viewerInstance = useRef<any>(null);

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;
    
    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      try {
        if (useSupabase) {
          // Fetch from Supabase via API
          const response = await fetch("/api/panoramas", {
            signal: abortController.signal
          });
          
          if (!isMounted) return;
          
          if (!response.ok) {
            console.error(`Failed to fetch panoramas: ${response.status} ${response.statusText}`);
            // Instead of throwing, just set empty array
            setImages([]);
            setLoading(false);
            return;
          }

          const data = await response.json();
          
          if (!isMounted) return;
          
          const fetchedImages = (data.panoramas || []).map((panorama: any) => ({
            id: String(panorama.id),
            name: panorama.name,
            url: panorama.image_url,
            thumbnailUrl: panorama.thumbnail_url || panorama.image_url,
            description: panorama.description,
          }));

          setImages(fetchedImages);
        } else {
          // Legacy Google Drive mode
          if (!folderId) {
            setError("No folder ID provided");
            setLoading(false);
            return;
          }

          const apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
          if (!apiKey) {
            throw new Error(
              "Google Drive API key not configured. Please add VITE_GOOGLE_DRIVE_API_KEY to your environment variables.",
            );
          }

          const query = encodeURIComponent(
            `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`,
          );
          const fields = encodeURIComponent(
            "files(id, name, mimeType, thumbnailLink, webViewLink, createdTime)",
          );
          const driveUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&key=${apiKey}&pageSize=100&orderBy=createdTime desc`;

          const response = await fetch(driveUrl);

          if (!response.ok) {
            throw new Error(`Failed to fetch images: ${response.statusText}`);
          }

          const data = await response.json();

          const fetchedImages = (data.files || []).map((file: any) => ({
            id: file.id,
            name: file.name,
            url: `https://drive.google.com/uc?export=view&id=${file.id}`,
            thumbnailUrl:
              file.thumbnailLink ||
              `https://drive.google.com/thumbnail?id=${file.id}&sz=w500`,
          }));

          setImages(fetchedImages);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Error loading images:", errorMessage);
        if (isMounted) {
          setError(errorMessage);
          setImages([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchImages();
    
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [folderId, useSupabase]);

  useEffect(() => {
    if (!selectedImage || !viewerContainer.current) return;

    // Clean up previous viewer instance
    if (viewerInstance.current) {
      viewerInstance.current.destroy();
      viewerInstance.current = null;
    }

    setViewerLoaded(false);

    try {
      viewerInstance.current = window.pannellum.viewer(
        viewerContainer.current,
        {
          type: "equirectangular",
          panorama: selectedImage.url,
          autoLoad: true,
          showControls: true,
          showFullscreenCtrl: true,
          showZoomCtrl: true,
          mouseZoom: true,
          draggable: true,
          keyboardZoom: true,
          autoRotate: -2,
          compass: true,
          northOffset: 0,
          hfov: 100,
          pitch: 0,
          yaw: 0,
          onLoad: () => {
            setViewerLoaded(true);
          },
        },
      );

      // Add event listeners for better user experience
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closePanorama();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        if (viewerInstance.current) {
          viewerInstance.current.destroy();
          viewerInstance.current = null;
        }
      };
    } catch (err) {
      console.error("Error initializing panorama viewer:", err);
      setError("Failed to initialize panorama viewer");
    }
  }, [selectedImage]);

  const openPanorama = (image: PanoramaImage) => {
    setSelectedImage(image);
  };

  const closePanorama = () => {
    setSelectedImage(null);
    setCopied(false);
    setViewerLoaded(false);
    if (viewerInstance.current) {
      viewerInstance.current.destroy();
      viewerInstance.current = null;
    }
  };

  const copyImageUrl = async () => {
    if (!selectedImage) return;
    try {
      await navigator.clipboard.writeText(selectedImage.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadImage = () => {
    if (!selectedImage) return;
    const link = document.createElement("a");
    link.href = selectedImage.url;
    link.download = selectedImage.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to extract clean filename without extension
  const getCleanFilename = (filename: string) => {
    return filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
  };

  return (
    <div className="w-full h-full bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">{title}</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full"></div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
            <p className="text-[#1a1a2e]/70 font-medium">
              Loading 360° panorama images...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-[#1a1a2e] font-semibold mb-2">
              Error Loading Images
            </p>
            <p className="text-[#1a1a2e]/70 text-sm">{error}</p>
          </div>
        </div>
      ) : images.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-[#1a1a2e]/70 font-medium text-lg mb-2">
              No panorama images found
            </p>
            <p className="text-[#1a1a2e]/50 text-sm">
              Panoramas can be added through the Admin Panel
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-video rounded-2xl overflow-hidden bg-white/60 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              onClick={() => openPanorama(image)}
              data-testid={`panorama-card-${image.id}`}
            >
              <img
                src={image.thumbnailUrl}
                alt={image.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-white font-semibold text-sm truncate block mb-1">
                    {getCleanFilename(image.name)}
                  </span>
                  {image.description && (
                    <span className="text-white/80 text-xs block truncate">
                      {image.description}
                    </span>
                  )}
                  <span className="text-white/70 text-xs mt-1 block">
                    Click to view 360°
                  </span>
                </div>
              </div>
              {/* Title at the bottom of the grid view */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
                <h3 className="text-white font-semibold text-sm truncate text-center">
                  {getCleanFilename(image.name)}
                </h3>
              </div>
              <div className="absolute top-3 right-3 bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Info className="w-3 h-3" />
                360°
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col backdrop-blur-sm"
          onClick={closePanorama}
          data-testid="panorama-viewer-modal"
        >
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md"
              onClick={(e) => {
                e.stopPropagation();
                copyImageUrl();
              }}
              title="Copy image URL"
              data-testid="button-copy-url"
            >
              {copied ? (
                <Check className="w-6 h-6 text-green-400" />
              ) : (
                <Copy className="w-6 h-6 text-white" />
              )}
            </button>
            <button
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md"
              onClick={(e) => {
                e.stopPropagation();
                downloadImage();
              }}
              title="Download image"
              data-testid="button-download"
            >
              <Download className="w-6 h-6 text-white" />
            </button>
            <button
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md"
              onClick={closePanorama}
              title="Close"
              data-testid="button-close-viewer"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div
            className="flex-1 p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {!viewerLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 rounded-2xl">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
                  <p className="text-white font-medium">
                    Loading panorama...
                  </p>
                </div>
              </div>
            )}
            <div
              ref={viewerContainer}
              className="w-full h-full rounded-2xl overflow-hidden"
            ></div>
          </div>

          <div className="bg-black/50 backdrop-blur-md p-4 text-center">
            <p className="text-white font-medium mb-1">
              {getCleanFilename(selectedImage.name)}
            </p>
            {selectedImage.description && (
              <p className="text-white/80 text-sm mb-2">
                {selectedImage.description}
              </p>
            )}
            <p className="text-white/70 text-sm flex flex-wrap justify-center gap-4">
              <span>Drag to look around</span>
              <span>Scroll to zoom</span>
              <span>Arrow keys for navigation</span>
              <span>Click fullscreen for immersive view</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

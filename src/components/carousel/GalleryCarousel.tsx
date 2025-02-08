import * as React from "react";
import { cn } from "../../utils/cn";
import { BiChevronLeft, BiChevronRight, BiDownload, BiX, BiZoomIn, BiZoomOut } from "react-icons/bi";
import { FiRotateCw } from "react-icons/fi";
import { BsInfo } from "react-icons/bs";
import { useGalleryCarousel } from "./hooks/useGalleryCarousel"; // استيراد الهوك الجديد
import { GalleryCarouselProps ,GalleryImage} from "./types";



const GalleryCarousel = React.forwardRef<HTMLDivElement, GalleryCarouselProps>(
  (
    {
      images = [],
      initialIndex = 0,
      thumbnailSize = 80,
      gridCols = 4,
      showInfo = true,
      showControls = true,
      showThumbnails = true,
      enableDownload = true,
      enableZoom = true,
      enableRotate = true,
      onClose,
      onImageChange,
      className,
      ...props
    },
    ref
  ) => {
    const {
      currentIndex,
      isZoomed,
      zoomLevel,
      rotation,
      position,
      handlePrevious,
      handleNext,
      handleThumbnailClick,
      resetZoom,
      handleZoomIn,
      handleZoomOut,
      handleRotate,
      setPosition,
      setIsZoomed
    } = useGalleryCarousel(images, initialIndex, onImageChange);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const imageRef = React.useRef<HTMLImageElement>(null);
    const [showMetadata, setShowMetadata] = React.useState(false);

    const currentImage = images[currentIndex];

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomed || !containerRef.current || !imageRef.current) return;

      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;

      setPosition({ x, y });
    };

    const handleDownload = () => {
      const link = document.createElement("a");
      link.href = currentImage.src;
      link.download = currentImage.title || "image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const formatDate = (date: string | Date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <div
        ref={ref}
        className={cn("relative flex flex-col gap-4", className)}
        {...props}
      >
        {/* Main Image Container */}
        <div
          ref={containerRef}
          className="relative aspect-video overflow-hidden rounded-lg bg-black"
          onMouseMove={handleMouseMove}
        >
          <img
            ref={imageRef}
            src={currentImage.src}
            alt={currentImage.alt || ""}
            className="h-full w-full object-contain transition-transform"
            style={{
              transform: `rotate(${rotation}deg) scale(${zoomLevel})`,
              transformOrigin: isZoomed
                ? `${position.x}% ${position.y}%`
                : "center",
              cursor: isZoomed ? "zoom-out" : "zoom-in",
            }}
            onClick={() => setIsZoomed(!isZoomed)}
          />

          {/* Controls */}
          {showControls && (
            <div className="absolute right-4 top-4 flex gap-2">
              {enableZoom && (
                <>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm backdrop-blur-sm hover:bg-background hover:text-foreground"
                  >
                    <BiZoomIn className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm backdrop-blur-sm hover:bg-background hover:text-foreground"
                  >
                    <BiZoomOut className="h-5 w-5" />
                  </button>
                </>
              )}
              {enableRotate && (
                <button
                  type="button"
                  onClick={handleRotate}
                  className="rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm backdrop-blur-sm hover:bg-background hover:text-foreground"
                >
                  <FiRotateCw className="h-5 w-5" />
                </button>
              )}
              {enableDownload && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm backdrop-blur-sm hover:bg-background hover:text-foreground"
                >
                  <BiDownload className="h-5 w-5" />
                </button>
              )}
              {showInfo && currentImage.metadata && (
                <button
                  type="button"
                  onClick={() => setShowMetadata(!showMetadata)}
                  className="rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm backdrop-blur-sm hover:bg-background hover:text-foreground"
                >
                  <BsInfo className="h-5 w-5" />
                </button>
              )}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm backdrop-blur-sm hover:bg-background hover:text-foreground"
                >
                  <BiX className="h-5 w-5" />
                  </button>
              )}
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-3 text-foreground/80 shadow-sm backdrop-blur-sm hover:bg-background hover:text-foreground"
              >
                <BiChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-3 text-foreground/80 shadow-sm backdrop-blur-sm hover:bg-background hover:text-foreground"
              >
                <BiChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image Info */}
          {showInfo && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
              {currentImage.title && (
                <h3 className="text-lg font-semibold">{currentImage.title}</h3>
              )}
              {currentImage.description && (
                <p className="mt-1 text-sm">{currentImage.description}</p>
              )}
              {currentImage.date && (
                <p className="mt-1 text-sm text-gray-300">
                  {formatDate(currentImage.date)}
                </p>
              )}
              {currentImage.tags && currentImage.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {currentImage.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/20 px-2 py-1 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Metadata Panel */}
          {showMetadata && currentImage.metadata && (
            <div className="absolute right-0 top-16 w-64 rounded-lg bg-background/95 p-4 shadow-lg backdrop-blur-sm">
              <h4 className="mb-2 font-semibold">Image Metadata</h4>
              <div className="space-y-1">
                {Object.entries(currentImage.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Thumbnails Grid */}
        {showThumbnails && images.length > 1 && (
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            }}
          >
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-md",
                  index === currentIndex && "ring-2 ring-primary ring-offset-2"
                )}
              >
                <img
                  src={image.src}
                  alt={image.alt || ""}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

GalleryCarousel.displayName = "GalleryCarousel";

export { GalleryCarousel, type GalleryCarouselProps, type GalleryImage };
import * as React from "react";
import { cn } from "../../utils/cn";
import { BiChevronDown, BiChevronLeft, BiChevronRight, BiChevronUp, BiZoomIn, BiZoomOut } from "react-icons/bi";
import { FiRotateCw } from "react-icons/fi";
import { useCarousel } from "./hooks/useCarousel"; // تأكد من المسار الصحيح
import { ThumbnailCarouselProps } from "./types";



const ThumbnailCarousel = React.forwardRef<HTMLDivElement, ThumbnailCarouselProps>(
  (
    {
      images = [],
      thumbnailPosition = "bottom",
      thumbnailSize = 80,
      thumbnailGap = 8,
      visibleThumbnails = 5,
      showArrows = true,
      showZoom = true,
      zoomScale = 2,
      onImageChange,
      className,
      ...props
    },
    ref
  ) => {
    const {
      currentSlide,
      handlePrevious,
      handleNext,
      handleIndicatorClick,
      setIsPlaying,
    } = useCarousel(
      images,
      true, // autoPlay
      5000, // interval
      1, // slidesToShow
      1, // slidesToScroll
      true, // loop
      true // pauseOnHover
    );

    const [thumbnailStart, setThumbnailStart] = React.useState(0);
    const [isZoomed, setIsZoomed] = React.useState(false);
    const [zoomPosition, setZoomPosition] = React.useState({ x: 0, y: 0 });
    const [rotation, setRotation] = React.useState(0);
    const mainImageRef = React.useRef<HTMLImageElement>(null);

    const isVertical = thumbnailPosition === "left" || thumbnailPosition === "right";

    const handleThumbnailScroll = (direction: "prev" | "next") => {
      setThumbnailStart((prev) => {
        if (direction === "prev") {
          return Math.max(0, prev - 1);
        } else {
          return Math.min(images.length - visibleThumbnails, prev + 1);
        }
      });
    };

    const handleZoom = () => {
      setIsZoomed(!isZoomed);
      if (isZoomed) {
        setZoomPosition({ x: 0, y: 0 });
      }
    };

    const handleImageMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
      if (!isZoomed || !mainImageRef.current) return;

      const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;

      setZoomPosition({ x, y });
    };

    const handleRotate = () => {
      setRotation((prev) => (prev + 90) % 360);
    };

    const visibleThumbnails = images.slice(
      thumbnailStart,
      thumbnailStart + visibleThumbnails
    );

    return (
      <div
        ref={ref}         className={cn(
          "relative",
          isVertical ? "flex" : "flex flex-col",
          className
        )}
        {...props}
      >
        {/* Main Image */}
        <div className="relative flex-1 overflow-hidden">
          <img
            ref={mainImageRef}
            src={images[currentSlide].src}
            alt={images[currentSlide].alt || ""}
            className={cn(
              "h-full w-full object-contain transition-transform",
              isZoomed && "cursor-zoom-out"
            )}
            style={{
              transform: `rotate(${rotation}deg) scale(${isZoomed ? zoomScale : 1})`,
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
            onClick={handleZoom}
            onMouseMove={handleImageMouseMove}
          />

          {/* Navigation Arrows */}
          {showArrows && images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground"
              >
                <BiChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground"
              >
                <BiChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Controls */}
          <div className="absolute right-4 top-4 flex gap-2">
            {showZoom && (
              <>
                <button
                  type="button"
                  onClick={handleZoom}
                  className="rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground"
                >
                  {isZoomed ? (
                    <BiZoomOut className="h-4 w-4" />
                  ) : (
                    <BiZoomIn className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  className="rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground"
                >
                  <FiRotateCw className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        <div
          className={cn(
            "flex",
            isVertical ? "flex-col" : "flex-row",
            thumbnailPosition === "left" && "mr-2",
            thumbnailPosition === "right" && "ml-2",
            thumbnailPosition === "top" && "mb-2",
            thumbnailPosition === "bottom" && "mt-2"
          )}
          style={{ gap: thumbnailGap }}
        >
          {thumbnailStart > 0 && (
            <button
              type="button"
              onClick={() => handleThumbnailScroll("prev")}
              className="rounded-full bg-background/80 p-1 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground"
            >
              {isVertical ? (
                <BiChevronUp className="h-4 w-4" />
              ) : (
                <BiChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}

          {visibleThumbnails.map((image, index) => {
            const actualIndex = thumbnailStart + index;
            return (
              <button
                key={actualIndex}
                type="button"
                onClick={() => handleThumbnailClick(actualIndex)}
                className={cn(
                  "relative overflow-hidden rounded-md border-2 transition-all",
                  actualIndex === currentSlide
                    ? "border-primary"
                    : "border-transparent hover:border-primary/50"
                )}
                style={{
                  width: thumbnailSize,
                  height: thumbnailSize,
                }}
              >
                <img
                  src={image.thumbnail || image.src}
                  alt={image.alt || ""}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}

          {thumbnailStart + visibleThumbnails < images.length && (
            <button
              type="button"
              onClick={() => handleThumbnailScroll("next")}
              className="rounded-full bg-background/80 p-1 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground"
            >
              {isVertical ? (
                <BiChevronDown className="h-4 w-4" />
              ) : (
                <BiChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);

ThumbnailCarousel.displayName = "ThumbnailCarousel";

export { ThumbnailCarousel, type ThumbnailCarouselProps };
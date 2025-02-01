import * as React from "react";
import { cn } from "../../../utils/cn";
import { BiChevronLeft, BiChevronRight, BiDownload, BiMinus, BiX, BiZoomIn, BiZoomOut } from "react-icons/bi";
import { FiRotateCw } from "react-icons/fi";

interface ImagePreviewDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  images: Array<{
    src: string;
    alt?: string;
    title?: string;
  }>;
  initialIndex?: number;
  showThumbnails?: boolean;
  showControls?: boolean;
  allowDownload?: boolean;
  onIndexChange?: (index: number) => void;
}

const ImagePreviewDialog = React.forwardRef<HTMLDivElement, ImagePreviewDialogProps>(
  (
    {
      open = false,
      onOpenChange,
      images = [],
      initialIndex = 0,
      showThumbnails = true,
      showControls = true,
      allowDownload = true,
      onIndexChange,
      className,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
    const [scale, setScale] = React.useState(1);
    const [rotation, setRotation] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const dragStart = React.useRef({ x: 0, y: 0 });
    const imageRef = React.useRef<HTMLImageElement>(null);

    if (!open || images.length === 0) return null;

    const currentImage = images[currentIndex];

    const handleClose = () => {
      onOpenChange?.(false);
      // Reset transformations
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    };

    const handlePrevious = () => {
      const newIndex = (currentIndex - 1 + images.length) % images.length;
      setCurrentIndex(newIndex);
      onIndexChange?.(newIndex);
      // Reset transformations
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    };

    const handleNext = () => {
      const newIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(newIndex);
      onIndexChange?.(newIndex);
      // Reset transformations
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    };

    const handleZoomIn = () => {
      setScale((prev) => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
      setScale((prev) => Math.max(prev - 0.25, 0.5));
    };

    const handleRotate = () => {
      setRotation((prev) => (prev + 90) % 360);
    };

    const handleReset = () => {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    };

    const handleDownload = () => {
      const link = document.createElement("a");
      link.href = currentImage.src;
      link.download = currentImage.title || "image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;

      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    return (
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        ref={ref}
        {...props}
      >
        <div className="fixed inset-6 z-50 flex flex-col rounded-lg border border-gray-200 bg-background shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="text-sm font-medium">
              {currentImage.title || `Image ${currentIndex + 1} of ${images.length}`}
            </div>
            <div className="flex items-center gap-2">
              {showControls && (
                <>
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="rounded-full p-2 hover:bg-muted"
                  >
                    <BiZoomOut className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="rounded-full p-2 hover:bg-muted"
                  >
                    <BiZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="rounded-full p-2 hover:bg-muted"
                  >
                    <FiRotateCw className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-full p-2 hover:bg-muted"
                  >
                    <BiMinus className="h-4 w-4" />
                  </button>
                  {allowDownload && (
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="rounded-full p-2 hover:bg-muted"
                    >
                      <BiDownload className="h-4 w-4" />
                    </button>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-2 hover:bg-muted"
              >
                <BiX className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative flex-1 overflow-hidden">
            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background p-2 shadow-lg hover:bg-muted"
                >
                  <BiChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background p-2 shadow-lg hover:bg-muted"
                >
                  <BiChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Image */}
            <div
              className="h-full w-full"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={currentImage.src}
                alt={currentImage.alt || ""}
                className={cn(
                  "h-full w-full object-contain transition-transform",
                  isDragging && "cursor-grabbing"
                )}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                }}
                draggable={false}
              />
            </div>
          </div>

          {/* Thumbnails */}
          {showThumbnails && images.length > 1 && (
            <div className="border-t p-4">
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(index);
                      onIndexChange?.(index);
                      setScale(1);
                      setRotation(0);
                      setPosition({ x: 0, y: 0 });
                    }}
                    className={cn(
                      "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2",
                      index === currentIndex
                        ? "border-primary"
                        : "border-transparent hover:border-muted"
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
            </div>
          )}
        </div>
      </div>
    );
  }
);

ImagePreviewDialog.displayName = "ImagePreviewDialog";

export { ImagePreviewDialog, type ImagePreviewDialogProps };

import * as React from "react";
import { cn } from "../../../utils/cn";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";


interface VerticalCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: React.ReactNode[];
  height?: number | string;
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showIndicators?: boolean;
  pauseOnHover?: boolean;
  loop?: boolean;
  animation?: "slide" | "fade";
  transitionDuration?: number;
  slideSpacing?: number;
  onSlideChange?: (index: number) => void;
}

const VerticalCarousel = React.forwardRef<HTMLDivElement, VerticalCarouselProps>(
  (
    {
      slides = [],
      height = 400,
      autoPlay = true,
      interval = 5000,
      showArrows = true,
      showIndicators = true,
      pauseOnHover = true,
      loop = true,
      animation = "slide",
      transitionDuration = 300,
      slideSpacing = 0,
      onSlideChange,
      className,
      ...props
    },
    ref
  ) => {
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);
    const [touchStart, setTouchStart] = React.useState(0);
    const [touchEnd, setTouchEnd] = React.useState(0);
    const autoPlayRef = React.useRef<NodeJS.Timeout>();

    const startAutoPlay = React.useCallback(() => {
      if (autoPlay && slides.length > 1) {
        autoPlayRef.current = setInterval(() => {
          handleNext();
        }, interval);
      }
    }, [autoPlay, interval, slides.length]);

    const stopAutoPlay = React.useCallback(() => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }, []);

    React.useEffect(() => {
      if (isPlaying) {
        startAutoPlay();
      }
      return () => stopAutoPlay();
    }, [isPlaying, startAutoPlay, stopAutoPlay]);

    const handlePrevious = () => {
      setCurrentSlide((prev) => {
        const newIndex = prev === 0 ? slides.length - 1 : prev - 1;
        onSlideChange?.(newIndex);
        return newIndex;
      });
    };

    const handleNext = () => {
      setCurrentSlide((prev) => {
        const newIndex = prev === slides.length - 1 ? 0 : prev + 1;
        onSlideChange?.(newIndex);
        return newIndex;
      });
    };

    const handleIndicatorClick = (index: number) => {
      setCurrentSlide(index);
      onSlideChange?.(index);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      setTouchStart(e.targetTouches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientY);
    };

    const handleTouchEnd = () => {
      if (touchStart - touchEnd > 50) {
        handleNext();
      }
      if (touchStart - touchEnd < -50) {
        handlePrevious();
      }
    };

    const handleMouseEnter = () => {
      if (pauseOnHover) {
        setIsPlaying(false);
      }
    };

    const handleMouseLeave = () => {
      if (pauseOnHover && autoPlay) {
        setIsPlaying(true);
      }
    };

    if (!slides.length) return null;

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        style={{ height }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {/* Slides */}
        <div
          className="h-full transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateY(-${currentSlide * (100 + slideSpacing)}%)`,
            transitionDuration: `${transitionDuration}ms`,
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="h-full w-full"
              style={{
                marginBottom: `${slideSpacing}%`,
                opacity: animation === "fade" ? (index === currentSlide ? 1 : 0) : 1,
                transition: `opacity ${transitionDuration}ms ease-in-out`,
              }}
            >
              {slide}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {showArrows && slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground"
              aria-label="Previous slide"
            >
              <BiChevronUp className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground"
              aria-label="Next slide"
            >
              <BiChevronDown className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Indicators */}
        {showIndicators && slides.length > 1 && (
          <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleIndicatorClick(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  index === currentSlide
                    ? "h-4 bg-primary"
                    : "bg-primary/50 hover:bg-primary/75"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

VerticalCarousel.displayName = "VerticalCarousel";

export { VerticalCarousel, type VerticalCarouselProps };

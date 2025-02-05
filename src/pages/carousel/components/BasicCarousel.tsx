import * as React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "../../../utils/cn";


interface BasicCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showIndicators?: boolean;
  pauseOnHover?: boolean;
  loop?: boolean;
  animation?: "slide" | "fade";
  transitionDuration?: number;
  onSlideChange?: (index: number) => void;
}

const BasicCarousel = React.forwardRef<HTMLDivElement, BasicCarouselProps>(
  (
    {
      slides = [],
      autoPlay = true,
      interval = 5000,
      showArrows = true,
      showIndicators = true,
      pauseOnHover = true,
      loop = true,
      animation = "slide",
      transitionDuration = 300,
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
    const autoPlayRef = React.useRef<number>();

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
      setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {/* Slides */}
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            transitionDuration: `${transitionDuration}ms`,
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-full shrink-0"
              style={{
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
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground"
              aria-label="Previous slide"
            >
              <FiChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground"
              aria-label="Next slide"
            >
              <FiChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Indicators */}
        {showIndicators && slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleIndicatorClick(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  index === currentSlide
                    ? "w-4 bg-primary"
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

BasicCarousel.displayName = "BasicCarousel";

export { BasicCarousel, type BasicCarouselProps };

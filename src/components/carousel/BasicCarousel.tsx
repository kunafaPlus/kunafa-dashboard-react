import * as React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "../../utils/cn";
import { useCarousel } from "./hooks/useCarousel";
import { BasicCarouselProps } from "./types";



const BasicCarousel = React.forwardRef<HTMLDivElement, BasicCarouselProps>(
  (
    {
      slides = [],
      autoPlay = true,
      interval = 5000,
      showArrows = true,
      showIndicators = true,
      pauseOnHover = true,
      animation = "slide",
      transitionDuration = 300,
      onSlideChange,
      className,
      ...props
    },
    ref
  ) => {
    const { currentSlide, handlePrevious, handleNext, setIsPlaying ,setCurrentSlide} = useCarousel(slides, autoPlay, interval, 1, 1, true,true, onSlideChange);
    const [touchStart, setTouchStart] = React.useState(0);
    const [touchEnd, setTouchEnd] = React.useState(0);

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

    if (!slides.length) return null
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
                onClick={() => {
                  setCurrentSlide(index);
                  onSlideChange?.(index);
                }}
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
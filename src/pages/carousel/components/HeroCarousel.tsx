import * as React from "react";
import { cn } from "../../../utils/cn";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface HeroSlide {
  image: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  textColor?: string;
  textAlignment?: "left" | "center" | "right";
}

interface HeroCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: HeroSlide[];
  height?: string | number;
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showIndicators?: boolean;
  pauseOnHover?: boolean;
  animation?: "fade" | "slide";
  transitionDuration?: number;
  onSlideChange?: (index: number) => void;
}

const HeroCarousel = React.forwardRef<HTMLDivElement, HeroCarouselProps>(
  (
    {
      slides = [],
      height = "600px",
      autoPlay = true,
      interval = 5000,
      showArrows = true,
      showIndicators = true,
      pauseOnHover = true,
      animation = "fade",
      transitionDuration = 500,
      onSlideChange,
      className,
      ...props
    },
    ref
  ) => {
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);
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
        {...props}
      >
        {/* Slides */}
        <div
          className={cn(
            "relative h-full w-full",
            animation === "slide" && "flex transition-transform duration-500"
          )}
          style={
            animation === "slide"
              ? {
                  transform: `translateX(-${currentSlide * 100}%)`,
                  transitionDuration: `${transitionDuration}ms`,
                }
              : undefined
          }
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 h-full w-full",
                animation === "slide" && "relative shrink-0"
              )}
              style={{
                opacity:
                  animation === "fade"
                    ? index === currentSlide
                      ? 1
                      : 0
                    : 1,
                transition: `opacity ${transitionDuration}ms ease-in-out`,
              }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              {/* Overlay */}
              {slide.overlay && (
                <div
                  className="absolute inset-0 bg-black"
                  style={{
                    opacity: slide.overlayOpacity || 0.5,
                  }}
                />
              )}

              {/* Content */}
              <div
                className={cn(
                  "relative flex h-full items-center p-8",
                  slide.textAlignment === "center" && "justify-center text-center",
                  slide.textAlignment === "right" && "justify-end text-right"
                )}
              >
                <div
                  className="max-w-2xl"
                  style={{ color: slide.textColor || "white" }}
                >
                  {slide.title && (
                    <h2 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
                      {slide.title}
                    </h2>
                  )}
                  {slide.description && (
                    <p className="mb-6 text-lg md:text-xl">
                      {slide.description}
                    </p>
                  )}
                  {slide.ctaLabel && slide.ctaUrl && (
                    <a
                      href={slide.ctaUrl}
                      className="inline-block rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      {slide.ctaLabel}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {showArrows && slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-3 text-foreground/80 shadow-sm backdrop-blur-sm transition-all hover:bg-background hover:text-foreground"
              aria-label="Previous slide"
            >
              <BiChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-3 text-foreground/80 shadow-sm backdrop-blur-sm transition-all hover:bg-background hover:text-foreground"
              aria-label="Next slide"
            >
              <BiChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Indicators */}
        {showIndicators && slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleIndicatorClick(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  index === currentSlide
                    ? "w-8 bg-primary"
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

HeroCarousel.displayName = "HeroCarousel";

export { HeroCarousel, type HeroCarouselProps, type HeroSlide };

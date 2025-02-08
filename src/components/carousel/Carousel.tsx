import * as React from "react";
import { cn } from "../../utils/cn";
import { CarouselProps } from "./types";
import { carouselVariants, navigationButtonVariants } from "./variants";


const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      className,
      children,
      size,
      variant,
      autoPlay = false,
      interval = 3000,
      showArrows = true,
      showDots = true,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);
    const itemsArray = React.Children.toArray(children);
    const totalItems = itemsArray.length;

    React.useEffect(() => {
      let timer: number;
      if (autoPlay && !isHovered && totalItems > 0) {
        timer = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % totalItems);
        }, interval);
      }
      return () => clearInterval(timer);
    }, [autoPlay, interval, totalItems, isHovered]);

    const goToSlide = (index: number) => {
      setCurrentIndex(index);
    };

    const goToPrevious = () => {
      setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    };

    const goToNext = () => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    };

    return (
      <div
        ref={ref}
        className={cn(carouselVariants({ size, variant }), className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${totalItems * 100}%`,
          }}
        >
          {React.Children.map(children, (child) => (
            <div className="relative w-full flex-shrink-0">{child}</div>
          ))}
        </div>

        {showArrows && (
          <>
            <button
              onClick={goToPrevious}
              className={navigationButtonVariants({               position: "left" })}
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              onClick={goToNext}
              className={navigationButtonVariants({ position: "right" })}
              aria-label="Next slide"
            >
              →
            </button>
          </>
        )}

        {showDots && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
            {Array.from({ length: totalItems }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  index === currentIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75"
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

Carousel.displayName = "Carousel";

export { Carousel, carouselVariants };
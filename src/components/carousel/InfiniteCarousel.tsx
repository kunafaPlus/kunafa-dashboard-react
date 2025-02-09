import * as React from "react";
import { cn } from "../../utils/cn";
import { BiPlay } from "react-icons/bi";
import { BsPause } from "react-icons/bs";
import { useCarousel } from "./hooks/useCarousel";
import { InfiniteCarouselProps } from "./types";



const InfiniteCarousel = React.forwardRef<HTMLDivElement, InfiniteCarouselProps>(
  (
    {
      slides = [],
      autoPlay = true,
      interval = 3000,
      slidesToShow = 4,
      slidesToScroll = 1,
      loop = true,
      pauseOnHover = true,
      gap = 16,
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
      handleMouseEnter,
      handleMouseLeave,
      setIsPlaying,
    } = useCarousel(
      slides,
      autoPlay,
      interval,
      slidesToShow,
      slidesToScroll,
      loop,
      pauseOnHover
    );

    const [containerWidth, setContainerWidth] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const itemWidth = (containerWidth - gap * (slidesToShow - 1)) / slidesToShow;

    // Update container width on resize
    React.useEffect(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }, [slidesToShow]);

    if (!slides.length) return null;

    // Double the slides for seamless loop
    const allSlides = [...slides, ...slides];

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Controls */}
        <button
          type="button"
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
        >
          {/* Add your left arrow icon here */}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
        >
          {/* Add your right arrow icon here */}
        </button>

        {/* Content */}
        <div ref={containerRef} className="relative">
          <div
            className="flex transition-transform"
            style={{ transform: `translateX(-${currentSlide * itemWidth}px)`, gap: `${gap}px` }}
          >
            {allSlides.map((slide, index) => (
              <div
                key={index}
                className="shrink-0"
                style={{ width: itemWidth }}
              >
                {slide}
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
      </div>
    );
  }
);

InfiniteCarousel.displayName = "InfiniteCarousel";

export { InfiniteCarousel, type InfiniteCarouselProps };
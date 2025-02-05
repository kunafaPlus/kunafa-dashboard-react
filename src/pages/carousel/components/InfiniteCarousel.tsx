import * as React from "react";
import { cn } from "../../../utils/cn";
import { BiPlay } from "react-icons/bi";
import { BsPause } from "react-icons/bs";

interface InfiniteCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: React.ReactNode[];
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  showControls?: boolean;
  gap?: number;
  slidesToShow?: number;
  responsive?: {
    [key: number]: {
      slidesToShow: number;
    };
  };
}

const InfiniteCarousel = React.forwardRef<HTMLDivElement, InfiniteCarouselProps>(
  (
    {
      slides = [],
      speed = 50,
      direction = "left",
      pauseOnHover = true,
      showControls = true,
      gap = 16,
      slidesToShow = 4,
      responsive = {
        640: { slidesToShow: 2 },
        768: { slidesToShow: 3 },
        1024: { slidesToShow: 4 },
      },
      className,
      ...props
    },
    ref
  ) => {
    const [isPaused, setIsPaused] = React.useState(false);
    const [containerWidth, setContainerWidth] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [currentSlidesToShow, setCurrentSlidesToShow] = React.useState(slidesToShow);

    // Update responsive settings
    React.useEffect(() => {
      const handleResize = () => {
        if (typeof window === "undefined") return;

        const windowWidth = window.innerWidth;
        const breakpoints = Object.keys(responsive)
          .map(Number)
          .sort((a, b) => a - b);

        let newSlidesToShow = slidesToShow;
        for (let i = 0; i < breakpoints.length; i++) {
          if (windowWidth <= breakpoints[i]) {
            newSlidesToShow = responsive[breakpoints[i]].slidesToShow;
            break;
          }
        }

        setCurrentSlidesToShow(newSlidesToShow);
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth);
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [responsive, slidesToShow]);

    // Animation
    React.useEffect(() => {
      if (!contentRef.current || isPaused) return;

      const content = contentRef.current;
      const scrollWidth = content.scrollWidth;
      const viewWidth = content.offsetWidth;
      let distance = 0;

      const animate = () => {
        if (isPaused || !content) return;

        distance += speed / 60;
        if (distance >= scrollWidth / 2) {
          distance = 0;
        }

        content.style.transform = `translateX(${
          direction === "left" ? -distance : distance
        }px)`;
        requestAnimationFrame(animate);
      };

      const animation = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animation);
    }, [speed, direction, isPaused]);

    // Calculate item width
    const getItemWidth = () => {
      const totalGap = gap * (currentSlidesToShow - 1);
      return (containerWidth - totalGap) / currentSlidesToShow;
    };

    const togglePause = () => {
      setIsPaused(!isPaused);
    };

    const handleMouseEnter = () => {
      if (pauseOnHover) {
        setIsPaused(true);
      }
    };

    const handleMouseLeave = () => {
      if (pauseOnHover) {
        setIsPaused(false);
      }
    };

    if (!slides.length) return null;

    // Double the slides for seamless loop
    const allSlides = [...slides, ...slides];
    const itemWidth = getItemWidth();

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Controls */}
        {showControls && (
          <button
            type="button"
            onClick={togglePause}
            className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground"
          >
            {isPaused ? (
              <BiPlay className="h-4 w-4" />
            ) : (
              <BsPause className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Content */}
        <div ref={containerRef} className="relative">
          <div
            ref={contentRef}
            className="flex transition-transform"
            style={{ gap: `${gap}px` }}
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

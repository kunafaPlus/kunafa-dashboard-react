import * as React from "react";
import { cn } from "../../utils/cn";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCarousel } from "./hooks/useCarousel";
import { CardCarouselProps } from "./types";


const CardCarousel = React.forwardRef<HTMLDivElement, CardCarouselProps>(
  (
    {
      cards = [],
      slidesToShow = 3,
      slidesToScroll = 1,
      autoPlay = false,
      interval = 3000,
      showArrows = true,
      spacing = 16,
      centerMode = false,
      loop = true,
      breakpoints = {
        640: { slidesToShow: 1, slidesToScroll: 1 },
        768: { slidesToShow: 2, slidesToScroll: 1 },
        1024: { slidesToShow: 3, slidesToScroll: 1 },
      },
      onSlideChange,
      className,
      ...props
    },
    ref
  ) => {
    const [containerWidth, setContainerWidth] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Calculate responsive settings
    const getResponsiveSettings = () => {
      if (typeof window === "undefined") return { slidesToShow, slidesToScroll, spacing };

      const windowWidth = window.innerWidth;
      const breakpointWidths = Object.keys(breakpoints)
        .map(Number)
        .sort((a, b) => a - b);

      for (let i = breakpointWidths.length - 1; i >= 0; i--) {
        if (windowWidth >= breakpointWidths[i]) {
          return {
            slidesToShow: breakpoints[breakpointWidths[i]].slidesToShow ?? slidesToShow,
            slidesToScroll: breakpoints[breakpointWidths[i]].slidesToScroll ?? slidesToScroll,
            spacing: breakpoints[breakpointWidths[i]].spacing ?? spacing,
          };
        }
      }

      return { slidesToShow, slidesToScroll, spacing };
    };

    const settings = getResponsiveSettings();
    const { currentSlide, handlePrevious, handleNext, setIsPlaying } = useCarousel(
      cards,
      autoPlay,
      interval,
      settings.slidesToShow,
      settings.slidesToScroll,
      loop,
      showArrows,
      onSlideChange
    );

    // Update container width on resize
    React.useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth);
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    const getCardWidth = () => {
      const totalSpacing = settings.spacing * (settings.slidesToShow - 1);
      return (containerWidth - totalSpacing) / settings.slidesToShow;
    };

    if (!cards.length) return null;

    const cardWidth = getCardWidth();
    const translateX = -(currentSlide * (cardWidth + settings.spacing));

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {/* Cards Container */}
        <div ref={containerRef} className="relative">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(${translateX}px)`,
              gap: `${settings.spacing}px`,
            }}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className="shrink-0"
                style={{
                  width: cardWidth,
                }}
              >
                {card}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {showArrows && cards.length > settings.slidesToShow && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              disabled={!loop && currentSlide <= 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground disabled:opacity-50"
              aria-label="Previous slide"
            >
              <FiChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!loop && currentSlide >= cards.length - settings.slidesToShow}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground disabled:opacity-50"
              aria-label="Next slide"
            >
              <FiChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    );
  }
);

CardCarousel.displayName = "CardCarousel";

export { CardCarousel, type CardCarouselProps };
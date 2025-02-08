import * as React from "react";
import { cn } from "../../utils/cn";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { useCarousel } from "./hooks/useCarousel"; // تأكد من المسار الصحيح
import { TimelineCarouselProps,TimelineEvent } from "./types";


const TimelineCarousel = React.forwardRef<HTMLDivElement, TimelineCarouselProps>(
  (
    {
      events = [],
      visibleEvents = 3,
      autoPlay = false,
      interval = 5000,
      showArrows = true,
      showProgress = true,
      orientation = "horizontal",
      animation = "slide",
      transitionDuration = 300,
      onEventChange,
      className,
      ...props
    },
    ref
  ) => {
    const {
      currentSlide,
      handlePrevious,
      handleNext,
      setIsPlaying,
    } = useCarousel(
      events,
      autoPlay,
      interval,
      visibleEvents,
      1, // slidesToScroll
      true, // loop
      true // pauseOnHover
    );

    const formatDate = (date: string | Date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    if (!events.length) return null;

    const isVertical = orientation === "vertical";

    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          isVertical ? "h-[600px]" : "w-full",
          className
        )}
        {...props}
      >
        {/* Events Container */}
        <div
          className={cn(
            "relative transition-transform duration-300",
            isVertical ? "h-full" : "w-full"
          )}
        >
          <div
            className={cn(
              "flex transition-transform",
              isVertical ? "flex-col" : "flex-row",
              animation === "slide" && "duration-300 ease-in-out"
            )}
            style={{
              transform: isVertical
                ? `translateY(-${(currentSlide * 100) / visibleEvents}%)`
                : `translateX(-${(currentSlide * 100) / visibleEvents}%)`,
              gap: "2rem",
            }}
          >
            {events.map((event, index) => (
              <div
                key={event.id}
                className={cn(
                  "relative flex shrink-0",
                  isVertical ? "h-[200px]" : "w-[300px]",
                  animation === "fade" &&
                    "transition-opacity duration-300 ease-in-out",
                  index < currentSlide ||
                    index >= currentSlide + visibleEvents
                    ? "opacity-0"
                    : "opacity-100"
                )}
              >
                {/* Event Dot */}
                <div
                  className={cn(
                    "absolute rounded-full p-2",
                    isVertical ? "left-0 top-0" : "left-0 top-1/2 -translate-y-1/2"
                  )}
                  style={{
                    backgroundColor: event.color || "var(--primary)",
                  }}
                >
                  {event.icon}
                </div>

                {/* Event Content */}
                <div
                  className={cn(
                    "flex flex-col rounded-lg border bg-card p-4 shadow-sm",
                    isVertical ? "ml-8" : "ml-8 mt-8"
                  )}
                >
                  <time className="text-sm text-muted-foreground">
                    {formatDate(event.date)}
                  </time>
                  <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>
                  {event.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  )}
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="mt-4 h-32 w-full rounded-md object-cover"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {showArrows && events.length > visibleEvents && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              className={cn(
                "absolute rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground disabled:opacity-50",
                isVertical
                  ? "left-1/2 top-4 -translate-x-1/2 rotate-90"
                  : "left-4 top-1/2 -translate-y-1/2"
              )}
            >
              <BiChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentSlide >= events.length - visibleEvents}
              className={cn(
                "absolute rounded-full bg-background/80 p-2 text-foreground/80 shadow-sm hover:bg-background hover:text-foreground disabled:opacity-50",
                isVertical
                  ? "bottom-4 left-1/2 -translate-x-1/2 rotate-90"
                  : "right-4 top-1/2 -translate-y-1/2"
              )}
            >
              <BiChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    );
  }
);

TimelineCarousel.displayName = "TimelineCarousel";

export { TimelineCarousel, type TimelineCarouselProps, type TimelineEvent };
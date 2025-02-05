import * as React from "react";
import { cn } from "../../../utils/cn";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";


interface TimelineEvent {
  id: string | number;
  date: string | Date;
  title: string;
  description?: string;
  image?: string;
  icon?: React.ReactNode;
  color?: string;
}

interface TimelineCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  events: TimelineEvent[];
  visibleEvents?: number;
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showProgress?: boolean;
  orientation?: "horizontal" | "vertical";
  animation?: "slide" | "fade";
  transitionDuration?: number;
  onEventChange?: (index: number) => void;
}

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
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);
    const autoPlayRef = React.useRef<NodeJS.Timeout>();

    const startAutoPlay = React.useCallback(() => {
      if (autoPlay && events.length > visibleEvents) {
        autoPlayRef.current = setInterval(() => {
          handleNext();
        }, interval);
      }
    }, [autoPlay, interval, events.length, visibleEvents]);

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
      setCurrentIndex((prev) => {
        const newIndex = Math.max(0, prev - 1);
        onEventChange?.(newIndex);
        return newIndex;
      });
    };

    const handleNext = () => {
      setCurrentIndex((prev) => {
        const newIndex = Math.min(events.length - visibleEvents, prev + 1);
        onEventChange?.(newIndex);
        return newIndex;
      });
    };

    const formatDate = (date: string | Date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const getProgressPercentage = () => {
      return ((currentIndex + visibleEvents) / events.length) * 100;
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
        {/* Progress Bar */}
        {showProgress && (
          <div
            className={cn(
              "absolute bg-muted",
              isVertical
                ? "left-[15px] top-0 h-full w-0.5"
                : "bottom-0 left-0 h-0.5 w-full"
            )}
          >
            <div
              className="absolute bg-primary transition-all duration-300"
              style={{
                ...(isVertical
                  ? {
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${getProgressPercentage()}%`,
                    }
                  : {
                      bottom: 0,
                      left: 0,
                      height: "100%",
                      width: `${getProgressPercentage()}%`,
                    }),
              }}
            />
          </div>
        )}

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
                ? `translateY(-${(currentIndex * 100) / visibleEvents}%)`
                : `translateX(-${(currentIndex * 100) / visibleEvents}%)`,
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
                  index < currentIndex ||
                    index >= currentIndex + visibleEvents
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
              disabled={currentIndex === 0}
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
              disabled={currentIndex >= events.length - visibleEvents}
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

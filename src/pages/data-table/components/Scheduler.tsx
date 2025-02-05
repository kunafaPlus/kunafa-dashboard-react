import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const schedulerVariants = cva(
  "w-full overflow-auto border rounded-lg bg-background",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-2",
        ghost: "bg-muted/50 border-none",
      },
      size: {
        sm: "min-h-[400px]",
        md: "min-h-[600px]",
        lg: "min-h-[800px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface SchedulerEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId?: string;
  color?: string;
  description?: string;
  status?: "confirmed" | "tentative" | "cancelled";
}

interface Resource {
  id: string;
  title: string;
  avatar?: string;
  capacity?: number;
}

interface SchedulerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof schedulerVariants> {
  events: SchedulerEvent[];
  resources?: Resource[];
  view?: "day" | "week" | "month" | "timeline";
  date?: Date;
  minTime?: number;
  maxTime?: number;
  step?: number;
  onEventClick?: (event: SchedulerEvent) => void;
  onEventChange?: (event: SchedulerEvent, start: Date, end: Date) => void;
  onDateChange?: (date: Date) => void;
  onViewChange?: (view: "day" | "week" | "month" | "timeline") => void;
  readonly?: boolean;
}

const Scheduler = React.forwardRef<HTMLDivElement, SchedulerProps>(
  (
    {
      className,
      variant,
      size,
      events,
      resources = [],
      view = "week",
      date = new Date(),
      minTime = 0,
      maxTime = 24,
      step = 30,
      onEventClick,
      onEventChange,
      onDateChange,
      onViewChange,
      readonly = false,
      ...props
    },
    ref
  ) => {
    const [selectedDate, setSelectedDate] = React.useState(date);
    const [currentView, setCurrentView] = React.useState(view);

    const handleDateChange = (newDate: Date) => {
      setSelectedDate(newDate);
      onDateChange?.(newDate);
    };

    const handleViewChange = (
      newView: "day" | "week" | "month" | "timeline"
    ) => {
      setCurrentView(newView);
      onViewChange?.(newView);
    };

    const getDaysInView = () => {
      const days: Date[] = [];
      const start = new Date(selectedDate);

      switch (currentView) {
        case "day":
          days.push(new Date(start));
          break;
        case "week":
          start.setDate(start.getDate() - start.getDay());
          for (let i = 0; i < 7; i++) {
            days.push(new Date(start));
            start.setDate(start.getDate() + 1);
          }
          break;
        case "month":
          start.setDate(1);
          const month = start.getMonth();
          while (start.getMonth() === month) {
            days.push(new Date(start));
            start.setDate(start.getDate() + 1);
          }
          break;
      }
      return days;
    };

    const getTimeSlots = () => {
      const slots: string[] = [];
      for (let hour = minTime; hour < maxTime; hour++) {
        for (let minute = 0; minute < 60; minute += step) {
          slots.push(
            `${hour.toString().padStart(2, "0")}:${minute
              .toString()
              .padStart(2, "0")}`
          );
        }
      }
      return slots;
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    };

    const getEventStyle = (event: SchedulerEvent) => {
      const startHour =
        event.start.getHours() + event.start.getMinutes() / 60;
      const endHour = event.end.getHours() + event.end.getMinutes() / 60;
      const duration = endHour - startHour;

      return {
        top: `${((startHour - minTime) / (maxTime - minTime)) * 100}%`,
        height: `${(duration / (maxTime - minTime)) * 100}%`,
        backgroundColor: event.color || "var(--primary)",
      };
    };

    const getStatusColor = (status?: SchedulerEvent["status"]) => {
      switch (status) {
        case "confirmed":
          return "bg-green-500";
        case "tentative":
          return "bg-yellow-500";
        case "cancelled":
          return "bg-red-500";
        default:
          return "";
      }
    };

    return (
      <div
        ref={ref}
        className={cn(schedulerVariants({ variant, size }), className)}
        {...props}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() - 1);
                handleDateChange(newDate);
              }}
              className="p-2 hover:bg-accent rounded-md"
            >
              ←
            </button>
            <button
              onClick={() => handleDateChange(new Date())}
              className="p-2 hover:bg-accent rounded-md"
            >
              Today
            </button>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() + 1);
                handleDateChange(newDate);
              }}
              className="p-2 hover:bg-accent rounded-md"
            >
              →
            </button>
            <span className="text-lg font-medium">
              {selectedDate.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {(["day", "week", "month", "timeline"] as const).map((v) => (
              <button
                key={v}
                onClick={() => handleViewChange(v)}
                className={cn(
                  "px-3 py-1 rounded-md",
                  currentView === v
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex">
          {/* Time column */}
          <div className="sticky left-0 w-20 border-r bg-background">
            <div className="h-16 border-b" /> {/* Header spacer */}
            {getTimeSlots().map((time) => (
              <div
                key={time}
                className="h-16 border-b px-2 text-sm text-muted-foreground"
              >
                {time}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="flex-1">
            <div className="flex">
              {getDaysInView().map((day, index) => (
                <div
                  key={index}
                  className="flex-1 min-w-[200px] border-r"
                >
                  <div className="h-16 border-b p-2 sticky top-[73px] bg-background">
                    {formatDate(day)}
                  </div>
                  {/* Events */}
                  <div className="relative">
                    {getTimeSlots().map((_, index) => (
                      <div
                        key={index}
                        className="h-16 border-b border-dashed"
                      />
                    ))}
                    {events
                      .filter(
                        (event) =>
                          event.start.toDateString() ===
                          day.toDateString()
                      )
                      .map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "absolute left-1 right-1 rounded p-1 text-sm",
                            getStatusColor(event.status)
                          )}
                          style={getEventStyle(event)}
                          onClick={() => onEventClick?.(event)}
                        >
                          <div className="font-medium truncate">
                            {event.title}
                          </div>
                          <div className="text-xs opacity-75">
                            {event.start.toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Scheduler.displayName = "Scheduler";

export { Scheduler, type SchedulerEvent, type Resource };

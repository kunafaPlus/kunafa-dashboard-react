import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { ScheduleInputProps, TimeSlot ,Schedule} from "../utils/type";

export const scheduleInputVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "border rounded-lg",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
      },
      size: {
        sm: "p-2",
        md: "p-3",
        lg: "p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);


const DEFAULT_DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ScheduleInput = React.forwardRef<HTMLDivElement, ScheduleInputProps>(
  (
    {
      className,
      variant,
      size,
      value = {},
      onChange,
      minTime = "00:00",
      maxTime = "23:59",
      step = 30,
      format = "24",
      disabled = false,
      error,
      hint,
      dayLabels = DEFAULT_DAY_LABELS,
      allowMultipleSlots = true,
      allowOverlap = false,
      validateTimeSlot = () => true,
      onInvalidTimeSlot,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => containerRef.current!);

    const parseTime = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const formatTime = (minutes: number): string => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const period = format === "12" ? (hours >= 12 ? "PM" : "AM") : "";
      const formattedHours =
        format === "12"
          ? hours % 12 || 12
          : hours.toString().padStart(2, "0");
      return `${formattedHours}:${mins
        .toString()
        .padStart(2, "0")}${period}`;
    };

    const generateTimeOptions = () => {
      const options: string[] = [];
      const minMinutes = parseTime(minTime);
      const maxMinutes = parseTime(maxTime);

      for (
        let minutes = minMinutes;
        minutes <= maxMinutes;
        minutes += step
      ) {
        options.push(formatTime(minutes));
      }

      return options;
    };

    const timeOptions = React.useMemo(
      () => generateTimeOptions(),
      [minTime, maxTime, step, format]
    );

    const isOverlapping = (
      slots: TimeSlot[],
      newSlot: TimeSlot
    ): boolean => {
      return slots.some(
        (slot) =>
          slot.enabled &&
          parseTime(newSlot.start) < parseTime(slot.end) &&
          parseTime(newSlot.end) > parseTime(slot.start)
      );
    };

    const handleSlotChange = (
      day: number,
      index: number,
      changes: Partial<TimeSlot>
    ) => {
      if (disabled) return;

      const newSchedule = { ...value };
      const slots = [...(newSchedule[day] || [])];
      const newSlot = { ...slots[index], ...changes };

      if (!validateTimeSlot(newSlot)) {
        onInvalidTimeSlot?.(newSlot);
        return;
      }

      if (
        !allowOverlap &&
        changes.enabled &&
        isOverlapping(
          slots.filter((_, i) => i !== index),
          newSlot
        )
      ) {
        onInvalidTimeSlot?.(newSlot);
        return;
      }

      slots[index] = newSlot;
      newSchedule[day] = slots;
      onChange?.(newSchedule);
    };

    const addSlot = (day: number) => {
      if (disabled) return;

      const newSchedule = { ...value };
      const slots = [...(newSchedule[day] || [])];

      const newSlot: TimeSlot = {
        day,
        start: minTime,
        end: maxTime,
        enabled: true,
      };

      if (!validateTimeSlot(newSlot)) {
        onInvalidTimeSlot?.(newSlot);
        return;
      }

      if (!allowOverlap && isOverlapping(slots, newSlot)) {
        onInvalidTimeSlot?.(newSlot);
        return;
      }

      slots.push(newSlot);
      newSchedule[day] = slots;
      onChange?.(newSchedule);
    };

    const removeSlot = (day: number, index: number) => {
      if (disabled) return;

      const newSchedule = { ...value };
      const slots = [...(newSchedule[day] || [])];
      slots.splice(index, 1);
      newSchedule[day] = slots;
      onChange?.(newSchedule);
    };

    const copyToAllDays = (sourceDay: number) => {
      if (disabled) return;

      const sourceSlots = value[sourceDay] || [];
      const newSchedule = { ...value };

      dayLabels.forEach((_:any, day:number) => {
        if (day !== sourceDay) {
          newSchedule[day] = sourceSlots.map((slot:any) => ({
            ...slot,
            day,
          }));
        }
      });

      onChange?.(newSchedule);
    };

    return (
      <div
        ref={containerRef}
        className={cn(scheduleInputVariants({ variant, size }as{}), className)}
        {...props}
      >
        <div className="space-y-4">
          {dayLabels.map((label:string, day:number) => (
            <div key={day} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{label}</div>
                <div className="flex items-center gap-2">
                  {allowMultipleSlots && (
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => addSlot(day)}
                      disabled={disabled}
                    >
                      Add Time Slot
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => copyToAllDays(day)}
                    disabled={disabled}
                  >
                    Copy to All Days
                  </button>
                </div>
              </div>

              {(value[day] || []).map((slot:any, index:number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-2 bg-background rounded-md"
                >
                  <input
                    type="checkbox"
                    checked={slot.enabled}
                    onChange={(e) =>
                      handleSlotChange(day, index, {
                        enabled: e.target.checked,
                      })
                    }
                    disabled={disabled}
                    className="rounded"
                  />

                  <select
                    value={slot.start}
                    onChange={(e) =>
                      handleSlotChange(day, index, {
                        start: e.target.value,
                      })
                    }
                    disabled={disabled || !slot.enabled}
                    className="bg-transparent border rounded-md"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>

                  <span className="text-muted-foreground">to</span>

                  <select
                    value={slot.end}
                    onChange={(e) =>
                      handleSlotChange(day, index, {
                        end: e.target.value,
                      })
                    }
                    disabled={disabled || !slot.enabled}
                    className="bg-transparent border rounded-md"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>

                  {(allowMultipleSlots ||
                    value[day]?.length > 1) && (
                    <button
                      type="button"
                      onClick={() => removeSlot(day, index)}
                      disabled={disabled}
                      className="p-1 text-destructive hover:bg-destructive/10 rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}

              {value[day]?.length === 0 && (
                <div className="p-2 text-sm text-muted-foreground">
                  No time slots added
                </div>
              )}
            </div>
          ))}
        </div>

        {(error || hint) && (
          <div
            className={cn(
              "mt-1 text-sm",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {error || hint}
          </div>
        )}
      </div>
    );
  }
);

ScheduleInput.displayName = "ScheduleInput";

export { ScheduleInput, type Schedule, type TimeSlot };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

// Calendar Component
const calendarVariants = cva(
  "p-3 space-y-4 bg-background rounded-lg shadow-sm ",
  {
    variants: {
      variant: {
        default: "",
        ghost: "shadow-none border-none",
      },
      size: {
        sm: "max-w-[280px]",
        md: "max-w-[320px]",
        lg: "max-w-[380px]",
        xl: "max-w-[440px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface CalendarProps
 {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  label: string;
  variant?: "default" | "bordered" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  className:string
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      className,
      variant,
      label,
      size,
      value,
      onChange,
      minDate,
      maxDate,
      disabledDates = [],
      ...props
    },
    ref
  ) => {
    const [currentDate, setCurrentDate] = React.useState(value || new Date());
    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();

    const handleDateSelect = (day: number) => {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      if (
        (minDate && newDate < minDate) ||
        (maxDate && newDate > maxDate) ||
        disabledDates.some(
          (disabledDate) =>
            disabledDate.toDateString() === newDate.toDateString()
        )
      ) {
        return;
      }

      setSelectedDate(newDate);
      onChange?.(newDate);
    };

    const handleMonthChange = (increment: number) => {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + increment,
          1
        )
      );
    };

    const isDateDisabled = (day: number) => {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      return (
        (minDate && date < minDate) ||
        (maxDate && date > maxDate) ||
        disabledDates.some(
          (disabledDate) =>
            disabledDate.toDateString() === date.toDateString()
        )
      );
    };

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div
        ref={ref}
        className={cn(calendarVariants({ variant, size } as any), className)}
        {...props}
      >
        <div className="flex rounded-xl items-center justify-between mb-4">
          <button
            onClick={() => handleMonthChange(-1)}
            className="p-1 hover:bg-accent rounded-sm"
          >
            ←
          </button>
          <h2 className="font-semibold">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            onClick={() => handleMonthChange(1)}
            className="p-1 hover:bg-accent rounded-sm"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
          {weekDays.map((day) => (
            <div key={day} className="p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="p-2" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const isSelected =
              selectedDate?.toDateString() ===
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              ).toDateString();
            const isDisabled = isDateDisabled(day);

            return (
              <button
                key={day}
                onClick={() => handleDateSelect(day)}
                disabled={isDisabled}
                className={cn(
                  "p-2 rounded-sm hover:bg-accent transition-colors",
                  isSelected && "bg-primary text-primary-foreground",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

Calendar.displayName = "Calendar";

// DatePicker Component
interface DatePickerProps  {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  variant?: "default" | "bordered" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  label: string;
  className: string;
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      className,
      label,
      value,
      onChange,
      minDate,
      maxDate,
      disabledDates,
      variant = "default",
      size = "md",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState(value);

    const handleDateChange = (date: Date) => {
      setSelectedDate(date);
      onChange?.(date);
      setIsOpen(false); // Close the calendar after selecting a date
    };

    const modalRef = React.useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    React.useEffect(() => {
      // Add event listener for clicks outside the component
      document.addEventListener("mousedown", handleClickOutside);
      // Cleanup event listener on unmount
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    React.useEffect(() => {
      setSelectedDate(value); // Update selected date when value prop changes
    }, [value]);

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "p-2 border border-input-border focus:border-input-focus rounded-md cursor-pointer hover:bg-accent",
            calendarVariants({ variant, size } as any)
          )}
        >
          {selectedDate ? selectedDate.toLocaleDateString() : "Select a date"}
        </div>

        {isOpen && (
          <div className="absolute z-50 bg-white shadow-xl mt-2" ref={modalRef}>
            <Calendar
              value={selectedDate}
              label={label}
              onChange={handleDateChange}
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={disabledDates}
              className={className} // Ensure className is passed
              variant={variant}
              size={size}
              {...props} // Correctly spread props here
            />
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const timeRangePickerVariants = cva('w-full', {
  variants: {
    variant: {
      default: '[&_input]:border [&_input]:rounded-md',
      filled: '[&_input]:bg-muted [&_input]:border-b',
      ghost: '[&_input]:bg-transparent [&_input]:border-b',
    },
    size: {
      sm: '[&_input]:text-sm [&_input]:p-2',
      md: '[&_input]:text-base [&_input]:p-3',
      lg: '[&_input]:text-lg [&_input]:p-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

interface TimeRange {
  start: string;
  end: string;
}

interface TimeRangePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'>,
    VariantProps<typeof timeRangePickerVariants> {
  value?: TimeRange;
  onChange?: (value: TimeRange) => void;
  minTime?: string;
  maxTime?: string;
  step?: number;
  format?: '12' | '24';
  showSeconds?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  startLabel?: string;
  endLabel?: string;
  validateRange?: (range: TimeRange) => boolean;
  onInvalidRange?: (range: TimeRange) => void;
}

const TimeRangePicker = React.forwardRef<HTMLDivElement, TimeRangePickerProps>(
  (
    {
      className,
      variant,
      size,
      value = { start: '', end: '' },
      onChange,
      minTime = '00:00',
      maxTime = '23:59',
      step = 30,
      format = '24',
      showSeconds = false,
      disabled = false,
      error,
      hint,
      startLabel = 'Start Time',
      endLabel = 'End Time',
      validateRange = (range) => range.start <= range.end,
      onInvalidRange,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const [activeInput, setActiveInput] = React.useState<'start' | 'end' | null>(null);

    React.useImperativeHandle(ref, () => containerRef.current!);

    const parseTime = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const formatTime = (minutes: number): string => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const period = format === '12' ? (hours >= 12 ? 'PM' : 'AM') : '';
      const formattedHours = format === '12' ? hours % 12 || 12 : hours.toString().padStart(2, '0');
      return `${formattedHours}:${mins.toString().padStart(2, '0')}${period}`;
    };

    const generateTimeOptions = () => {
      const options: string[] = [];
      const minMinutes = parseTime(minTime);
      const maxMinutes = parseTime(maxTime);

      for (let minutes = minMinutes; minutes <= maxMinutes; minutes += step) {
        options.push(formatTime(minutes));
      }

      return options;
    };

    const timeOptions = React.useMemo(
      () => generateTimeOptions(),
      [minTime, maxTime, step, format]
    );

    const handleTimeChange = (type: 'start' | 'end', newTime: string) => {
      if (disabled) return;

      const newRange = { ...value, [type]: newTime };

      if (validateRange(newRange)) {
        onChange?.(newRange);
      } else {
        onInvalidRange?.(newRange);
      }
    };

    const handleInputFocus = (type: 'start' | 'end') => {
      if (disabled) return;
      setActiveInput(type);
      setIsOpen(true);
    };

    const handleInputBlur = () => {
      setTimeout(() => {
        setIsOpen(false);
        setActiveInput(null);
      }, 200);
    };

    return (
      <div
        ref={containerRef}
        className={cn(timeRangePickerVariants({ variant, size }), className)}
        {...props}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">{startLabel}</label>
            <div className="relative">
              <input
                type="text"
                className={cn(
                  'w-full bg-transparent transition-colors outline-input-focus border-input-border disabled:opacity-50 disabled:cursor-not-allowed',
                  error && 'border-destructive focus:ring-destructive'
                )}
                value={value.start}
                onChange={(e) => { handleTimeChange('start', e.target.value); }}
                onFocus={() => { handleInputFocus('start'); }}
                onBlur={handleInputBlur}
                placeholder={format === '24' ? 'HH:MM' : 'HH:MM AM/PM'}
                disabled={disabled}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-muted-foreground"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">{endLabel}</label>
            <div className="relative">
              <input
                type="text"
                className={cn(
                  'w-full bg-transparent transition-colors outline-input-focus border-input-border disabled:opacity-50 disabled:cursor-not-allowed',
                  error && 'border-destructive focus:ring-destructive'
                )}
                value={value.end}
                onChange={(e) => { handleTimeChange('end', e.target.value); }}
                onFocus={() => { handleInputFocus('end'); }}
                onBlur={handleInputBlur}
                placeholder={format === '24' ? 'HH:MM' : 'HH:MM AM/PM'}
                disabled={disabled}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-muted-foreground"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-[200px] mt-1 bg-background border rounded-md shadow-lg max-h-[200px] overflow-auto">
            {timeOptions.map((time) => (
              <div
                key={time}
                className={cn(
                  'px-3 py-2 cursor-pointer hover:bg-accent',
                  (activeInput === 'start' && time === value.start) ||
                    (activeInput === 'end' && time === value.end)
                    ? 'bg-primary/10 text-primary'
                    : ''
                )}
                onMouseDown={() => {
                  if (activeInput) {
                    handleTimeChange(activeInput, time);
                  }
                }}
              >
                {time}
              </div>
            ))}
          </div>
        )}

        {(error || hint) && (
          <div className={cn('mt-1 text-sm', error ? 'text-destructive' : 'text-muted-foreground')}>
            {error || hint}
          </div>
        )}
      </div>
    );
  }
);

TimeRangePicker.displayName = 'TimeRangePicker';

export { TimeRangePicker, type TimeRange };

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const sliderVariants = cva('relative flex w-full touch-none select-none items-center', {
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col h-full',
    },
    size: {
      sm: '[--slider-height:0.5rem]',
      md: '[--slider-height:0.75rem]',
      lg: '[--slider-height:1rem]',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    size: 'md',
  },
});

const sliderTrackVariants = cva('relative grow rounded-full bg-secondary', {
  variants: {
    orientation: {
      horizontal: 'h-[--slider-height]',
      vertical: 'w-[--slider-height] h-full',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

const sliderRangeVariants = cva('absolute rounded-full bg-primary', {
  variants: {
    orientation: {
      horizontal: 'h-full',
      vertical: 'w-full',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

const sliderThumbVariants = cva(
  'block rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

interface SliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'>,
    VariantProps<typeof sliderVariants> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  showTooltip?: boolean;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      orientation,
      size,
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      disabled = false,
      showTooltip = false,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState(defaultValue);
    const [isDragging, setIsDragging] = React.useState(false);
    const [showTooltipValue, setShowTooltipValue] = React.useState(false);
    const trackRef = React.useRef<HTMLDivElement>(null);
    const thumbRef = React.useRef<HTMLDivElement>(null);

    const currentValue = controlledValue ?? value;

    const percentage = ((currentValue - min) / (max - min)) * 100;

    const handleUpdate = (event: MouseEvent | TouchEvent) => {
      if (disabled || !trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const clientPosition = 'touches' in event ? event.touches[0] : event;

      const position =
        orientation === 'horizontal'
          ? (clientPosition.clientX - rect.left) / rect.width
          : (rect.bottom - clientPosition.clientY) / rect.height;

      const newValue = Math.round((position * (max - min) + min) / step) * step;

      const clampedValue = Math.max(min, Math.min(max, newValue));

      setValue(clampedValue);
      onChange?.(clampedValue);
    };

    const handleMouseDown = (event: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return;
      setIsDragging(true);
      handleUpdate(event as any);
    };

    React.useEffect(() => {
      const handleMouseMove = (event: MouseEvent | TouchEvent) => {
        if (isDragging) {
          handleUpdate(event);
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleMouseMove);
        document.addEventListener('touchend', handleMouseUp);
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }, [isDragging]);

    return (
      <div ref={ref} className={cn(sliderVariants({ orientation, size }), className)} {...props}>
        <div
          ref={trackRef}
          className={sliderTrackVariants({ orientation })}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div
            className={sliderRangeVariants({ orientation })}
            style={{
              [orientation === 'horizontal' ? 'left' : 'bottom']: 0,
              [orientation === 'horizontal' ? 'width' : 'height']: `${percentage}%`,
            }}
          />
          <div
            ref={thumbRef}
            className={cn(
              sliderThumbVariants({ size }),
              'absolute cursor-pointer',
              disabled && 'cursor-not-allowed'
            )}
            style={{
              [orientation === 'horizontal' ? 'left' : 'bottom']: `${percentage}%`,
              [orientation === 'horizontal' ? 'top' : 'left']: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => { setShowTooltipValue(true); }}
            onMouseLeave={() => { setShowTooltipValue(false); }}
          >
            {showTooltip && showTooltipValue && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-primary text-white text-xs rounded shadow">
                {currentValue}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider, sliderVariants };

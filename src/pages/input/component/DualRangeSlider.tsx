import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const dualRangeSliderVariants = cva(
  "relative w-full touch-none select-none",
  {
    variants: {
      variant: {
        default: "",
        filled: "[&_.slider-track]:bg-muted",
        ghost: "[&_.slider-track]:bg-transparent",
      },
      size: {
        sm: "h-4",
        md: "h-5",
        lg: "h-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface DualRangeSliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange">,
    VariantProps<typeof dualRangeSliderVariants> {
  value?: [number, number];
  onChange?: (e: { target: { value: [number, number] } }) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  error?: string;
  disabled?: boolean;
  formatValue?: (value: number) => string;
}

const DualRangeSlider = React.forwardRef<HTMLDivElement, DualRangeSliderProps>(
  ({ 
    className,
    variant,
    size,
    value = [0, 100],
    onChange,
    min = 0,
    max = 100,
    step = 1,
    label,
    error,
    disabled = false,
    formatValue = (value: number) => value.toString(),
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState<[number, number]>([
      Math.max(min, Math.min(max, value[0])),
      Math.max(min, Math.min(max, value[1]))
    ]);
    const sliderRef = React.useRef<HTMLDivElement>(null);
    const isDragging = React.useRef<number | null>(null);

    React.useEffect(() => {
      const newValue: [number, number] = [
        Math.max(min, Math.min(max, value[0])),
        Math.max(min, Math.min(max, value[1]))
      ];
      setInternalValue(newValue);
    }, [value, min, max]);

    const updateValue = (index: number, clientX: number) => {
      const sliderRect = sliderRef.current?.getBoundingClientRect();
      if (!sliderRect) return;

      const percent = Math.min(Math.max((clientX - sliderRect.left) / sliderRect.width, 0), 1);
      const rawValue = min + (max - min) * percent;
      const newValue = Math.round(rawValue / step) * step;

      const newValues: [number, number] = [...internalValue];
      newValues[index] = newValue;

      // Ensure the values are within bounds
      if ((index === 0 && newValue <= newValues[1]) || 
          (index === 1 && newValue >= newValues[0])) {
        setInternalValue(newValues);
        onChange?.({ target: { value: newValues } });
      }
    };

    const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      
      isDragging.current = index;
      updateValue(index, e.clientX);

      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging.current === null) return;
        e.preventDefault();
        updateValue(isDragging.current, e.clientX);
      };

      const handleMouseUp = () => {
        isDragging.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    return (
      <div ref={ref} className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative pt-2 pb-8">
          <div
            ref={sliderRef}
            className={cn(
              "relative h-2 w-full",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            <div className="absolute inset-0 bg-[#e5e7eb] rounded" />
            <div
              className="absolute inset-y-0 bg-[#2563eb] rounded"
              style={{
                left: `${((internalValue[0] - min) / (max - min)) * 100}%`,
                right: `${100 - ((internalValue[1] - min) / (max - min)) * 100}%`
              }}
            />
            {[0, 1].map((index) => (
              <div
                key={index}
                className={cn(
                  "absolute top-1/2 -mt-2 -ml-2 w-4 h-4 rounded-full bg-white border-2 border-[#2563eb]",
                  isDragging.current === index ? "cursor-grabbing" : "cursor-grab",
                  "hover:scale-110 transition-transform",
                  disabled && "cursor-not-allowed"
                )}
                style={{
                  left: `${((internalValue[index] - min) / (max - min)) * 100}%`
                }}
                onMouseDown={handleMouseDown(index)}
              />
            ))}
          </div>
          <div className="absolute w-full bottom-0 flex justify-between text-sm text-gray-600">
            <span>{formatValue(internalValue[0])}</span>
            <span>{formatValue(internalValue[1])}</span>
          </div>
        </div>
        {error && (
          <div className="mt-1 text-sm text-red-500 text-center">
            {error}
          </div>
        )}
      </div>
    );
  }
);

DualRangeSlider.displayName = "DualRangeSlider";

export { DualRangeSlider };
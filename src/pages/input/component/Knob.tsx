import * as React from "react";
import { cn } from "../../../utils/cn";

interface KnobProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange"> {
  value?: number;
  onChange?: (event: { target: { value: number } }) => void;
  min?: number;
  max?: number;
  step?: number;
  knobSize?: number;
  label?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  showValue?: boolean;
  valueFormat?: (value: number) => string;
}

const Knob = React.forwardRef<HTMLDivElement, KnobProps>(
  ({ 
    className,
    value = 0,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    knobSize = 100,
    label,
    error,
    disabled = false,
    readOnly = false,
    showValue = true,
    valueFormat = (v) => v.toString(),
    ...props
  }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [rotation, setRotation] = React.useState(valueToRotation(value));
    const knobRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      setRotation(valueToRotation(value));
    }, [value]);

    function valueToRotation(val: number): number {
      return ((val - min) / (max - min)) * 270 - 135;
    }

    function rotationToValue(rot: number): number {
      const normalizedRotation = rot + 135;
      const rawValue = ((normalizedRotation / 270) * (max - min)) + min;
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.min(Math.max(steppedValue, min), max);
    }

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled || readOnly) return;
      setIsDragging(true);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !knobRef.current) return;

      const knobRect = knobRef.current.getBoundingClientRect();
      const knobCenterX = knobRect.left + knobRect.width / 2;
      const knobCenterY = knobRect.top + knobRect.height / 2;

      const angle = Math.atan2(
        e.clientY - knobCenterY,
        e.clientX - knobCenterX
      ) * (180 / Math.PI);

      let newRotation = angle + 90;
      if (newRotation > 135) newRotation = 135;
      if (newRotation < -135) newRotation = -135;

      setRotation(newRotation);
      
      const newValue = rotationToValue(newRotation);
      if (onChange) {
        onChange({
          target: {
            value: newValue
          }
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    return (
      <div ref={ref} className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div
          ref={knobRef}
          className={cn(
            "relative rounded-full cursor-pointer select-none",
            disabled && "opacity-50 cursor-not-allowed",
            isDragging && "cursor-grabbing",
            className
          )}
          style={{ width: knobSize, height: knobSize }}
          onMouseDown={handleMouseDown}
          {...props}
        >
          <div
            className="absolute inset-0 rounded-full border-4 border-gray-200"
          />
          <div
            className="absolute top-1/2 left-1/2 w-1 h-1/2 bg-primary origin-top"
            style={{
              transform: `translate(-50%, 0) rotate(${rotation}deg)`
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 rounded-full bg-primary"
          />
          {showValue && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-sm">
              {valueFormat(value)}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Knob.displayName = "Knob";

export { Knob };

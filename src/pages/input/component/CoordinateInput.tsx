import * as React from "react";
import { cn } from "../../../utils/cn";



interface Coordinate {
  latitude: number;
  longitude: number;
}

interface CoordinateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: string;
  onChange?: (event: { target: { value: string } }) => void;
  label?: string;
  error?: string;
}

interface DMS {
  degrees: number;
  minutes: number;
  seconds: number;
  direction: "N" | "S" | "E" | "W";
}

const CoordinateInput = React.forwardRef<HTMLInputElement, CoordinateInputProps>(
  ({ className, value = "", onChange, label, error, ...props }, ref) => {
    const [latitude, longitude] = value.split(',').map(v => v.trim());

    const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const lat = e.target.value;
      if (onChange) {
        onChange({
          target: {
            value: `${lat},${longitude || ''}`
          }
        });
      }
    };

    const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const lng = e.target.value;
      if (onChange) {
        onChange({
          target: {
            value: `${latitude || ''},${lng}`
          }
        });
      }
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              ref={ref}
              type="number"
              value={latitude || ''}
              onChange={handleLatChange}
              placeholder="خط العرض"
              step="any"
              min="-90"
              max="90"
              className={cn(
                "w-full px-3 py-2 rounded-md border",
                error ? "border-red-500" : "border-gray-300",
                className
              )}
              {...props}
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              value={longitude || ''}
              onChange={handleLngChange}
              placeholder="خط الطول"
              step="any"
              min="-180"
              max="180"
              className={cn(
                "w-full px-3 py-2 rounded-md border",
                error ? "border-red-500" : "border-gray-300"
              )}
            />
          </div>
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

CoordinateInput.displayName = "CoordinateInput";

export { CoordinateInput, type Coordinate };

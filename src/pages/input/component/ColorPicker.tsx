import * as React from "react";
import { cva } from "class-variance-authority";
import { ColorPickerProps } from "../utils/type";
import { cn } from "../../../utils/cn";


const colorPickerVariants = cva("relative rounded-md border bg-background", {
  variants: {
    variant: {
      default: "",
      bordered: "border-2",
      ghost: "border-none shadow-none",
    },
    size: {
      sm: "w-48",
      md: "w-64",
      lg: "w-80",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});



export const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ className, value = "#000000", onChange, label, error, variant, size, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          <input
            ref={ref}
            type="color"
            value={value}
            onChange={handleChange}
            className={cn(
              "h-10 w-full cursor-pointer rounded border border-input",
              error&&"border-red-400",
              className,
              colorPickerVariants({ variant, size }) // Apply variants here
            )}
            {...props}
          />
          <div
            className="h-10 w-10 rounded border"
            style={{ backgroundColor: value }}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

ColorPicker.displayName = "ColorPicker";

export { colorPickerVariants };
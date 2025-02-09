import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { ColorPickerProps } from "./types/type";
import { cn } from "../../utils/cn";
import { colorPickerVariants } from "./variants";





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
              colorPickerVariants({ variant, size } as {variant:VariantProps<typeof colorPickerVariants>["variant"], size:VariantProps<typeof colorPickerVariants>["size"]}) // Apply variants here
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
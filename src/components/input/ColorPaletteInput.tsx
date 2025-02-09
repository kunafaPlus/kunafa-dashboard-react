import * as React from "react";
import {  extend } from "colord";
import harmoniesPlugin from "colord/plugins/harmonies";
import namesPlugin from "colord/plugins/names";
import { cn } from "../../utils/cn";
import { ColorPaletteInputProps } from "./types/type";

// Extend colord with plugins
extend([harmoniesPlugin, namesPlugin]);




const ColorPaletteInput = React.forwardRef<HTMLDivElement, ColorPaletteInputProps>(
  (
    {
      className,
      variant,
      size,
      value = "#000000",
      onChange,
      maxColors = 5,
      error,
      hint,
      showColorNames = true,
      showRgbValues = true,
      allowCustomColors = true,
      presetPalettes = [],
      label,
      ...props
    },
    ref
  ) => {
    const [baseColor, setBaseColor] = React.useState(value);

    const handleColorChange = (newColor: string) => {
      setBaseColor(newColor);
      if (onChange) {
        onChange({
          target: {
            value: newColor
          }
        });
      }
    };

    return (
      <div
        ref={ref}
        className={cn("space-y-4", className)}
        {...props}
      >
        {label && <label className="block mb-2">{label}</label>}
        <div className="space-y-1.5">
          <input
            type="color"
            value={value}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full h-10 rounded-md cursor-pointer"
          />
        </div>
        {(error || hint) && (
          <div
            className={cn(
              "text-sm",
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

ColorPaletteInput.displayName = "ColorPaletteInput";

export { ColorPaletteInput };

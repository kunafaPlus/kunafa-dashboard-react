import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {  extend } from "colord";
import harmoniesPlugin from "colord/plugins/harmonies";
import namesPlugin from "colord/plugins/names";
import { cn } from "../../../utils/cn";

// Extend colord with plugins
extend([harmoniesPlugin, namesPlugin]);

const colorPaletteInputVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "border rounded-lg",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
      },
      size: {
        sm: "p-2 gap-2",
        md: "p-3 gap-3",
        lg: "p-4 gap-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface Color {
  hex: string;
  rgb: string;
  name?: string;
}

interface Palette {
  colors: Color[];
  type: "custom" | "monochromatic" | "complementary" | "analogous" | "triadic" | "tetradic";
}

interface ColorPaletteInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange">,
    VariantProps<typeof colorPaletteInputVariants> {
  value?: string;
  onChange?: (event: { target: { value: string } }) => void;
  maxColors?: number;
  error?: string;
  hint?: string;
  showColorNames?: boolean;
  showRgbValues?: boolean;
  allowCustomColors?: boolean;
  presetPalettes?: Palette[];
  label?: string;
}


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

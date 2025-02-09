import * as React from "react";
import { cn } from "../../utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { HoverButtonProps } from "./types/index";

const hoverButtonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);



const getHoverEffect = (effect: 'scale' | 'glow' | 'lift' | 'color', scale?: number, color?: string) => {
  const effects = {
    scale: `hover:scale-${scale || 110}`,
    glow: `hover:shadow-[0_0_10px_${color || 'currentColor'}]`,
    lift: "hover:-translate-y-1",
    color: `hover:bg-${color || 'primary-dark'}`,
  };
  return effects[effect];
};

const HoverButton = React.forwardRef<HTMLButtonElement, HoverButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    tooltip,
    tooltipPosition = "top",
    tooltipDelay = 200,
    tooltipOffset = 8,
    onHoverStart,
    onHoverEnd,
    hoverEffect = "scale",
    hoverScale,
    hoverColor,
    children,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [showTooltip, setShowTooltip] = React.useState(false);
    const tooltipTimeoutRef = React.useRef<number>();

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(true);
      onHoverStart?.(e);

      if (tooltip) {
        tooltipTimeoutRef.current = window.setTimeout(() => {
          setShowTooltip(true);
        }, tooltipDelay);
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(false);
      onHoverEnd?.(e);

      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      setShowTooltip(false);
    };

    React.useEffect(() => {
      return () => {
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
        }
      };
    }, []);

    const getTooltipPosition = () => {
      switch (tooltipPosition) {
        case "top":
          return `bottom-full mb-${tooltipOffset}`;
        case "bottom":
          return `top-full mt-${tooltipOffset}`;
        case "left":
          return `right-full mr-${tooltipOffset} translate-y-[-50%] top-1/2`;
        case "right":
          return `left-full ml-${tooltipOffset} translate-y-[-50%] top-1/2`;
        default:
          return `bottom-full mb-${tooltipOffset}`;
      }
    };

    return (
      <div className="relative inline-block">
        <button
          ref={ref}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            hoverButtonVariants({ variant, size }),
            "transition-all duration-200",
            isHovered && getHoverEffect(hoverEffect, hoverScale, hoverColor),
            className
          )}
          {...props}
        >
          {children}
        </button>

        {showTooltip && tooltip && (
          <div
            className={cn(
              "absolute z-50 whitespace-nowrap rounded-md bg-secondary px-2 py-1",
              "text-sm text-secondary-foreground shadow-md",
              "animate-in fade-in-0 zoom-in-95",
              getTooltipPosition()
            )}
          >
            {tooltip}
            <div
              className={cn(
                "absolute h-2 w-2 rotate-45 bg-secondary",
                {
                  "bottom-[-4px] left-1/2 -translate-x-1/2": tooltipPosition === "top",
                  "top-[-4px] left-1/2 -translate-x-1/2": tooltipPosition === "bottom",
                  "right-[-4px] top-1/2 -translate-y-1/2": tooltipPosition === "left",
                  "left-[-4px] top-1/2 -translate-y-1/2": tooltipPosition === "right",
                }
              )}
            />
          </div>
        )}
      </div>
    );
  }
);

HoverButton.displayName = "HoverButton";

export { HoverButton };

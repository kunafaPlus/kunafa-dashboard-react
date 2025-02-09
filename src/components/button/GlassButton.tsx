import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { GlassButtonProps } from "./types/index";

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    blurAmount = "md",
    backgroundColor = "bg-white/10",
    borderColor = "border-white/20",
    enableHover = true,
    hoverBackgroundColor = "bg-white/20",
    hoverBorderColor,
    frostEffect = false,
    children,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = React.useCallback(() => {
      setIsHovered(true);
    }, []);

    const handleMouseLeave = React.useCallback(() => {
      setIsHovered(false);
    }, []);

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          `backdrop-blur-${blurAmount}`,
          backgroundColor,
          "border",
          borderColor,
          "transition-all duration-300",
          {
            [hoverBackgroundColor]: enableHover && isHovered,
            [hoverBorderColor || ""]: enableHover && isHovered && hoverBorderColor,
            [`backdrop-blur-${
              blurAmount === "3xl" ? "3xl" : 
              blurAmount === "2xl" ? "3xl" : 
              blurAmount === "xl" ? "2xl" : 
              blurAmount === "lg" ? "xl" : 
              blurAmount === "md" ? "lg" : 
              blurAmount === "sm" ? "md" : "lg"
            }`]: frostEffect && isHovered,
          },
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";

export { GlassButton };

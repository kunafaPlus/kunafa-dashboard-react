import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { GradientButtonProps } from "./types/index";

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    gradientFrom = "from-primary", 
    gradientTo = "to-secondary",
    gradientDirection = "to-r",
    children,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          `bg-gradient-${gradientDirection}`,
          gradientFrom,
          gradientTo,
          "text-white hover:opacity-90 transition-opacity",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GradientButton.displayName = "GradientButton";

export { GradientButton };

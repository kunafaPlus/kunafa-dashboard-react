import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { FloatingButtonProps } from "./types/index";

const FloatingButton = React.forwardRef<HTMLButtonElement, FloatingButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    position = "bottom-right",
    offset = 16,
    icon,
    children,
    ...props 
  }, ref) => {
    const getPositionClasses = () => {
      switch (position) {
        case "top-left":
          return `top-${offset} left-${offset}`;
        case "top-right":
          return `top-${offset} right-${offset}`;
        case "bottom-left":
          return `bottom-${offset} left-${offset}`;
        case "bottom-right":
          return `bottom-${offset} right-${offset}`;
        default:
          return `bottom-${offset} right-${offset}`;
      }
    };

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          "fixed z-50 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl",
          "inline-flex items-center justify-center",
          getPositionClasses(),
          className
        )}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

FloatingButton.displayName = "FloatingButton";

export { FloatingButton };

import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { OutlineButtonProps } from "./types/index";

const OutlineButton = React.forwardRef<HTMLButtonElement, OutlineButtonProps>(
  ({ 
    className,
    variant = "outline",
    size = "default",
    outlineWidth = "2px",
    outlineOffset = "4px",
    outlineColor,
    outlineStyle = "solid",
    rounded = false,
    glowing = false,
    children,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          "relative transition-all duration-200",
          rounded && "rounded-full",
          glowing && "hover:shadow-lg hover:shadow-primary/50",
          "before:absolute before:inset-0 before:rounded-[inherit]",
          "before:border before:border-transparent",
          "hover:before:border-primary",
          className
        )}
        style={{
          '--outline-width': outlineWidth,
          '--outline-offset': outlineOffset,
          '--outline-color': outlineColor || 'currentColor',
          '--outline-style': outlineStyle,
        } as React.CSSProperties}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

OutlineButton.displayName = "OutlineButton";

export { OutlineButton };

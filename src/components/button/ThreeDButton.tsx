import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants, threeDButtonVariants } from "./variants";
import { ThreeDButtonProps } from "./types";

const ThreeDButton = React.forwardRef<HTMLButtonElement, ThreeDButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      depth = "medium",
      pressed = false,
      children,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = React.useState(pressed);

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(true);
      props.onMouseDown?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      props.onMouseUp?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      props.onMouseLeave?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          buttonVariants({ variant, size }),
          threeDButtonVariants({ depth, pressed: isPressed }as any),
          "transform transition-transform duration-100",
          className
        )}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ThreeDButton.displayName = "ThreeDButton";

export { ThreeDButton };

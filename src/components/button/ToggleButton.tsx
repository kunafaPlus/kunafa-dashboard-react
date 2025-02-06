import * as React from "react";
import { cn } from "../../utils/cn";
import { baseButtonVariants, toggleButtonVariants } from "./variants/index";
import { ToggleButtonProps } from "./types";

const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      className,
      variant = "outline",
      size = "default",
      pressed,
      defaultPressed = false,
      onPressedChange,
      children,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = React.useState(defaultPressed);
    const buttonPressed = pressed !== undefined ? pressed : isPressed;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      const newPressed = !buttonPressed;
      setIsPressed(newPressed);
      onPressedChange?.(newPressed);
      props.onClick?.(event);
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={buttonPressed}
        data-state={buttonPressed ? "on" : "off"}
        className={cn(
          baseButtonVariants({ variant, size }as any),
          toggleButtonVariants({ pressed: buttonPressed } as any),
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ToggleButton.displayName = "ToggleButton";

export { ToggleButton };

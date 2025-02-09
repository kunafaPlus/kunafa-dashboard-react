import * as React from "react";
import { cn } from "../../utils/cn";
import { ToggleProps } from "./types/type";
import { toggleVariants } from "./variants";

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    { className, variant, size, rounded, pressed, onPressedChange, iconOnly, children, ...props },
    ref
  ) => {
    const [isPressed, setIsPressed] = React.useState(pressed || false);

    // تحديث الحالة عند تغيير `pressed` من الخارج
    React.useEffect(() => {
      if (pressed !== undefined) {
        setIsPressed(pressed);
      }
    }, [pressed]);

    // تغيير الحالة عند النقر
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      const newPressed = !isPressed;
      setIsPressed(newPressed);
      onPressedChange?.(newPressed);
      props.onClick?.(event);
    };

    return (
      <button
        ref={ref}
        type="button"
        
        className={cn(
          toggleVariants({ variant, size, rounded, className }as{}),
          isPressed && "bg-accent text-accent-foreground shadow-inner",
          iconOnly && "p-0 aspect-square" // إذا كان الزر يحتوي على أيقونة فقط
        )}
        onClick={handleClick}
        // {...props}
      >
        {children}
      </button>
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
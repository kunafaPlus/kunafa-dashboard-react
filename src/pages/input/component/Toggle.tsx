import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { ToggleProps } from "../utils/type";

// تعريف أنماط Toggle
 const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-muted",
        primary: "bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md",
        ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-8 px-3 rounded-sm",
        default: "h-10 px-4 rounded-md",
        lg: "h-12 px-6 rounded-lg",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "md",
    },
  }
);

// تعريف Props للمكون


// مكون Toggle
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
        {...props}
      >
        {children}
      </button>
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
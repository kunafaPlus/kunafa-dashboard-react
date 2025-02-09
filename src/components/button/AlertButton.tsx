import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { AlertButtonProps } from "./types";

const AlertButton = React.forwardRef<HTMLButtonElement, AlertButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    confirmText = "Are you sure?",
    onConfirm,
    children,
    ...props 
  }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (window.confirm(confirmText)) {
        onConfirm?.(e);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={cn(
          buttonVariants({ variant, size }),
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AlertButton.displayName = "AlertButton";

export { AlertButton };
export default AlertButton;

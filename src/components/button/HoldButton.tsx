import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { HoldButtonProps } from "./types/index";
import { useHold } from "./hooks/useHold";

const HoldButton = React.forwardRef<HTMLButtonElement, HoldButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    holdDuration = 1000,
    onHoldStart,
    onHoldEnd,
    onHoldComplete,
    showProgress = true,
    children,
    ...props 
  }, ref) => {
    const { progress, isHolding, startHold, endHold } = useHold({
      duration: holdDuration,
      onHoldStart,
      onHoldEnd,
      onHoldComplete,
    });

    return (
      <div className="relative inline-flex flex-col items-center gap-2">
        <button
          ref={ref}
          className={cn(
            buttonVariants({ variant, size }),
            "transition-all duration-150",
            isHolding && "scale-95",
            className
          )}
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          {...props}
        >
          {children}
        </button>
        
        {showProgress && isHolding && (
          <div className="absolute -bottom-2 left-0 h-1 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    );
  }
);

HoldButton.displayName = "HoldButton";

export { HoldButton };

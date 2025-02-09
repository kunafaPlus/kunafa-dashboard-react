import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants, swipeButtonVariants } from "./variants";
import { SwipeButtonProps } from "./types";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

const SwipeButton = React.forwardRef<HTMLButtonElement, SwipeButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      onSwipeComplete,
      threshold = 0.5,
      direction = "right",
      swipeText = "Swipe to confirm",
      children,
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragProgress, setDragProgress] = React.useState(0);
    const buttonRef = React.useRef<any>(null);
    const startXRef = React.useRef(0);

    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
      setIsDragging(true);
      startXRef.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
      if (!isDragging || !buttonRef.current) return;

      const currentX = e.touches[0].clientX;
      const buttonWidth = buttonRef.current.offsetWidth;
      const dragDistance = direction === "right" 
        ? currentX - startXRef.current 
        : startXRef.current - currentX;
      
      const progress = Math.max(0, Math.min(1, dragDistance / buttonWidth));
      setDragProgress(progress);

      if (progress >= threshold) {
        setIsDragging(false);
        setDragProgress(0);
        onSwipeComplete?.();
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setDragProgress(0);
    };

    return (
      <button
        ref={(node) => {
          buttonRef.current  = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        type="button"
        className={cn(
          buttonVariants({ variant, size }),
          swipeButtonVariants({ direction }),
          "relative overflow-hidden touch-none select-none",
          className
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        <div
          className={cn(
            "absolute inset-0 flex items-center transition-transform",
            direction === "right" ? "justify-start" : "justify-end",
            isDragging && "transition-none"
          )}
          style={{
            transform: `translateX(${
              direction === "right"
                ? `${dragProgress * 100}%`
                : `-${dragProgress * 100}%`
            })`,
          }}
        >
          {direction === "right" ? (
            <BiChevronRight className="h-4 w-4" />
          ) : (
            <BiChevronLeft className="h-4 w-4" />
          )}
        </div>
        <span className="relative z-10">{swipeText}</span>
        {children}
      </button>
    );
  }
);

SwipeButton.displayName = "SwipeButton";

export { SwipeButton };

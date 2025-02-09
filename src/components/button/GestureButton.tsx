import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { GestureButtonProps } from "./types/index";

const GestureButton = React.forwardRef<HTMLButtonElement, GestureButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    gesture = "press",
    onGestureStart,
    onGestureEnd,
    onGestureChange,
    minDuration = 500,
    maxDuration,
    children,
    ...props 
  }, ref) => {
    const [isActive, setIsActive] = React.useState(false);
    const [gestureProgress, setGestureProgress] = React.useState(0);
    const timeoutRef = React.useRef<number>();
    const startTimeRef = React.useRef<number>(0);
    const touchStartPosRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const handleGestureStart = (x: number, y: number) => {
      setIsActive(true);
      startTimeRef.current = Date.now();
      touchStartPosRef.current = { x, y };
      onGestureStart?.();

      if (gesture === "press") {
        timeoutRef.current = window.setTimeout(() => {
          setIsActive(false);
          onGestureEnd?.();
        }, minDuration);
      }
    };

    const handleGestureEnd = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const duration = Date.now() - startTimeRef.current;
      if (duration >= minDuration && (!maxDuration || duration <= maxDuration)) {
        onGestureEnd?.();
      }

      setIsActive(false);
      setGestureProgress(0);
    };

    const handleGestureMove = (x: number, y: number) => {
      if (!isActive) return;

      const dx = x - touchStartPosRef.current.x;
      const dy = y - touchStartPosRef.current.y;

      switch (gesture) {
        case "swipe-right":
          if (dx > 0) {
            const progress = Math.min(dx / 100, 1);
            setGestureProgress(progress);
            onGestureChange?.(progress);
          }
          break;
        case "swipe-left":
          if (dx < 0) {
            const progress = Math.min(Math.abs(dx) / 100, 1);
            setGestureProgress(progress);
            onGestureChange?.(progress);
          }
          break;
        case "swipe-up":
          if (dy < 0) {
            const progress = Math.min(Math.abs(dy) / 100, 1);
            setGestureProgress(progress);
            onGestureChange?.(progress);
          }
          break;
        case "swipe-down":
          if (dy > 0) {
            const progress = Math.min(dy / 100, 1);
            setGestureProgress(progress);
            onGestureChange?.(progress);
          }
          break;
      }
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <button
        ref={ref}
        onMouseDown={(e) => handleGestureStart(e.clientX, e.clientY)}
        onMouseUp={handleGestureEnd}
        onMouseLeave={handleGestureEnd}
        onMouseMove={(e) => handleGestureMove(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          handleGestureStart(touch.clientX, touch.clientY);
        }}
        onTouchEnd={handleGestureEnd}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          handleGestureMove(touch.clientX, touch.clientY);
        }}
        className={cn(
          buttonVariants({ variant, size }),
          "relative overflow-hidden transition-all duration-200",
          isActive && "ring-2 ring-primary ring-offset-2",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "absolute inset-0 bg-primary/10",
            gesture.startsWith("swipe") ? "transition-transform" : "transition-opacity",
            {
              "translate-x-[-100%]": gesture === "swipe-left",
              "translate-x-[100%]": gesture === "swipe-right",
              "translate-y-[-100%]": gesture === "swipe-up",
              "translate-y-[100%]": gesture === "swipe-down",
            }
          )}
          style={{
            transform: gesture.startsWith("swipe")
              ? `${
                  gesture === "swipe-left" || gesture === "swipe-right"
                    ? `translateX(${gestureProgress * 100}%)`
                    : `translateY(${gestureProgress * 100}%)`
                }`
              : "none",
            opacity: gesture === "press" ? (isActive ? 1 : 0) : undefined,
          }}
        />
        {children}
      </button>
    );
  }
);

GestureButton.displayName = "GestureButton";

export { GestureButton };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const gestureButtonVariants = cva(
  "group relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden touch-none select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 rounded-md px-6 text-xs",
        lg: "h-14 rounded-md px-10",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface GestureButtonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gestureButtonVariants> {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  swipeThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
  gestureColor?: string;
  feedbackColor?: string;
  transitionDuration?: string;
}

const GestureButton = React.forwardRef<HTMLDivElement, GestureButtonProps>(
  (
    {
      className,
      variant,
      size,
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      onDoubleTap,
      onLongPress,
      swipeThreshold = 50,
      longPressDelay = 500,
      doubleTapDelay = 300,
      gestureColor = "rgba(255, 255, 255, 0.2)",
      feedbackColor = "currentColor",
      transitionDuration = "0.3s",
      children,
      style,
      ...props
    },
    ref
  ) => {
    const [touchStart, setTouchStart] = React.useState<{ x: number; y: number; time: number } | null>(null);
    const [lastTap, setLastTap] = React.useState(0);
    const longPressTimer = React.useRef<NodeJS.Timeout>();
    const [showFeedback, setShowFeedback] = React.useState(false);
    const [feedbackPosition, setFeedbackPosition] = React.useState({ x: 0, y: 0 });

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      const now = Date.now();
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY,
        time: now,
      });

      // Handle double tap
      if (onDoubleTap) {
        const timeSinceLastTap = now - lastTap;
        if (timeSinceLastTap < doubleTapDelay) {
          onDoubleTap();
          setShowFeedback(true);
          setFeedbackPosition({ x: touch.clientX, y: touch.clientY });
          setTimeout(() => setShowFeedback(false), 300);
        }
        setLastTap(now);
      }

      // Handle long press
      if (onLongPress) {
        longPressTimer.current = setTimeout(() => {
          onLongPress();
          setShowFeedback(true);
          setFeedbackPosition({ x: touch.clientX, y: touch.clientY });
          setTimeout(() => setShowFeedback(false), 300);
        }, longPressDelay);
      }
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }

      if (!touchStart) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      const time = Date.now() - touchStart.time;

      // Only trigger swipe if the movement was fast enough
      if (time < 300) {
        if (Math.abs(deltaX) > swipeThreshold) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
          setShowFeedback(true);
          setFeedbackPosition({ x: touch.clientX, y: touch.clientY });
          setTimeout(() => setShowFeedback(false), 300);
        }

        if (Math.abs(deltaY) > swipeThreshold) {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
          setShowFeedback(true);
          setFeedbackPosition({ x: touch.clientX, y: touch.clientY });
          setTimeout(() => setShowFeedback(false), 300);
        }
      }

      setTouchStart(null);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };

    const customStyle = {
      ...style,
      "--gesture-color": gestureColor,
      "--feedback-color": feedbackColor,
      "--transition-duration": transitionDuration,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn(
          gestureButtonVariants({ variant, size }),
          "relative",
          className
        )}
        style={customStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {showFeedback && (
          <div
            className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--feedback-color)] opacity-20 transition-all duration-300"
            style={{
              left: feedbackPosition.x,
              top: feedbackPosition.y,
            }}
          />
        )}
        {children}
      </div>
    );
  }
);

GestureButton.displayName = "GestureButton";

export { GestureButton };

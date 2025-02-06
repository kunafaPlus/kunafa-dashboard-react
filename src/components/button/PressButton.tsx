import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { PressButtonProps } from "./types/index";

const PressButton = React.forwardRef<HTMLButtonElement, PressButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    pressTime = 1000,
    showProgress = true,
    progressColor = "currentColor",
    onPressStart,
    onPressEnd,
    onPressCancel,
    children,
    ...props 
  }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const pressTimeoutRef = React.useRef<number>();
    const progressIntervalRef = React.useRef<number>();
    const startTimeRef = React.useRef<number>(0);

    const startPress = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setIsPressed(true);
      setProgress(0);
      startTimeRef.current = Date.now();
      onPressStart?.();

      if (showProgress) {
        progressIntervalRef.current = window.setInterval(() => {
          const elapsed = Date.now() - startTimeRef.current;
          const newProgress = Math.min((elapsed / pressTime) * 100, 100);
          setProgress(newProgress);
        }, 10);
      }

      pressTimeoutRef.current = window.setTimeout(() => {
        endPress();
      }, pressTime);
    };

    const endPress = () => {
      if (isPressed) {
        setIsPressed(false);
        setProgress(100);
        onPressEnd?.();
        cleanup();
      }
    };

    const cancelPress = () => {
      if (isPressed) {
        setIsPressed(false);
        setProgress(0);
        onPressCancel?.();
        cleanup();
      }
    };

    const cleanup = () => {
      if (pressTimeoutRef.current) {
        clearTimeout(pressTimeoutRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };

    React.useEffect(() => {
      return cleanup;
    }, []);

    return (
      <button
        ref={ref}
        onMouseDown={startPress}
        onMouseUp={cancelPress}
        onMouseLeave={cancelPress}
        onTouchStart={startPress}
        onTouchEnd={cancelPress}
        className={cn(
          buttonVariants({ variant, size }),
          "relative overflow-hidden",
          isPressed && "scale-95",
          className
        )}
        {...props}
      >
        {showProgress && (
          <div
            className="absolute inset-0 flex items-center justify-start overflow-hidden bg-primary/10"
            style={{ width: `${progress}%` }}
          >
            <div
              className="h-full w-full opacity-25"
              style={{ backgroundColor: progressColor }}
            />
          </div>
        )}
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

PressButton.displayName = "PressButton";

export { PressButton };

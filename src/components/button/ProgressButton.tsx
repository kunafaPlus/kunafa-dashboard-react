import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { ProgressButtonProps } from "./types";

const ProgressButton = React.forwardRef<HTMLButtonElement, ProgressButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    progress = 0,
    progressColor = "currentColor",
    progressPosition = "overlay",
    showValue = false,
    loading = false,
    children,
    ...props 
  }, ref) => {
    const progressStyle = {
      width: `${Math.min(Math.max(progress, 0), 100)}%`,
      backgroundColor: progressColor,
      transition: "width 0.3s ease-in-out",
    };

    const progressBar = (
      <div className="absolute left-0 top-0 h-full w-full overflow-hidden rounded-[inherit]">
        <div
          className={cn(
            "h-full opacity-20",
            loading && "animate-progress"
          )}
          style={progressStyle}
        />
      </div>
    );

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          "relative",
          progressPosition === "bottom" && "border-b-[3px] border-transparent",
          className
        )}
        style={{
          ...(progressPosition === "bottom" && {
            borderBottomColor: progressColor,
            borderBottomWidth: `${(progress / 100) * 3}px`,
          }),
        }}
        {...props}
      >
        {progressPosition === "overlay" && progressBar}
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {showValue && (
            <span className="text-xs">
              {Math.round(progress)}%
            </span>
          )}
        </span>
      </button>
    );
  }
);

ProgressButton.displayName = "ProgressButton";

export { ProgressButton };

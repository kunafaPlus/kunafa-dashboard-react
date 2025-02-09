import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { LoadingButtonProps } from "./types/index";

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    loading = false,
    loadingText = "Loading...",
    loadingPosition = "start",
    spinner,
    progress,
    progressColor = "currentColor",
    children,
    ...props 
  }, ref) => {
    const defaultSpinner = (
      <svg
        className="h-4 w-4 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <button
        ref={ref}
        disabled={loading}
        className={cn(
          buttonVariants({ variant, size }),
          "relative overflow-hidden",
          loading && "cursor-wait",
          className
        )}
        {...props}
      >
        {progress !== undefined && (
          <div
            className="absolute inset-0 flex items-center justify-start overflow-hidden bg-primary/10"
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          >
            <div
              className="h-full w-full opacity-25"
              style={{ backgroundColor: progressColor }}
            />
          </div>
        )}

        <span className="relative inline-flex items-center gap-2">
          {loading && loadingPosition === "start" && (
            <span className="inline-flex">{spinner || defaultSpinner}</span>
          )}
          
          <span className={cn(
            "inline-flex items-center gap-2",
            loading && "opacity-70"
          )}>
            {loading ? loadingText : children}
          </span>

          {loading && loadingPosition === "end" && (
            <span className="inline-flex">{spinner || defaultSpinner}</span>
          )}
        </span>
      </button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const progressButtonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ProgressButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof progressButtonVariants> {
  progress?: number;
  showProgress?: boolean;
  progressPlacement?: "background" | "foreground";
  progressColor?: string;
  progressClassName?: string;
  progressText?: string | ((progress: number) => string);
}

const ProgressButton = React.forwardRef<HTMLButtonElement, ProgressButtonProps>(
  (
    {
      className,
      variant,
      size,
      progress = 0,
      showProgress = true,
      progressPlacement = "background",
      progressColor,
      progressClassName,
      progressText,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const normalizedProgress = Math.min(Math.max(progress, 0), 100);
    
    const displayText = React.useMemo(() => {
      if (!showProgress) return children;
      if (!progressText) return children;
      if (typeof progressText === "function") {
        return progressText(normalizedProgress);
      }
      return progressText;
    }, [children, showProgress, progressText, normalizedProgress]);

    return (
      <button
        ref={ref}
        className={cn(progressButtonVariants({ variant, size, className }))}
        disabled={disabled}
        {...props}
      >
        {/* Progress Bar */}
        {showProgress && (
          <div
            className={cn(
              "absolute left-0 top-0 h-full transition-all duration-300 ease-in-out",
              progressPlacement === "background" ? "z-0" : "z-10",
              progressClassName
            )}
            style={{
              width: `${normalizedProgress}%`,
              backgroundColor: progressColor || "currentColor",
              opacity: progressPlacement === "background" ? 0.15 : 0.2,
            }}
          />
        )}

        {/* Progress Text */}
        <span className="relative z-10">{displayText}</span>

        {/* Progress Percentage */}
        {showProgress && !progressText && (
          <span className="relative z-10 ml-2 text-xs opacity-80">
            {Math.round(normalizedProgress)}%
          </span>
        )}
      </button>
    );
  }
);

ProgressButton.displayName = "ProgressButton";

export { ProgressButton };

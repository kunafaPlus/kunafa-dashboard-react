import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const loadingButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
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

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof loadingButtonVariants> {
  loading?: boolean;
  loadingText?: string;
  spinnerClassName?: string;
  spinnerSize?: "sm" | "default" | "lg";
  spinnerPlacement?: "start" | "end";
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      loadingText,
      spinnerClassName,
      spinnerSize = "default",
      spinnerPlacement = "start",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const spinnerSizes = {
      sm: "w-3 h-3",
      default: "w-4 h-4",
      lg: "w-5 h-5",
    };

    const Spinner = () => (
      <svg
        className={cn(
          "animate-spin",
          spinnerSizes[spinnerSize],
          spinnerClassName
        )}
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
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );

    return (
      <button
        ref={ref}
        className={cn(loadingButtonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading && spinnerPlacement === "start" && (
          <Spinner />
        )}
        <span className={cn(loading && "mx-2")}>
          {loading ? loadingText || children : children}
        </span>
        {loading && spinnerPlacement === "end" && (
          <Spinner />
        )}
      </button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };

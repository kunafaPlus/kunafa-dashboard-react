import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const tooltipButtonVariants = cva(
  "group relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
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
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      tooltipPosition: {
        top: "before:bottom-full before:left-1/2 before:-translate-x-1/2 before:-translate-y-2",
        bottom:
          "before:top-full before:left-1/2 before:-translate-x-1/2 before:translate-y-2",
        left: "before:right-full before:top-1/2 before:-translate-y-1/2 before:-translate-x-2",
        right:
          "before:left-full before:top-1/2 before:-translate-y-1/2 before:translate-x-2",
      },
      arrow: {
        none: "",
        top: "after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-x-transparent after:border-t-[var(--tooltip-bg)] after:border-b-0",
        bottom:
          "after:top-full after:left-1/2 after:-translate-x-1/2 after:border-x-transparent after:border-b-[var(--tooltip-bg)] after:border-t-0",
        left: "after:right-full after:top-1/2 after:-translate-y-1/2 after:border-y-transparent after:border-l-[var(--tooltip-bg)] after:border-r-0",
        right:
          "after:left-full after:top-1/2 after:-translate-y-1/2 after:border-y-transparent after:border-r-[var(--tooltip-bg)] after:border-l-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      tooltipPosition: "top",
      arrow: "top",
    },
  }
);

interface TooltipButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tooltipButtonVariants> {
  tooltip?: React.ReactNode;
  tooltipBg?: string;
  tooltipColor?: string;
  tooltipDelay?: number;
  tooltipOffset?: string;
  tooltipWidth?: string;
  tooltipPadding?: string;
  tooltipRadius?: string;
  tooltipShadow?: string;
  tooltipZIndex?: number;
  icon?: React.ReactNode;
}

const TooltipButton = React.forwardRef<HTMLButtonElement, TooltipButtonProps>(
  (
    {
      className,
      variant,
      size,
      tooltipPosition,
      arrow,
      tooltip,
      tooltipBg = "rgb(0 0 0 / 0.9)",
      tooltipColor = "white",
      tooltipDelay = 0,
      tooltipOffset = "0.5rem",
      tooltipWidth = "max-content",
      tooltipPadding = "0.5rem",
      tooltipRadius = "0.375rem",
      tooltipShadow = "0 2px 4px rgb(0 0 0 / 0.1)",
      tooltipZIndex = 50,
      icon,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const customStyle = {
      ...style,
      "--tooltip-bg": tooltipBg,
      "--tooltip-color": tooltipColor,
      "--tooltip-delay": `${tooltipDelay}ms`,
      "--tooltip-offset": tooltipOffset,
      "--tooltip-width": tooltipWidth,
      "--tooltip-padding": tooltipPadding,
      "--tooltip-radius": tooltipRadius,
      "--tooltip-shadow": tooltipShadow,
      "--tooltip-z-index": tooltipZIndex,
    } as React.CSSProperties;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          tooltipButtonVariants({ variant, size, tooltipPosition, arrow }),
          "before:absolute before:z-[var(--tooltip-z-index)] before:w-[var(--tooltip-width)] before:rounded-[var(--tooltip-radius)] before:bg-[var(--tooltip-bg)] before:p-[var(--tooltip-padding)] before:text-[var(--tooltip-color)] before:content-[attr(data-tooltip)] before:opacity-0 before:shadow-[var(--tooltip-shadow)] before:transition-all before:delay-[var(--tooltip-delay)] hover:before:opacity-100 focus-visible:before:opacity-100",
          arrow !== "none" &&
            "after:absolute after:z-[var(--tooltip-z-index)] after:h-0 after:w-0 after:border-[6px] after:opacity-0 after:transition-all after:delay-[var(--tooltip-delay)] hover:after:opacity-100 focus-visible:after:opacity-100",
          className
        )}
        style={customStyle}
        data-tooltip={tooltip}
        {...props}
      >
        {icon ? (
          <span className="grid h-full place-items-center">{icon}</span>
        ) : (
          children
        )}
      </button>
    );
  }
);

TooltipButton.displayName = "TooltipButton";

export { TooltipButton };

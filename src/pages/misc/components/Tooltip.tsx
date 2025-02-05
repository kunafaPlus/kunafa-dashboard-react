import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const tooltipVariants = cva(
  "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "",
        dark: "bg-gray-900 text-white border-gray-800",
        light: "bg-white text-gray-900 border-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface TooltipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tooltipVariants> {
  content: React.ReactNode;
  delayDuration?: number;
  side?: "top" | "right" | "bottom" | "left";
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      className,
      variant,
      content,
      delayDuration = 200,
      side = "top",
      children,
      ...props
    },
    ref
  ) => {
    const [show, setShow] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    const handleMouseEnter = () => {
      timeoutRef.current = setTimeout(() => {
        setShow(true);
      }, delayDuration);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShow(false);
    };

    return (
      <div
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
        {show && (
          <div
            ref={ref}
            role="tooltip"
            data-side={side}
            className={cn(
              tooltipVariants({ variant }),
              "absolute",
              {
                "top-0 -translate-y-full -mt-2": side === "top",
                "bottom-0 translate-y-full mt-2": side === "bottom",
                "left-0 -translate-x-full -ml-2": side === "left",
                "right-0 translate-x-full ml-2": side === "right",
              },
              className
            )}
            {...props}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";

export { Tooltip, tooltipVariants };

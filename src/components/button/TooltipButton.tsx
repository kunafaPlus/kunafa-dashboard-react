import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants, tooltipButtonVariants } from "./variants";
import { TooltipButtonProps } from "./types";
import { Tooltip } from "../../pages/misc/components/Tooltip";

const TooltipButton = React.forwardRef<HTMLButtonElement, TooltipButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      tooltip,
      tooltipPosition = "top",
      tooltipDelay,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Tooltip 
        content={tooltip}
        position={tooltipPosition}
        delay={tooltipDelay}
      >
        <button
          ref={ref}
          type="button"
          className={cn(
            buttonVariants({ variant, size }),
            tooltipButtonVariants({ position: tooltipPosition }),
            className
          )}
          {...props}
        >
          {children}
        </button>
      </Tooltip>
    );
  }
);

TooltipButton.displayName = "TooltipButton";

export { TooltipButton };

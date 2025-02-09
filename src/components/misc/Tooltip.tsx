import * as React from "react";
import { cn } from "../../utils/cn";
import { TooltipProps } from "./types";
import { tooltipButtonVariants } from "../button/variants";




const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      className,
      variant,
      content,
      delayDuration = 200,
      delay=delayDuration,
      side = "top",
      children,
      position,
      ...props
    },
    ref
  ) => {
    const [show, setShow] = React.useState(false);
    const timeoutRef = React.useRef<number>();

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
              tooltipButtonVariants({ variant }),
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

export { Tooltip };

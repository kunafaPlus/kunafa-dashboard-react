import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants, toolbarButtonVariants } from "./variants";
import { ToolbarButtonProps } from "./types";
import { Tooltip } from "../../pages/misc/components/Tooltip";

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      className,
      variant = "ghost",
      size = "icon",
      active = false,
      tooltip,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const button = (
      <button
        ref={ref}
        type="button"
        className={cn(
          buttonVariants({ variant, size }),
          toolbarButtonVariants({ active }),
          className
        )}
        {...props}
      >
        {icon}
        {children}
      </button>
    );

    if (tooltip) {
      return (
        <Tooltip content={tooltip}>
          {button}
        </Tooltip>
      );
    }

    return button;
  }
);

ToolbarButton.displayName = "ToolbarButton";

export { ToolbarButton };

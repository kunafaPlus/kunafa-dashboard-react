import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { IconButtonProps } from "./types/index";

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, icon, iconPosition = "left", iconClassName, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), "inline-flex items-center gap-2", className)}
        {...props}
      >
        {iconPosition === "left" && (
          <span className={cn("inline-flex items-center", iconClassName)}>
            {icon}
          </span>
        )}
        {children}
        {iconPosition === "right" && (
          <span className={cn("inline-flex items-center", iconClassName)}>
            {icon}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton };

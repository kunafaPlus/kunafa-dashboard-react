import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants, statusButtonVariants } from "./variants";
import { StatusButtonProps } from "./types";

const StatusButton = React.forwardRef<HTMLButtonElement, StatusButtonProps>(
  (
    {
      className,
      variant = "outline",
      size = "default",
      status = "offline",
      indicatorPosition = "start",
      children,
      ...props
    },
    ref
  ) => {
    const statusColors: Record<string, string> = {
      online: "bg-green-500",
      offline: "bg-gray-400",
      away: "bg-yellow-500",
      busy: "bg-red-500",
      loading: "bg-blue-500 animate-pulse"
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          buttonVariants({ variant, size }),
          statusButtonVariants({ status, position: indicatorPosition } as any),
          "relative inline-flex items-center gap-2",
          className
        )}
        {...props}
      >
        {indicatorPosition === "start" && (
          <span 
            className={cn(
              "h-2 w-2 rounded-full",
              statusColors[status]
            )} 
          />
        )}
        {children}
        {indicatorPosition === "end" && (
          <span 
            className={cn(
              "h-2 w-2 rounded-full",
              statusColors[status]
            )} 
          />
        )}
      </button>
    );
  }
);

StatusButton.displayName = "StatusButton";

export { StatusButton };

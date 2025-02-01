import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const notificationButtonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
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
      badgePosition: {
        "top-right": "before:top-0 before:right-0 before:translate-x-1/3 before:-translate-y-1/3",
        "top-left": "before:top-0 before:left-0 before:-translate-x-1/3 before:-translate-y-1/3",
        "bottom-right": "before:bottom-0 before:right-0 before:translate-x-1/3 before:translate-y-1/3",
        "bottom-left": "before:bottom-0 before:left-0 before:-translate-x-1/3 before:translate-y-1/3",
      },
      animation: {
        none: "",
        pulse: "before:animate-pulse",
        bounce: "before:animate-bounce",
        ping: "before:animate-ping",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      badgePosition: "top-right",
      animation: "none",
    },
  }
);

interface NotificationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof notificationButtonVariants> {
  count?: number;
  maxCount?: number;
  showZero?: boolean;
  badgeColor?: string;
  badgeTextColor?: string;
  badgeSize?: string;
  pulseColor?: string;
  pulseSize?: string;
  icon?: React.ReactNode;
}

const NotificationButton = React.forwardRef<HTMLButtonElement, NotificationButtonProps>(
  (
    {
      className,
      variant,
      size,
      badgePosition,
      animation,
      count = 0,
      maxCount = 99,
      showZero = false,
      badgeColor = "rgb(239 68 68)", // red-500
      badgeTextColor = "white",
      badgeSize = "1.25rem",
      pulseColor,
      pulseSize = "2rem",
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
    const showBadge = count > 0 || showZero;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          notificationButtonVariants({ variant, size, badgePosition, animation }),
          "group",
          className
        )}
        {...props}
      >
        {showBadge && (
          <>
            {animation !== "none" && (
              <span
                className="absolute rounded-full opacity-75"
                style={{
                  width: pulseSize,
                  height: pulseSize,
                  backgroundColor: pulseColor || badgeColor,
                  ...{
                    "top-right": { top: 0, right: 0, transform: "translate(30%, -30%)" },
                    "top-left": { top: 0, left: 0, transform: "translate(-30%, -30%)" },
                    "bottom-right": { bottom: 0, right: 0, transform: "translate(30%, 30%)" },
                    "bottom-left": { bottom: 0, left: 0, transform: "translate(-30%, 30%)" },
                  }[badgePosition || "top-right"],
                }}
              />
            )}
            <span
              className="absolute grid place-items-center rounded-full text-xs font-bold"
              style={{
                minWidth: badgeSize,
                height: badgeSize,
                padding: "0 0.25rem",
                backgroundColor: badgeColor,
                color: badgeTextColor,
                ...{
                  "top-right": { top: 0, right: 0, transform: "translate(30%, -30%)" },
                  "top-left": { top: 0, left: 0, transform: "translate(-30%, -30%)" },
                  "bottom-right": { bottom: 0, right: 0, transform: "translate(30%, 30%)" },
                  "bottom-left": { bottom: 0, left: 0, transform: "translate(-30%, 30%)" },
                }[badgePosition || "top-right"],
              }}
            >
              {displayCount}
            </span>
          </>
        )}
        {icon ? (
          <span className="grid h-full place-items-center">{icon}</span>
        ) : (
          children
        )}
      </button>
    );
  }
);

NotificationButton.displayName = "NotificationButton";

export { NotificationButton };

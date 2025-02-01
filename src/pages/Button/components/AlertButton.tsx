import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const alertButtonVariants = cva(
  "relative   rounded-md text-sm font-medium ",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-gray-200 text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      alertStyle: {
        none: "",
        pulse: "before:absolute before:inset-0 before:rounded-[inherit] before:animate-pulse before:bg-current before:opacity-25",
        glow: "before:absolute before:inset-0 before:rounded-[inherit] before:shadow-[0_0_10px_currentColor] before:opacity-50 before:animate-pulse",
        shake: "data-[alert=true]:animate-shake",
        bounce: "data-[alert=true]:animate-bounce",
        ring: "before:absolute before:inset-[-4px] before:rounded-[inherit] before:border-2 before:border-current before:opacity-50 before:animate-ping",
      },
      alertPosition: {
        "top-right": "after:top-0 after:right-0 after:translate-x-1/3 after:-translate-y-1/3",
        "top-left": "after:top-0 after:left-0 after:-translate-x-1/3 after:-translate-y-1/3",
        "bottom-right": "after:bottom-0 after:right-0 after:translate-x-1/3 after:translate-y-1/3",
        "bottom-left": "after:bottom-0 after:left-0 after:-translate-x-1/3 after:translate-y-1/3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      alertStyle: "none",
      alertPosition: "top-right",
    },
  }
);

interface AlertButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof alertButtonVariants> {
  alert?: boolean;
  alertDot?: boolean;
  alertColor?: string;
  alertSize?: string;
  glowColor?: string;
  glowAmount?: string;
  animationDuration?: string;
  icon?: React.ReactNode;
}

const AlertButton = React.forwardRef<HTMLButtonElement, AlertButtonProps>(
  (
    {
      className,
      variant,
      size,
      alertStyle,
      alertPosition,
      alert = false,
      alertDot = true,
      alertColor = "rgb(239 68 68)", // red-500
      alertSize = "0.5rem",
      glowColor,
      glowAmount = "10px",
      animationDuration = "2s",
      icon,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const customStyle = {
      ...style,
      "--alert-color": alertColor,
      "--alert-size": alertSize,
      "--glow-color": glowColor || alertColor,
      "--glow-amount": glowAmount,
      "--animation-duration": animationDuration,
    } as React.CSSProperties;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          alertButtonVariants({ variant, size, alertStyle, alertPosition }),
          alertDot &&
            alert &&
            "after:absolute after:w-[var(--alert-size)] after:h-[var(--alert-size)] after:rounded-full after:bg-[var(--alert-color)] after:shadow-[0_0_var(--glow-amount)_var(--glow-color)]",
          className
        )}
        style={customStyle}
        data-alert={alert}
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

AlertButton.displayName = "AlertButton";

export { AlertButton };

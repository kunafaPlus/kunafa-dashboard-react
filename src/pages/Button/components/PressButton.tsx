import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const pressButtonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white active:bg-primary/90 active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground active:bg-destructive/90 active:scale-95",
        outline:
          "border border-input bg-background active:bg-accent active:text-accent-foreground active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground active:bg-secondary/80 active:scale-95",
        ghost: "active:bg-accent active:text-accent-foreground active:scale-95",
        link: "text-primary underline-offset-4 active:underline active:scale-95",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      effect: {
        none: "",
        scale: "active:scale-90",
        rotate: "active:rotate-3",
        skew: "active:skew-x-6",
        sink: "active:translate-y-1",
        flash: "active:brightness-150",
        ripple:
          "after:absolute after:inset-0 after:bg-white/20 after:scale-0 after:opacity-0 active:after:scale-150 active:after:opacity-100 after:origin-center after:rounded-full after:transition-all after:duration-300",
        bounce: "active:animate-bounce",
        shake: "active:animate-shake",
        pulse: "active:animate-pulse",
      },
      feedback: {
        none: "",
        shadow: "active:shadow-inner",
        border: "active:border-2",
        outline: "active:outline active:outline-2 active:outline-offset-2",
        glow: "active:shadow-[0_0_10px_currentColor]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      effect: "none",
      feedback: "none",
    },
  }
);

interface PressButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pressButtonVariants> {
  pressScale?: number;
  pressRotate?: number;
  pressSkew?: number;
  pressTranslate?: string;
  shadowColor?: string;
  shadowSize?: string;
  transitionDuration?: string;
  transitionTiming?: string;
  rippleColor?: string;
  rippleSize?: number;
}

const PressButton = React.forwardRef<HTMLButtonElement, PressButtonProps>(
  (
    {
      className,
      variant,
      size,
      effect,
      feedback,
      pressScale = 0.9,
      pressRotate = 3,
      pressSkew = 6,
      pressTranslate = "0.25rem",
      shadowColor = "rgba(0, 0, 0, 0.2)",
      shadowSize = "4px",
      transitionDuration = "0.15s",
      transitionTiming = "ease",
      rippleColor = "rgba(255, 255, 255, 0.2)",
      rippleSize = 150,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const customStyle = {
      ...style,
      "--press-scale": pressScale,
      "--press-rotate": `${pressRotate}deg`,
      "--press-skew": `${pressSkew}deg`,
      "--press-translate": pressTranslate,
      "--shadow-color": shadowColor,
      "--shadow-size": shadowSize,
      "--transition-duration": transitionDuration,
      "--transition-timing": transitionTiming,
      "--ripple-color": rippleColor,
      "--ripple-size": `${rippleSize}%`,
    } as React.CSSProperties;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(pressButtonVariants({ variant, size, effect, feedback }), className)}
        style={customStyle}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

PressButton.displayName = "PressButton";

export { PressButton };

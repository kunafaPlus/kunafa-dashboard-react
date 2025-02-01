import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const gradientButtonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary-dark text-white hover:brightness-110",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive-dark text-destructive-foreground hover:brightness-110",
        rainbow:
          "bg-gradient-to-r from-[#ff0000] via-[#00ff00] to-[#0000ff] text-white hover:brightness-110 animate-gradient bg-[length:200%_auto]",
        sunset:
          "bg-gradient-to-r from-orange-500 via-red-500 to-purple-500 text-white hover:brightness-110 animate-gradient bg-[length:200%_auto]",
        ocean:
          "bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 text-white hover:brightness-110 animate-gradient bg-[length:200%_auto]",
        fire: "bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 text-white hover:brightness-110 animate-gradient bg-[length:200%_auto]",
        earth:
          "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:brightness-110 animate-gradient bg-[length:200%_auto]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        flow: "animate-gradient bg-[length:200%_auto]",
        shine:
          "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent after:-translate-x-full hover:after:translate-x-full after:transition-transform after:duration-1000",
      },
      direction: {
        right: "bg-gradient-to-r",
        left: "bg-gradient-to-l",
        bottom: "bg-gradient-to-b",
        top: "bg-gradient-to-t",
        "bottom-right": "bg-gradient-to-br",
        "bottom-left": "bg-gradient-to-bl",
        "top-right": "bg-gradient-to-tr",
        "top-left": "bg-gradient-to-tl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
      direction: "right",
    },
  }
);

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  fromColor?: string;
  viaColor?: string;
  toColor?: string;
  animationDuration?: string;
  glowAmount?: string;
  hoverScale?: number;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  (
    {
      className,
      variant,
      size,
      animation,
      direction,
      fromColor,
      viaColor,
      toColor,
      animationDuration = "3s",
      glowAmount = "0px",
      hoverScale = 1.05,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const customStyle = {
      ...style,
      ...(fromColor && toColor
        ? {
            backgroundImage: viaColor
              ? `linear-gradient(to right, ${fromColor}, ${viaColor}, ${toColor})`
              : `linear-gradient(to right, ${fromColor}, ${toColor})`,
          }
        : {}),
      "--animation-duration": animationDuration,
      "--glow-amount": glowAmount,
      "--hover-scale": hoverScale,
    } as React.CSSProperties;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          gradientButtonVariants({ variant, size, animation, direction }),
          "hover:scale-[var(--hover-scale)] hover:shadow-[0_0_var(--glow-amount)_currentColor]",
          className
        )}
        style={customStyle}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

GradientButton.displayName = "GradientButton";

export { GradientButton };

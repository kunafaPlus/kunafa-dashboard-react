import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const scrollButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      position: {
        "bottom-right": "fixed bottom-4 right-4",
        "bottom-left": "fixed bottom-4 left-4",
        "top-right": "fixed top-4 right-4",
        "top-left": "fixed top-4 left-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "icon",
      position: "bottom-right",
    },
  }
);

interface ScrollButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof scrollButtonVariants> {
  showAfter?: number;
  smooth?: boolean;
  showIcon?: boolean;
  hideWhenReached?: boolean;
  target?: string | number | HTMLElement;
  offset?: number;
  onScroll?: (visible: boolean) => void;
}

const ScrollButton = React.forwardRef<HTMLButtonElement, ScrollButtonProps>(
  (
    {
      className,
      variant,
      size,
      position,
      showAfter = 400,
      smooth = true,
      showIcon = true,
      hideWhenReached = true,
      target,
      offset = 0,
      onScroll,
      children,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(false);
    const [reachedTarget, setReachedTarget] = React.useState(false);

    const scrollToTarget = () => {
      let targetPosition = 0;

      if (typeof target === "string") {
        const targetElement = document.querySelector(target);
        if (targetElement) {
          targetPosition = targetElement.offsetTop - offset;
        }
      } else if (typeof target === "number") {
        targetPosition = target;
      } else if (target instanceof HTMLElement) {
        targetPosition = target.offsetTop - offset;
      }

      window.scrollTo({
        top: targetPosition,
        behavior: smooth ? "smooth" : "auto",
      });
    };

    const checkScroll = () => {
      const scrolled = window.scrollY > showAfter;
      setVisible(scrolled);
      onScroll?.(scrolled);

      if (hideWhenReached && target) {
        let targetPosition = 0;
        if (typeof target === "string") {
          const targetElement = document.querySelector(target);
          if (targetElement) {
            targetPosition = targetElement.offsetTop - offset;
          }
        } else if (typeof target === "number") {
          targetPosition = target;
        } else if (target instanceof HTMLElement) {
          targetPosition = target.offsetTop - offset;
        }

        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY + windowHeight;
        setReachedTarget(scrollPosition >= targetPosition);
      }
    };

    React.useEffect(() => {
      window.addEventListener("scroll", checkScroll);
      return () => window.removeEventListener("scroll", checkScroll);
    }, [target, offset, hideWhenReached, showAfter]);

    // Hide the button if it's not visible or if the target is reached and hideWhenReached is true
    if (!visible || (hideWhenReached && reachedTarget)) {
      return null;
    }

    const defaultIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        className="h-4 w-4"
        fill="currentColor"
      >
        <path
          d={
            target
              ? "M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
              : "M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
          }
        />
      </svg>
    );

    return (
      <button
        ref={ref}
        type="button"
        className={cn(scrollButtonVariants({ variant, size, position }), className)}
        onClick={scrollToTarget}
        {...props}
      >
        {showIcon && defaultIcon}
        {children}
      </button>
    );
  }
);
ScrollButton.displayName = "ScrollButton";

export { ScrollButton };
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const scrollToTopButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-lg hover:shadow-xl",
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
        default: "h-14 w-14",
        sm: "h-10 w-10",
        lg: "h-16 w-16",
      },
      position: {
        "bottom-right": "fixed bottom-4 right-4",
        "bottom-left": "fixed bottom-4 left-4",
        "bottom-center": "fixed bottom-4 left-1/2 -translate-x-1/2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "bottom-right",
    },
  }
);

interface ScrollToTopButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof scrollToTopButtonVariants> {
  showAfter?: number;
  smooth?: boolean;
  showIcon?: boolean;
  animate?: boolean;
  hideOnTop?: boolean;
}

const ScrollToTopButton = React.forwardRef<HTMLButtonElement, ScrollToTopButtonProps>(
  (
    {
      className,
      variant,
      size,
      position,
      showAfter = 400,
      smooth = true,
      showIcon = true,
      animate = true,
      hideOnTop = true,
      children,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
      const checkScroll = () => {
        if (hideOnTop) {
          setVisible(window.scrollY > showAfter);
        }
      };

      window.addEventListener("scroll", checkScroll);
      return () => window.removeEventListener("scroll", checkScroll);
    }, [showAfter, hideOnTop]);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: smooth ? "smooth" : "auto",
      });
    };

    if (hideOnTop && !visible) {
      return null;
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          scrollToTopButtonVariants({ variant, size, position }),
          animate && "animate-bounce-slow",
          className
        )}
        onClick={scrollToTop}
        {...props}
      >
        {showIcon ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            className="h-6 w-6"
            fill="currentColor"
          >
            <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
          </svg>
        ) : (
          children
        )}
      </button>
    );
  }
);

ScrollToTopButton.displayName = "ScrollToTopButton";

export { ScrollToTopButton };

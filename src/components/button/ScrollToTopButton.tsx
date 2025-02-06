import * as React from "react";
import { cn } from "../../utils/cn";
import { cva, type VariantProps } from "class-variance-authority";


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
  behavior?:any
}

const ScrollToTopButton = React.forwardRef<HTMLButtonElement, ScrollToTopButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    showAfter = 300,
    smooth = true,
    showIcon = true,
    behavior = "smooth",
    children,
    ...props 
  }, ref) => {
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
      const checkScroll = () => {
        setVisible(window.pageYOffset > showAfter);
      };

      window.addEventListener("scroll", checkScroll);
      return () => window.removeEventListener("scroll", checkScroll);
    }, [showAfter]);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior
      });
    };

    if (!visible) return null;

    return (
      <button
        ref={ref}
        onClick={scrollToTop}
        className={cn(
          scrollToTopButtonVariants({ variant, size }),
          "fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full shadow-lg",
          className
        )}
        {...props}
      >
        {showIcon && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

ScrollToTopButton.displayName = "ScrollToTopButton";

export { ScrollToTopButton };

import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { BackButtonProps } from "./types/index";

const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  ({ 
    className, 
    variant = "ghost", 
    size = "icon",
    fallbackUrl = "/",
    confirmNavigation = false,
    confirmMessage = "Are you sure you want to go back?",
    children,
    ...props 
  }, ref) => {
    const handleBack = () => {
      if (confirmNavigation && !window.confirm(confirmMessage)) {
        return;
      }

      if (window.history.length > 2) {
        window.history.back();
      } else {
        window.location.href = fallbackUrl;
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleBack}
        className={cn(
          buttonVariants({ variant, size }),
          "inline-flex items-center gap-2",
          className
        )}
        {...props}
      >
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
          <path d="m15 18-6-6 6-6" />
        </svg>
        {children}
      </button>
    );
  }
);

BackButton.displayName = "BackButton";

export { BackButton };

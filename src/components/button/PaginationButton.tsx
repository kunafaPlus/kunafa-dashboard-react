import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { PaginationButtonProps } from "./types/index";

const PaginationButton = React.forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ 
    className,
    variant = "outline",
    size = "icon",
    page = 1,
    isActive = false,
    isDisabled = false,
    showArrow = false,
    direction,
    onPageChange,
    children,
    ...props 
  }, ref) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled && onPageChange) {
        onPageChange(page, event);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        disabled={isDisabled}
        className={cn(
          buttonVariants({ variant, size }),
          "min-w-[2.25rem] px-3",
          isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
          isDisabled && "pointer-events-none opacity-50",
          className
        )}
        {...props}
      >
        {showArrow && direction === "prev" && (
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
        )}

        {showArrow && direction === "next" && (
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
            <path d="m9 18 6-6-6-6" />
          </svg>
        )}

        {!showArrow && children}
      </button>
    );
  }
);

PaginationButton.displayName = "PaginationButton";

export { PaginationButton };

import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { CommentButtonProps } from "./types/index";

const CommentButton = React.forwardRef<HTMLButtonElement, CommentButtonProps>(
  ({ 
    className, 
    variant = "ghost", 
    size = "icon",
    count = 0,
    showCount = true,
    onClick,
    children,
    ...props 
  }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          buttonVariants({ variant, size }),
          "inline-flex items-center gap-2 relative",
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
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {children}
        {showCount && count > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>
    );
  }
);

CommentButton.displayName = "CommentButton";

export { CommentButton };

import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { ScrollButtonProps } from "./types/index";

const ScrollButton = React.forwardRef<HTMLButtonElement, ScrollButtonProps>(
  ({ 
    className, 
    variant, 
    size,
    targetId,
    targetRef,
    offset = 0,
    smooth = true,
    children,
    ...props 
  }, ref) => {
    const handleScroll = () => {
      let targetElement: HTMLElement | null = null;

      if (targetRef?.current) {
        targetElement = targetRef.current;
      } else if (targetId) {
        targetElement = document.getElementById(targetId);
      }

      if (targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: smooth ? 'smooth' : 'auto',
        });
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleScroll}
        className={cn(
          buttonVariants({ variant, size }),
          "inline-flex items-center gap-2",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ScrollButton.displayName = "ScrollButton";

export { ScrollButton };
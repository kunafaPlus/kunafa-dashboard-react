import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { PopoverButtonProps } from "./types/index";

const PopoverButton = React.forwardRef<HTMLButtonElement, PopoverButtonProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    content,
    position = "bottom",
    offset = 8,
    arrow = true,
    closeOnClick = true,
    closeOnOutsideClick = true,
    children,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const popoverRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => buttonRef.current!);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (closeOnClick) {
        setIsOpen(!isOpen);
      }
      props.onClick?.(event);
    };

    React.useEffect(() => {
      if (closeOnOutsideClick) {
        const handleOutsideClick = (event: MouseEvent) => {
          if (
            isOpen &&
            buttonRef.current &&
            popoverRef.current &&
            !buttonRef.current.contains(event.target as Node) &&
            !popoverRef.current.contains(event.target as Node)
          ) {
            setIsOpen(false);
          }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
          document.removeEventListener("mousedown", handleOutsideClick);
        };
      }
    }, [isOpen, closeOnOutsideClick]);

    const getPopoverPosition = () => {
      switch (position) {
        case "top":
          return `bottom-full mb-${offset}`;
        case "bottom":
          return `top-full mt-${offset}`;
        case "left":
          return `right-full mr-${offset} translate-y-[-50%] top-1/2`;
        case "right":
          return `left-full ml-${offset} translate-y-[-50%] top-1/2`;
        default:
          return `top-full mt-${offset}`;
      }
    };

    const getArrowPosition = () => {
      switch (position) {
        case "top":
          return "bottom-[-4px] left-1/2 -translate-x-1/2 rotate-45";
        case "bottom":
          return "top-[-4px] left-1/2 -translate-x-1/2 rotate-45";
        case "left":
          return "right-[-4px] top-1/2 -translate-y-1/2 rotate-45";
        case "right":
          return "left-[-4px] top-1/2 -translate-y-1/2 rotate-45";
        default:
          return "top-[-4px] left-1/2 -translate-x-1/2 rotate-45";
      }
    };

    return (
      <div className="relative inline-block">
        <button
          ref={buttonRef}
          onClick={handleClick}
          className={cn(
            buttonVariants({ variant, size }),
            isOpen && "bg-accent text-accent-foreground",
            className
          )}
          {...props}
        >
          {children}
        </button>

        {isOpen && (
          <div
            ref={popoverRef}
            className={cn(
              "absolute z-50 min-w-[200px] rounded-md bg-popover p-4 text-popover-foreground shadow-md outline-none",
              "animate-in fade-in-0 zoom-in-95",
              getPopoverPosition()
            )}
          >
            {arrow && (
              <div
                className={cn(
                  "absolute h-2 w-2 rotate-45 bg-popover",
                  getArrowPosition()
                )}
              />
            )}
            {content}
          </div>
        )}
      </div>
    );
  }
);

PopoverButton.displayName = "PopoverButton";

export { PopoverButton };

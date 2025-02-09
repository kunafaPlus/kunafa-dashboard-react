import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { DropdownButtonProps } from "./types/index";

const DropdownButton = React.forwardRef<HTMLButtonElement, DropdownButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "default",
    items = [],
    trigger,
    placement = "bottom-start",
    offset = 4,
    children,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getPlacementStyles = () => {
      switch (placement) {
        case "bottom-start":
          return "top-full left-0";
        case "bottom-end":
          return "top-full right-0";
        case "top-start":
          return "bottom-full left-0";
        case "top-end":
          return "bottom-full right-0";
        default:
          return "top-full left-0";
      }
    };

    return (
      <div ref={dropdownRef} className="relative inline-block">
        <button
          ref={ref}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            buttonVariants({ variant, size }),
            "inline-flex items-center gap-2",
            className
          )}
          {...props}
        >
          {trigger || children}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {isOpen && (
          <div
            className={cn(
              "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-background p-1 shadow-md",
              getPlacementStyles(),
              placement.startsWith("top") ? `mb-${offset}` : `mt-${offset}`
            )}
          >
            {items.map((item:any, index) => (
              <React.Fragment key={item.id || index}>
                {item.divider ? (
                  <div className="my-1 h-px bg-muted" />
                ) : (
                  <button
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground",
                      item.disabled && "pointer-events-none opacity-50",
                      item.danger && "text-destructive",
                      item.className
                    )}
                    disabled={item.disabled}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  }
);

DropdownButton.displayName = "DropdownButton";

export default DropdownButton;

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const sortButtonVariants = cva(
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
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  }
);

export interface SortOption {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SortButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sortButtonVariants> {
  options: SortOption[];
  defaultDirection?: "asc" | "desc";
  showIcon?: boolean;
  showDirection?: boolean;
  menuClassName?: string;
  itemClassName?: string;
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
  onSort?: (optionId: string, direction: "asc" | "desc") => void;
}

const SortButton = React.forwardRef<HTMLButtonElement, SortButtonProps>(
  (
    {
      className,
      variant,
      size,
      options,
      defaultDirection = "asc",
      showIcon = true,
      showDirection = true,
      menuClassName,
      itemClassName,
      placement = "bottom-start",
      onSort,
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedOption, setSelectedOption] = React.useState<string | null>(
      null
    );
    const [direction, setDirection] = React.useState<"asc" | "desc">(
      defaultDirection
    );

    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => buttonRef.current!);

    // Close menu when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          buttonRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOptionClick = (optionId: string) => {
      if (selectedOption === optionId) {
        setDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSelectedOption(optionId);
        setDirection(defaultDirection);
      }
      onSort?.(optionId, direction);
      setIsOpen(false);
    };

    const selectedOptionLabel = options.find(
      (option) => option.id === selectedOption
    )?.label;

    const directionIcon = direction === "asc" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
        className="h-3 w-3"
        fill="currentColor"
      >
        <path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
        className="h-3 w-3"
        fill="currentColor"
      >
        <path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z" />
      </svg>
    );

    return (
      <div className="relative inline-block">
        <button
          ref={buttonRef}
          type="button"
          className={cn(
            sortButtonVariants({ variant, size }),
            "gap-2",
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
          {...props}
        >
          {showIcon && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />
            </svg>
          )}
          {selectedOptionLabel || children || "Sort"}
          {showDirection && selectedOption && directionIcon}
        </button>

        {isOpen && (
          <div
            ref={menuRef}
            className={cn(
              "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
              {
                "mt-1": placement.startsWith("bottom"),
                "bottom-full mb-1": placement.startsWith("top"),
                "left-0": placement.endsWith("start"),
                "right-0": placement.endsWith("end"),
              },
              menuClassName
            )}
          >
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                  {
                    "opacity-50": option.disabled,
                    "bg-accent text-accent-foreground":
                      option.id === selectedOption,
                    "hover:bg-accent hover:text-accent-foreground":
                      !option.disabled && option.id !== selectedOption,
                  },
                  itemClassName
                )}
                disabled={option.disabled}
                onClick={() => !option.disabled && handleOptionClick(option.id)}
              >
                {option.icon && <span className="mr-2">{option.icon}</span>}
                {option.label}
                {option.id === selectedOption && (
                  <span className="ml-auto">{directionIcon}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

SortButton.displayName = "SortButton";

export { SortButton };

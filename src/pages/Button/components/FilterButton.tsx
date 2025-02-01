import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const filterButtonVariants = cva(
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

export interface FilterOption {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  multiple?: boolean;
}

interface FilterButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof filterButtonVariants> {
  groups: FilterGroup[];
  showIcon?: boolean;
  showSelectedCount?: boolean;
  menuClassName?: string;
  itemClassName?: string;
  maxHeight?: number;
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
  onFilterChange?: (groupId: string, selectedIds: string[]) => void;
}

const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  (
    {
      className,
      variant,
      size,
      groups,
      showIcon = true,
      showSelectedCount = true,
      menuClassName,
      itemClassName,
      maxHeight = 300,
      placement = "bottom-start",
      onFilterChange,
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedOptions, setSelectedOptions] = React.useState<
      Record<string, string[]>
    >(() => {
      const initial: Record<string, string[]> = {};
      groups.forEach((group) => {
        initial[group.id] = group.options
          .filter((option) => option.selected)
          .map((option) => option.id);
      });
      return initial;
    });

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

    const handleOptionClick = (groupId: string, optionId: string) => {
      setSelectedOptions((prev) => {
        const group = groups.find((g) => g.id === groupId);
        if (!group) return prev;

        const newSelected = [...(prev[groupId] || [])];
        const optionIndex = newSelected.indexOf(optionId);

        if (group.multiple) {
          if (optionIndex === -1) {
            newSelected.push(optionId);
          } else {
            newSelected.splice(optionIndex, 1);
          }
        } else {
          if (optionIndex === -1) {
            newSelected.splice(0, newSelected.length, optionId);
          } else {
            newSelected.splice(0, newSelected.length);
          }
        }

        onFilterChange?.(groupId, newSelected);
        return { ...prev, [groupId]: newSelected };
      });
    };

    const totalSelected = Object.values(selectedOptions).reduce(
      (sum, ids) => sum + ids.length,
      0
    );

    return (
      <div className="relative inline-block">
        <button
          ref={buttonRef}
          type="button"
          className={cn(
            filterButtonVariants({ variant, size }),
            "gap-2",
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
          {...props}
        >
          {showIcon && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
            </svg>
          )}
          {children || "Filter"}
          {showSelectedCount && totalSelected > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {totalSelected}
            </span>
          )}
        </button>

        {isOpen && (
          <div
            ref={menuRef}
            className={cn(
              "absolute z-50 min-w-[240px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
              {
                "mt-1": placement.startsWith("bottom"),
                "bottom-full mb-1": placement.startsWith("top"),
                "left-0": placement.endsWith("start"),
                "right-0": placement.endsWith("end"),
              },
              menuClassName
            )}
            style={{ maxHeight }}
          >
            <div className="overflow-y-auto p-2">
              {groups.map((group) => (
                <div key={group.id} className="mb-4 last:mb-0">
                  <div className="mb-2 text-sm font-medium">{group.label}</div>
                  <div className="space-y-1">
                    {group.options.map((option) => {
                      const isSelected = selectedOptions[group.id]?.includes(
                        option.id
                      );
                      return (
                        <button
                          key={option.id}
                          type="button"
                          className={cn(
                            "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                            {
                              "opacity-50": option.disabled,
                              "bg-accent text-accent-foreground": isSelected,
                              "hover:bg-accent hover:text-accent-foreground":
                                !option.disabled && !isSelected,
                            },
                            itemClassName
                          )}
                          disabled={option.disabled}
                          onClick={() =>
                            !option.disabled &&
                            handleOptionClick(group.id, option.id)
                          }
                        >
                          {option.icon && (
                            <span className="mr-2">{option.icon}</span>
                          )}
                          {option.label}
                          {isSelected && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="ml-auto h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

FilterButton.displayName = "FilterButton";

export { FilterButton };

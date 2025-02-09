import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { FilterButtonProps, labelWithId } from "./types/index";

const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ 
    className,
    variant = "outline",
    size = "default",
    filters = [],
    selectedFilters = [],
    onFilterChange,
    children,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const filterRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFilterToggle = (filterId: string) => {
      const newFilters = selectedFilters.includes(filterId)
        ? selectedFilters.filter((id:string) => id !== filterId)
        : [...selectedFilters, filterId];
      
      onFilterChange?.(newFilters);
    };

    const activeFiltersCount = selectedFilters.length;

    return (
      <div ref={filterRef} className="relative inline-block">
        <button
          ref={ref}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            buttonVariants({ variant, size }),
            "inline-flex items-center gap-2",
            activeFiltersCount > 0 && "ring-2 ring-primary",
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
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          {children || "Filter"}
          {activeFiltersCount > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 z-50 mt-2 min-w-[200px] rounded-md border bg-background p-2 shadow-lg">
            <div className="space-y-1">
              {filters.map((filter: any) => (
                <label
                  key={filter.id}
                  className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4"
                    checked={selectedFilters.includes(filter.id)}
                    onChange={() => handleFilterToggle(filter.id)}
                  />
                  {filter.label}
                </label>
              ))}
            </div>
            {filters.length === 0 && (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                No filters available
              </p>
            )}
            {selectedFilters.length > 0 && (
              <div className="mt-2 border-t pt-2">
                <button
                  onClick={() => onFilterChange?.([])}
                  className="w-full rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

FilterButton.displayName = "FilterButton";

export { FilterButton };

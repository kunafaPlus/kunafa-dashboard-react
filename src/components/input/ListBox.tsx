import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { ListBoxOption, ListBoxProps } from "./types/type";
import { listBoxVariants } from "./variants";


const ListBox = React.forwardRef<HTMLDivElement, ListBoxProps>(
  (
    {
      className,
      variant,
      size,
      options,
      value,
      onChange,
      multiple = false,
      disabled = false,
      loading = false,
      searchable = false,
      virtualScroll = false,
      itemHeight = 40,
      emptyMessage = "No options available",
      loadingMessage = "Loading...",
      renderOption,
      filterOption,
      compareOption,
      ...props
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = React.useState("");
    const [scrollTop, setScrollTop] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => containerRef.current!);

    const isSelected = (option: ListBoxOption): boolean => {
      if (!value) return false;
      if (multiple) {
        return (value as string[]).some((v) =>
          compareOption
            ? compareOption(option, v)
            : option.value === v
        );
      }
      return compareOption
        ? compareOption(option, value as string)
        : option.value === value;
    };

    const handleSelect = (option: ListBoxOption) => {
      if (disabled || option.disabled) return;

      if (multiple) {
        const currentValue = (value || []) as string[];
        const newValue = isSelected(option)
          ? currentValue.filter((v) =>
              compareOption
                ? !compareOption(option, v)
                : v !== option.value
            )
          : [...currentValue, option.value];
        onChange?.(newValue);
      } else {
        onChange?.(option.value);
      }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    };

    const filteredOptions = React.useMemo(() => {
      if (!searchValue) return options;
      return options.filter((option) =>
        filterOption
          ? filterOption(option, searchValue)
          : option.label
              .toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
      );
    }, [options, searchValue, filterOption]);

    const visibleOptions = React.useMemo(() => {
      if (!virtualScroll) return filteredOptions;

      const containerHeight = containerRef.current?.clientHeight || 0;
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight),
        filteredOptions.length
      );

      return filteredOptions.slice(startIndex, endIndex);
    }, [filteredOptions, virtualScroll, scrollTop, itemHeight]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    };

    const defaultRenderOption = (option: ListBoxOption) => (
      <div className="flex items-center px-3 py-2">
        {option.icon && (
          <span className="mr-2 text-muted-foreground">
            {option.icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="truncate">{option.label}</div>
          {option.description && (
            <div className="text-sm text-muted-foreground truncate">
              {option.description}
            </div>
          )}
        </div>
        {multiple && isSelected(option) && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 ml-2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    );

    return (
      <div
        ref={containerRef}
        className={cn(
          listBoxVariants({ variant, size }),
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onScroll={handleScroll}
        {...props}
      >
        {searchable && (
          <div className="sticky top-0 z-10 p-2 border-b bg-background">
            <input
              type="text"
              className="w-full px-3 py-2 text-sm bg-transparent border rounded-md outline-input-focus border-input-border"
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearch}
              disabled={disabled}
            />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
            {loadingMessage}
          </div>
        ) : filteredOptions.length === 0 ? (
          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div
            style={
              virtualScroll
                ? {
                    height: filteredOptions.length * itemHeight,
                    position: "relative",
                  }
                : undefined
            }
          >
            {visibleOptions.map((option, index) => (
              <div
                key={option.value}
                className={cn(
                  "transition-colors cursor-pointer",
                  isSelected(option)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent",
                  option.disabled &&
                    "opacity-50 cursor-not-allowed pointer-events-none"
                )}
                style={
                  virtualScroll
                    ? {
                        position: "absolute",
                        top:
                          (Math.floor(scrollTop / itemHeight) + index) *
                          itemHeight,
                        height: itemHeight,
                        width: "100%",
                      }
                    : undefined
                }
                onClick={() => handleSelect(option)}
              >
                {renderOption
                  ? renderOption(option)
                  : defaultRenderOption(option)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ListBox.displayName = "ListBox";

export { ListBox, type ListBoxOption };

import * as React from "react";
import { cn } from "../../utils/cn";
import { MultiSelectProps, Option } from "./types/type";
import { multiSelectVariants } from "./variants";



const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      className,
      variant,
      size,
      options,
      value: controlledValue,
      defaultValue = [],
      onChange,
      placeholder = "Select items...",
      disabled = false,
      maxItems,
      searchable = true,
      clearable = true,
      loading = false,
      error = false,
      grouped = false,
      chipVariant = "default",
      renderOption,
      label,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue || []);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const currentValue = Array.isArray(controlledValue) ? controlledValue : internalValue;

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    React.useEffect(() => {
      if (Array.isArray(controlledValue)) {
        setInternalValue(controlledValue);
      }
    }, [controlledValue]);

    const filteredOptions = React.useMemo(() => {
      let filtered = options.filter(
        (option:any) =>
          !option.disabled &&
          option.label.toLowerCase().includes(search.toLowerCase())
      );

      if (maxItems && currentValue.length >= maxItems) {
        filtered = filtered.filter((option:any) =>
          currentValue.includes(option.value)
        );
      }

      if (grouped) {
        const groups: Record<string, Option[]> = {};
        filtered.forEach((option:any) => {
          const group = option.group || "Other";
          if (!groups[group]) groups[group] = [];
          groups[group].push(option);
        });
        return groups;
      }

      return filtered;
    }, [options, search, maxItems, currentValue, grouped]);

    const handleSelect = (optionValue: string) => {
      const newValues = currentValue.includes(optionValue)
        ? currentValue.filter((v) => v !== optionValue)
        : [...currentValue, optionValue];
    
      setInternalValue(newValues);
    
      if (onChange) {
        const customEvent: any = {
          target: {
            value: newValues,
          },
        };
    
        onChange(customEvent);
      }
    };


    const getChipClass = () => {
      switch (chipVariant) {
        case "rounded":
          return "rounded-full";
        case "square":
          return "rounded-none";
        default:
          return "rounded-md";
      }
    };

    return (
      <div ref={containerRef} className={cn("relative space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div
        className={cn(
          multiSelectVariants({ variant, size }as {}),
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex flex-wrap gap-2 p-2">
          {currentValue.map(val => {
            const option = options.find((opt:any) => opt.value === val);
            return option ? ( 
              <span
                key={val}
                className={cn(
                  "bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1",
                  getChipClass()
                )}
              >
                {option.icon && <span>{option.icon}</span>}
                {option.label}
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className="cursor-pointer hover:text-primary/80"
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
          {searchable && (
            <input
              type="text"
              className="flex-1 min-w-[50px] outline-none bg-transparent"
              placeholder={currentValue.length === 0 ? placeholder : ""}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsOpen(true)}
            />
          )}
        </div>
      </div>
      {error && typeof error === 'string' && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {isOpen && !disabled && (
        <div className="cursor-pointer absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md bg-background shadow-xl border border-border-primary">
          {loading ? (
            <div className="p-2 text-center text-muted-foreground">
              Loading...
            </div>
          ) : grouped ? (
            Object.entries(filteredOptions as Record<string, Option[]>).map(
              ([group, options]) => (
                <div key={group}>
                  <div className="sticky top-0 bg-muted/50 px-2 py-1 text-sm font-medium">
                    {group}
                  </div>
                  {options.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "flex items-center px-2 py-1.5 hover:bg-accent",
                        currentValue.includes(option.value) &&
                          "bg-accent text-accent-foreground"
                      )}
                      onClick={() => handleSelect(option.value)}
                    >
                      {renderOption ? (
                        renderOption(option)
                      ) : (
                        <>
                          {option.icon && <span className="mr-2">{option.icon}</span>}
                          {option.label}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )
            )
          ) : (
            (filteredOptions as Option[]).map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-center px-2 py-1.5 hover:bg-accent",
                  currentValue.includes(option.value) &&
                    "bg-accent text-accent-foreground"
                )}
                onClick={() => handleSelect(option.value)}
              >
                {renderOption ? (
                  renderOption(option)
                ) : (
                  <>
                    {option.icon && <span className="mr-2">{option.icon}</span>}
                    {option.label}
                  </>
                )}
              </div>
            ))
          )}
          {(filteredOptions as Option[]).length === 0 && (
            <div className="p-2 text-center text-muted-foreground">
              No options found
            </div>
          )}
        </div>
      )}
    </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect, type Option };

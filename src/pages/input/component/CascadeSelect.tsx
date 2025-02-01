import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CascadeOption, CascadeSelectProps } from "../utils/type";
import { cn } from "../../../utils/cn";


export const cascadeSelectVariants = cva(
  "relative inline-flex flex-col gap-1 w-full ",
  {
    variants: {
      variant: {
        default: "",
        bordered: "p-1  rounded-md",
        ghost: "bg-muted/50",
      },
      size: {
        sm: "[&_select]:text-sm [&_select]:p-1",
        md: "[&_select]:text-base [&_select]:p-2",
        lg: "[&_select]:text-lg [&_select]:p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);



const CascadeSelect = React.forwardRef<HTMLDivElement, CascadeSelectProps>(
  (
    {
      className,
      variant,
      size,
      label,

      options,
      value = [],
      onChange,
      placeholder = ["Select..."],
      disabled = false,
      loading = false,
      showPath = false,
      clearable = true,
      searchable = false,
      error=false,
      ...props
    },
    ref
  ) => {
    const [selectedPath, setSelectedPath] = React.useState<CascadeOption[]>([]);
    const [searchValues, setSearchValues] = React.useState<string[]>([]);

    // Update selectedPath when value prop changes
    React.useEffect(() => {
      if (value.length > 0) {
        const path: CascadeOption[] = [];
        let currentOptions = options;

        for (const val of value) {
          const option = currentOptions.find((opt:any) => opt.value === val);
          if (option) {
            path.push(option);
            currentOptions = option.children || [];
          }
        }

        setSelectedPath(path);
      } else {
        setSelectedPath([]);
      }
    }, [value, options]); // Add options to the dependency array

    const getOptionsAtLevel = (level: number): CascadeOption[] => {
      if (level === 0) return options;

      let currentOptions = options;
      for (let i = 0; i < level; i++) {
        const selectedOption = selectedPath[i];
        if (selectedOption?.children) {
          currentOptions = selectedOption.children;
        } else {
          return [];
        }
      }
      return currentOptions;
    };

    const handleSelectChange = (level: number, newValue: string) => {
      if (disabled) return;

      const newPath = selectedPath.slice(0, level);
      const currentOptions = getOptionsAtLevel(level);
      const selectedOption = currentOptions.find(
        (opt) => opt.value === newValue
      );

      if (selectedOption) {
        newPath[level] = selectedOption;
        setSelectedPath(newPath);
        onChange?.(newPath.map((opt) => opt.value)); // Call onChange with selected values
      }
    };

    const handleSearch = (level: number, query: string) => {
      const newSearchValues = [...searchValues];
      newSearchValues[level] = query;
      setSearchValues(newSearchValues);
    };

    const filterOptions = (options: CascadeOption[], query: string) => {
      if (!query) return options;
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase())
      );
    };

    const handleClear = () => {
      setSelectedPath([]);
      setSearchValues([]);
      onChange?.([]); // Clear the selection
    };

    const getLevels = () => {
      const levels: number[] = [0];
      let currentOptions = options;
      
      for (const option of selectedPath) {
        if (option?.children?.length) {
          currentOptions = option.children;
          levels.push(levels.length);
        } else {
          break;
        }
      }

      return levels;
    };

    return (
      <div
        ref={ref}
        className={cn(cascadeSelectVariants({ variant, size }as {variant: VariantProps<typeof cascadeSelectVariants>["variant"]; size: VariantProps<typeof cascadeSelectVariants>["size"]}), className)}
        {...props}
      >
        {label&& <p>{label}</p>}
        {showPath && selectedPath.length > 0 && (
          <div className="text-sm text-muted-foreground mb-2">
            {selectedPath.map((opt, i) => (
              <React.Fragment key={i}>
                {i > 0 && " / "}
                {opt.label}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {getLevels().map((level) => {
            const currentOptions = getOptionsAtLevel(level);
            const filteredOptions = filterOptions(
              currentOptions,
              searchValues[level] || ""
            );

            return (
              <div key={level} className="relative">
                {searchable && (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md mb-1"
                    placeholder={`Search ${placeholder[level] || "options"}...`}
                    value={searchValues[level] || ""}
                    onChange={(e) => handleSearch(level, e.target.value)}
                    disabled={disabled}
                  />
                )}

                <select
                  className="w-full appearance-none bg-transparent border rounded-md outline-input-focus border-input-border disabled:opacity-50"
                  value={selectedPath[level]?.value || ""}
                  onChange={(e) => handleSelectChange(level, e.target.value)}
                  disabled={disabled || loading}
                >
                  <option value="">
                    {placeholder[level] || placeholder[0]}
                  </option>
                  {filteredOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                {loading && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {clearable && selectedPath.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-sm text-muted-foreground hover:text-foreground mt-1"
            disabled={disabled}
          >
            Clear
          </button>
        )}
        {error&&<p className="text-red-500 -mt-2">{error}</p>}
      </div>
    );
  }
);

CascadeSelect.displayName = "CascadeSelect";

export { CascadeSelect, type CascadeOption };
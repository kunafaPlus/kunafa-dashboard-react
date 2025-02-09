import * as React from "react";
import { cn } from "../../utils/cn";
import { SelectProps } from "./types/type";
import { optionListVariants, selectVariants } from "./variants";




const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      options,
      placeholder,
      value,
      onChange,
      disabled,
      label,
      error,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState<unknown>(value);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue)
      setIsOpen(false);
      
      if (onChange) {
        const event = {
          target: { value: optionValue },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(event);
      }
    };

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
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const selectedOption = options.find((opt:any) => opt.value === selectedValue);

    return (
      <div ref={containerRef} className=" w-full relative inline-block">
        {label&&<p>{label}</p>}
        <div
          className={cn(
            selectVariants({ variant, size, fullWidth }as{}),
            "cursor-pointer",
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          role="combobox"
          aria-expanded={isOpen}
          aria-disabled={disabled}
        >
          <span className={!selectedValue ? "text-muted-foreground" : ""}>
            {selectedOption?.label || placeholder || "Select an option"}
          </span>
          <span className="pointer-events-none ml-2">↓</span>
        </div>

        {isOpen && !disabled && (
          <div className={optionListVariants()}>
            <div className="p-1">
              {options.map((option:any) => (
                <div
                  key={option.value}
                  className={cn(
                    "relative w-full flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    option.value === selectedValue && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        )}
        {error&&<p className="text-red-500 -mt-2">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select, selectVariants };

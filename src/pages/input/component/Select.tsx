import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { SelectProps } from "../utils/type";

 const selectVariants = cva(
  "flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-2",
        ghost: "border-none shadow-none",
        underline: "rounded-none border-t-0 border-l-0 border-r-0 px-0",
      },
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "w-[200px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: false,
    },
  }
);

export const optionListVariants = cva(
  "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  {
    variants: {
      position: {
        top: "bottom-full mb-2",
        bottom: "top-full mt-2",
      },
      align: {
        start: "left-0",
        center: "left-1/2 -translate-x-1/2",
        end: "right-0",
      },
    },
    defaultVariants: {
      position: "bottom",
      align: "start",
    },
  }
);



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

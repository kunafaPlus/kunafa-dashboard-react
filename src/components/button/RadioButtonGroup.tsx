import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { RadioButtonGroupProps, RadioButtonItemProps } from "./types";

// interface RadioButtonItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: "default" | "outline" | "secondary" | "ghost" | "link";
//   size?: "default" | "sm" | "lg";
//   value: string;
//   selected?: boolean;
//   className?: string;
// }

// interface RadioButtonGroupProps  {
//   orientation?: "horizontal" | "vertical";
//   value?: string;
//   defaultValue?: string;
//   onChange?: (value: string) => void;
//   name?: string;
//   className?: string;
//   children: React.ReactNode;
// }

const RadioButtonItem = React.forwardRef<HTMLButtonElement, RadioButtonItemProps>(
  ({ 
    className,
    variant = "default",
    size = "default",
    value,
    selected,
    children,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        role="radio"
        aria-checked={selected}
        className={cn(
          buttonVariants({ variant, size }),
          "relative",
          selected && "bg-primary text-primary-foreground",
          className
        )}
        {...props}
      >
        {children}
        {selected && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
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
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}
      </button>
    );
  }
);

RadioButtonItem.displayName = "RadioButtonItem";

const RadioButtonGroup = React.forwardRef<HTMLDivElement, RadioButtonGroupProps>(
  ({ 
    className,
    orientation = "horizontal",
    value,
    defaultValue,
    onChange,
    name,
    children,
    ...props 
  }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState<string>(
      typeof value !== 'undefined' ? value : (defaultValue ?? "")
    );

    React.useEffect(() => {
      if (typeof value !== 'undefined') {
        setSelectedValue(value);
      }
    }, [value]);

    const handleSelect = (newValue: string) => {
      if (typeof value === 'undefined') {
        setSelectedValue(newValue);
      }
      onChange?.(newValue);
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn(
          "flex gap-1",
          orientation === "vertical" ? "flex-col" : "flex-row",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;

          return React.cloneElement((child as any), {
            name,
            selected: child.props.value === selectedValue,
            onClick: () => handleSelect(child.props.value),
          });
        })}
      </div>
    );
  }
);

RadioButtonGroup.displayName = "RadioButtonGroup";

export { RadioButtonGroup, RadioButtonItem };

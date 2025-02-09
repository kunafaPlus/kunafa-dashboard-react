import * as React from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "./variants";
import { SegmentedButtonProps } from "./types";

interface SegmentedButtonItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string; // تغيير any إلى string أو أي نوع آخر مناسب
  selected?: boolean;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
}

const SegmentedButtonItem = React.forwardRef<HTMLButtonElement, SegmentedButtonItemProps>(
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
        role="tab"
        aria-selected={selected}
        className={cn(
          buttonVariants({ variant, size }),
          "relative rounded-none first:rounded-l-md last:rounded-r-md",
          selected && "bg-primary text-primary-foreground",
          "focus-visible:relative focus-visible:z-20",
          "-ml-px first:ml-0",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

SegmentedButtonItem.displayName = "SegmentedButtonItem";

const SegmentedButton = React.forwardRef<HTMLDivElement, SegmentedButtonProps>(
  ({ 
    className,
    value,
    defaultValue,
    onChange,
    fullWidth,
    children,
    ...props 
  }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState<string|unknown>(
      value !== undefined ? value : (defaultValue || "")
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    const handleSelect = (newValue: string) => {
      if (value === undefined) {
        setSelectedValue(newValue);
      }
      onChange?.(newValue);
    };

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          "inline-flex rounded-md border bg-muted p-1",
          fullWidth && "w-full",
          className
        )}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement<SegmentedButtonItemProps>(child)) return null;

          return React.cloneElement(child, {
            selected: child.props.value === selectedValue,
            onClick: () => handleSelect(child.props.value),
          });
        })}
      </div>
    );
  }
);

SegmentedButton.displayName = "SegmentedButton";

export { SegmentedButton, SegmentedButtonItem };
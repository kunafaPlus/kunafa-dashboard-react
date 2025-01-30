import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const switchTrackVariants = cva(
  "relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      size: {
        sm: "h-4 w-8",
        md: "h-5 w-10",
        lg: "h-6 w-12",
      },
      variant: {
        default: "bg-gray-300",
        primary: "bg-blue-500",
        success: "bg-green-500",
        danger: "bg-red-500",
        warning: "bg-yellow-500",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

const switchThumbVariants = cva(
  "inline-block rounded-full bg-white shadow-md transform transition-transform duration-200",
  {
    variants: {
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof switchTrackVariants> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      size,
      variant,
      label,
      checked,
      defaultChecked,
      onCheckedChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false);
    const id = React.useId();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        const newChecked = event.target.checked;
        setIsChecked(newChecked);
        onCheckedChange?.(newChecked); // Notify parent of the change
      }
    };

    // Use controlled state if checked prop is provided
    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    return (
      <div className="flex items-center gap-2">
        <label
          htmlFor={id}
          className={cn(
            "flex items-center cursor-pointer",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <div
            className={cn(
              switchTrackVariants({ size, variant }),
              className,
              isChecked && "bg-opacity-100",
              !isChecked && "bg-opacity-50"
            )}
          >
            <div
              className={cn(
                switchThumbVariants({ size }),
                isChecked
                  ? size === "sm"
                    ? "translate-x-4"
                    : size === "md"
                    ? "translate-x-5"
                    : "translate-x-6"
                  : "translate-x-0"
              )}
            />
          </div>
          {label && (
            <span className="ml-2 text-sm font-medium text-gray-700">
              {label}
            </span>
          )}
        </label>
        <input
          type="checkbox"
          id={id}
          ref={ref}
          checked={checked ?? isChecked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch}
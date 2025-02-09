import * as React from "react";
import { cn } from "../../utils/cn";
import { switchThumbVariants, switchTrackVariants } from "./variants";
import { SwitchProps } from "./types/type";




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
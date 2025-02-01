import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const switchButtonVariants = cva(
  "relative inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-input hover:bg-input/90",
        colored: "bg-primary hover:bg-primary/90",
      },
      size: {
        default: "h-6 w-11",
        sm: "h-5 w-9",
        lg: "h-7 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform",
  {
    variants: {
      size: {
        default: "h-5 w-5",
        sm: "h-4 w-4",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface SwitchButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof switchButtonVariants> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  thumbClassName?: string;
  activeColor?: string;
  inactiveColor?: string;
  icons?: {
    checked?: React.ReactNode;
    unchecked?: React.ReactNode;
  };
  label?: string;
  labelPlacement?: "start" | "end";
}

const SwitchButton = React.forwardRef<HTMLButtonElement, SwitchButtonProps>(
  (
    {
      className,
      variant,
      size,
      checked: checkedProp,
      defaultChecked = false,
      onChange,
      thumbClassName,
      activeColor,
      inactiveColor,
      icons,
      label,
      labelPlacement = "end",
      disabled,
      ...props
    },
    ref
  ) => {
    const [checkedState, setCheckedState] = React.useState(defaultChecked);
    const isChecked = checkedProp !== undefined ? checkedProp : checkedState;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        const newChecked = !isChecked;
        setCheckedState(newChecked);
        onChange?.(newChecked);
      }
      props.onClick?.(event);
    };

    const thumbOffset = React.useMemo(() => {
      switch (size) {
        case "sm":
          return "translate-x-4";
        case "lg":
          return "translate-x-7";
        default:
          return "translate-x-5";
      }
    }, [size]);

    const switchButton = (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-label={label}
        className={cn(
          switchButtonVariants({ variant, size }),
          isChecked && "bg-primary",
          className
        )}
        style={{
          backgroundColor: isChecked ? activeColor : inactiveColor,
        }}
        disabled={disabled}
        onClick={handleClick}
        {...props}
      >
        <span
          className={cn(
            switchThumbVariants({ size }),
            isChecked ? thumbOffset : "translate-x-0",
            thumbClassName
          )}
        >
          {icons && (
            <span className="flex h-full w-full items-center justify-center text-xs">
              {isChecked ? icons.checked : icons.unchecked}
            </span>
          )}
        </span>
      </button>
    );

    if (label) {
      return (
        <div className="flex items-center gap-2">
          {labelPlacement === "start" && (
            <span className="text-sm font-medium">{label}</span>
          )}
          {switchButton}
          {labelPlacement === "end" && (
            <span className="text-sm font-medium">{label}</span>
          )}
        </div>
      );
    }

    return switchButton;
  }
);

SwitchButton.displayName = "SwitchButton";

export { SwitchButton };

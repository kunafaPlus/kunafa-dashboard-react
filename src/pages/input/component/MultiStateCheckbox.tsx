import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const multiStateCheckboxVariants = cva(
  "inline-flex items-center justify-center rounded transition-colors outline-input-focus border-input-border focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-background border",
        filled: "bg-muted",
        ghost: "bg-transparent hover:bg-accent",
      },
      size: {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type CheckState = boolean | "indeterminate";

interface MultiStateCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange">,
    VariantProps<typeof multiStateCheckboxVariants> {
  value?: CheckState;
  onChange?: (value: CheckState) => void;
  icon?: React.ReactNode;
  indeterminateIcon?: React.ReactNode;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  states?: string[]; // إضافة خاصية states
}

const MultiStateCheckbox = React.forwardRef<HTMLInputElement, MultiStateCheckboxProps>(
  (
    {
      className,
      variant,
      size,
      value = false,
      onChange,
      icon,
      indeterminateIcon,
      label,
      description,
      error,
      disabled,
      states = ["معطل", "مفعل", "قيد المراجعة"], // القيم الافتراضية للحالات
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const [internalValue, setInternalValue] = React.useState<CheckState>(value);

    React.useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const handleClick = () => {
      if (disabled) return;

      let nextValue: CheckState = false;
      if (internalValue === false) {
        nextValue = true;
      } else if (internalValue === true) {
        nextValue = "indeterminate";
      } else {
        nextValue = false;
      }
      setInternalValue(nextValue);
      onChange?.(nextValue);
    };

    const renderIcon = () => {
      if (icon && internalValue === true) {
        return icon;
      }

      if (indeterminateIcon && internalValue === "indeterminate") {
        return indeterminateIcon;
      }

      if (internalValue === true) {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full p-[2px]"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      }

      if (internalValue === "indeterminate") {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full p-[2px]"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        );
      }

      return null;
    };

    return (
      <div className="inline-flex items-start gap-2">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="checkbox"
            className="sr-only"
            checked={internalValue === true}
            disabled={disabled}
            onChange={() => {}}
            {...props}
          />
          <div
            className={cn(
              multiStateCheckboxVariants({ variant, size }),
              internalValue === true && "bg-primary text-white border-primary",
              internalValue === "indeterminate" && "bg-primary/50 text-white border-primary/50",
              error && "border-destructive",
              className
            )}
            onClick={handleClick}
            role="checkbox"
            aria-checked={internalValue === "indeterminate" ? "mixed" : internalValue}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                handleClick();
              }
            }}
          >
            {renderIcon()}
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  disabled && "cursor-not-allowed opacity-70"
                )}
                onClick={disabled ? undefined : handleClick}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

MultiStateCheckbox.displayName = "MultiStateCheckbox";

export { MultiStateCheckbox, type CheckState };
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const iconFieldVariants = cva(
  "relative inline-flex items-center w-full group",
  {
    variants: {
      variant: {
        default: "[&_input]:border [&_input]:rounded-md",
        filled: "[&_input]:bg-muted [&_input]:border-b",
        ghost: "[&_input]:bg-transparent [&_input]:border-b",
      },
      size: {
        sm: "[&_input]:text-sm [&_input]:p-2 [&_svg]:w-4 [&_svg]:h-4",
        md: "[&_input]:text-base [&_input]:p-3 [&_svg]:w-5 [&_svg]:h-5",
        lg: "[&_input]:text-lg [&_input]:p-4 [&_svg]:w-6 [&_svg]:h-6",
      },
      iconPosition: {
        left: "",
        right: "flex-row-reverse",
        both: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      iconPosition: "left",
    },
  }
);

interface IconFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof iconFieldVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  hint?: string;
  iconClassName?: string;
  containerClassName?: string;
  loading?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  iconClickable?: boolean;
  onIconClick?: (position: "left" | "right") => void;
  placeholderSpacing?: string; // New prop for custom placeholder spacing
}

const IconField = React.forwardRef<HTMLInputElement, IconFieldProps>(
  (
    {
      className,
      containerClassName,
      iconClassName,
      variant,
      size,
      iconPosition,
      leftIcon,
      rightIcon,
      error,
      hint,
      loading,
      clearable,
      onClear,
      iconClickable,
      onIconClick,
      disabled,
      value,
      placeholderSpacing = "10", // Default spacing for placeholder
      ...props
    },
    ref
  ) => {
    const handleIconClick = (position: "left" | "right") => {
      if (iconClickable && onIconClick) {
        onIconClick(position);
      }
    };

    const renderIcon = (
      icon: React.ReactNode,
      position: "left" | "right"
    ) => {
      if (!icon) return null;

      return (
        <div
          className={cn(
            "absolute flex items-center justify-center transition-colors",
            position === "left" ? "left-3" : "right-3", // الأيقونة تبقى في مكانها
            iconClickable &&
              "cursor-pointer hover:text-primary active:scale-95",
            disabled && "opacity-50 cursor-not-allowed",
            iconClassName
          )}
          onClick={() => !disabled && handleIconClick(position)}
        >
          {icon}
        </div>
      );
    };

    const renderClearButton = () => {
      if (!clearable || !value || disabled) return null;

      return (
        <button
          type="button"
          className={cn(
            "absolute right-3 p-1 rounded-full hover:bg-muted transition-colors",
            rightIcon && "right-10"
          )}
          onClick={onClear}
          aria-label="Clear input"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      );
    };

    const renderLoadingSpinner = () => {
      if (!loading) return null;

      return (
        <div
          className={cn(
            "absolute right-3 flex items-center justify-center",
            rightIcon && "right-10",
            clearable && value && "right-16"
          )}
        >
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
        </div>
      );
    };

    return (
      <div className="w-full">
        <div
          className={cn(
            iconFieldVariants({ variant, size, iconPosition }),
            containerClassName
          )}
        >
          {renderIcon(leftIcon, "left")}
          <input
            ref={ref}
            {...props}
            className={cn(
              "w-full bg-transparent transition-all duration-200 outline-input-focus border-input-border disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && `pl-${placeholderSpacing}`, // إضافة padding للنص النائب عند وجود أيقونة يسار
              rightIcon && `pr-10`, // إضافة padding للنص عند وجود أيقونة يمين
              clearable && value && `pr-16`,
              loading && `pr-16`,
              loading && clearable && value && `pr-24`,
              error && "border-destructive focus:ring-destructive",
              className
            )}
            disabled={disabled}
            value={value}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined
            }
            style={{
              // إضافة padding للنص النائب فقط
              ...(leftIcon && {
                paddingLeft: `calc(${placeholderSpacing} * 0.25rem)`,
              }),
            }}
          />
          {renderLoadingSpinner()}
          {renderClearButton()}
          {renderIcon(rightIcon, "right")}
        </div>

        {(error || hint) && (
          <div
            className={cn(
              "mt-1 text-sm",
              error ? "text-destructive" : "text-muted-foreground"
            )}
            id={
              error
                ? `${props.id}-error`
                : hint
                ? `${props.id}-hint`
                : undefined
            }
          >
            {error || hint}
          </div>
        )}
      </div>
    );
  }
);

IconField.displayName = "IconField";

export { IconField };
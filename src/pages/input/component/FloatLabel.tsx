import * as React from "react";
import { cva } from "class-variance-authority";
import {  FloatLabelProps } from "../utils/type";
import { cn } from "../../../utils/cn";

export const floatLabelVariants = cva(
  "relative inline-block w-full",
  {
    variants: {
      variant: {
        default: "[&_input]:border [&_input]:rounded-md",
        filled: "[&_input]:bg-muted [&_input]:border-b [&_input]:rounded-t-md",
        ghost: "[&_input]:bg-transparent [&_input]:border-b",
      },
      size: {
        sm: "[&_input]:text-sm [&_input]:p-2 [&_label]:text-xs",
        md: "[&_input]:text-base [&_input]:p-3 [&_label]:text-sm",
        lg: "[&_input]:text-lg [&_input]:p-4 [&_label]:text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);



const FloatLabel = React.forwardRef<HTMLInputElement, FloatLabelProps>(
  (
    {
      className,
      containerClassName,
      variant,
      size,
      label,
      error,
      hint,
      startIcon,
      endIcon,
      required,
      disabled,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);
    const [hasContent, setHasContent] = React.useState(
      Boolean(value || defaultValue)
    );

    React.useEffect(() => {
      setHasContent(Boolean(value));
    }, [value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasContent(Boolean(e.target.value));
      props.onChange?.(e);
    };

    return (
      <div
        className={cn(
          floatLabelVariants({ variant, size }),
          containerClassName
        )}
      >
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {startIcon}
            </div>
          )}

          <input
            ref={ref}
            {...props}
            className={cn(
              "w-full bg-transparent transition-all duration-200 outline-input-focus border-input-border disabled:opacity-50 disabled:cursor-not-allowed",
              startIcon && "pl-10",
              error && "border-red-500",
              endIcon && "pr-10",
              error && "border-red-500 focus:ring-destructive",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${props.id}-error` : undefined}
          />

          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {endIcon}
            </div>
          )}

          <label
            htmlFor={props.id}
            className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none",
              startIcon && "left-10",
              (focused || hasContent) &&
                "transform -translate-y-[calc(100%+4px)] text-primary",
              !focused &&
                !hasContent &&
                "top-1/2 -translate-y-1/2 text-muted-foreground",
              error && "text-red-500",
              disabled && "opacity-50"
            )}
          >
            {label}
            {required && (
              <span className="text-destructive ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        </div>

        {(error || hint) && (
          <div
            className={cn(
              "mt-1 text-sm",
              error ? "text-red-500" : "text-muted-foreground"
            )}
            id={error ? `${props.id}-error` : undefined}
          >
            {error || hint}
          </div>
        )}
      </div>
    );
  }
);

FloatLabel.displayName = "FloatLabel";

export { FloatLabel };

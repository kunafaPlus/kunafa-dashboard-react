import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const inputMaskVariants = cva(
  "w-full transition-colors outline-input-focus border-input-border disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "border rounded-md",
        filled: "bg-muted border-b",
        ghost: "bg-transparent border-b",
      },
      size: {
        sm: "text-sm p-2",
        md: "text-base p-3",
        lg: "text-lg p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type MaskType =
  | "numeric"
  | "decimal"
  | "currency"
  | "percentage"
  | "email"
  | "phone"
  | "date"
  | "time"
  | "creditCard"
  | "custom";

interface InputMaskProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputMaskVariants> {
  maskType?: MaskType;
  mask?: string;
  prefix?: string;
  suffix?: string;
  decimalSeparator?: string;
  thousandSeparator?: string;
  precision?: number;
  error?: string;
  hint?: string;
}

const InputMask = React.forwardRef<HTMLInputElement, InputMaskProps>(
  (
    {
      className,
      variant,
      size,
      maskType = "custom",
      mask,
      prefix,
      suffix,
      decimalSeparator = ".",
      thousandSeparator = ",",
      precision = 2,
      error,
      hint,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState("");
    const [caretPosition, setCaretPosition] = React.useState(0);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const getMaskPattern = (): string => {
      if (mask) return mask;

      switch (maskType) {
        case "numeric":
          return "9".repeat(20);
        case "decimal":
          return `9{0,}${decimalSeparator}9{${precision}}`;
        case "currency":
          return `${prefix || "$"}9{0,}${decimalSeparator}9{${precision}}`;
        case "percentage":
          return `9{0,}${decimalSeparator}9{${precision}}%`;
        case "email":
          return "*{1,}@*{1,}.*{2,}";
        case "phone":
          return "(999) 999-9999";
        case "date":
          return "99/99/9999";
        case "time":
          return "99:99";
        case "creditCard":
          return "9999 9999 9999 9999";
        default:
          return mask || "";
      }
    };

    const formatValue = (input: string): string => {
      let formatted = input;

      switch (maskType) {
        case "numeric":
          formatted = formatted.replace(/\D/g, "");
          break;

        case "decimal":
        case "currency":
        case "percentage":
          formatted = formatted
            .replace(new RegExp(`[^0-9${decimalSeparator}]`, "g"), "")
            .replace(
              new RegExp(`${decimalSeparator}(\\d{${precision}}).*`),
              `${decimalSeparator}$1`
            );

          if (thousandSeparator) {
            const parts = formatted.split(decimalSeparator);
            parts[0] = parts[0].replace(
              /\B(?=(\d{3})+(?!\d))/g,
              thousandSeparator
            );
            formatted = parts.join(decimalSeparator);
          }

          if (prefix) formatted = prefix + formatted;
          if (suffix) formatted = formatted + suffix;
          if (maskType === "percentage") formatted = formatted + "%";
          break;

        case "phone":
          formatted = formatted
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
          break;

        case "date":
          formatted = formatted
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
          break;

        case "time":
          formatted = formatted
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d{2})/, "$1:$2");
          break;

        case "creditCard":
          formatted = formatted
            .replace(/\D/g, "")
            .replace(/(\d{4})(?=\d)/g, "$1 ");
          break;

        case "custom":
          if (mask) {
            let maskIndex = 0;
            formatted = "";
            for (let i = 0; i < mask.length && maskIndex < input.length; i++) {
              if (mask[i] === "9") {
                if (/\d/.test(input[maskIndex])) {
                  formatted += input[maskIndex];
                  maskIndex++;
                }
              } else if (mask[i] === "a") {
                if (/[a-zA-Z]/.test(input[maskIndex])) {
                  formatted += input[maskIndex];
                  maskIndex++;
                }
              } else if (mask[i] === "*") {
                formatted += input[maskIndex];
                maskIndex++;
              } else {
                formatted += mask[i];
              }
            }
          }
          break;
      }

      return formatted;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = formatValue(e.target.value);
      setDisplayValue(newValue);
      setCaretPosition(e.target.selectionStart || 0);

      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: newValue,
          },
        };
        onChange(syntheticEvent);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      let finalValue = displayValue;

      // Additional formatting on blur if needed
      if (maskType === "decimal" || maskType === "currency") {
        const parts = finalValue.split(decimalSeparator);
        if (parts.length === 1) {
          finalValue += `${decimalSeparator}${"0".repeat(precision)}`;
        } else if (parts[1].length < precision) {
          finalValue += "0".repeat(precision - parts[1].length);
        }
      }

      setDisplayValue(finalValue);

      if (onBlur) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: finalValue,
          },
        };
        onBlur(syntheticEvent);
      }
    };

    React.useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(formatValue(value.toString()));
      }
    }, [value]);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(caretPosition, caretPosition);
      }
    }, [caretPosition]);

    return (
      <div className="w-full">
        <input
          ref={inputRef}
          type="text"
          className={cn(
            inputMaskVariants({ variant, size }),
            error && "border-destructive focus:ring-destructive",
            className
          )}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          {...props}
        />
        {(error || hint) && (
          <div
            className={cn(
              "mt-1 text-sm",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {error || hint}
          </div>
        )}
      </div>
    );
  }
);

InputMask.displayName = "InputMask";

export { InputMask, type MaskType };

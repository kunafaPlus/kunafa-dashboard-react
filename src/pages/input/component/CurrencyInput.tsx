import React from "react";

import { FormError } from "./FormError";
import { InputWrapper, Label, StyledInput } from "../utils/styles";
import { cn } from "../../../utils/cn";

interface CurrencyInputProps  {
  variant?: string; // Define specific variants if needed
  size?: string; // Define specific sizes if needed
  value?: number | null; // Value should be a number or null
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  currencySymbol?: string;
  currencyCode?: string;
  locale?: string;
  precision?: number;
  min?: number;
  max?: number;
  step?: number;
  allowNegative?: boolean;
  showPrefix?: boolean;
  showSuffix?: boolean;
  error?: string;
  hint?: string;
  formatOptions?: Intl.NumberFormatOptions;
  onValueChange?: (value: { float: number | null; formatted: string }) => void;
  disabled?: boolean;
  label?: string;
  name?: string;
  className?: string;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      className,
      variant,
      size,
      value,
      onChange,
      currencySymbol = "SAR",
      currencyCode = "SAR",
      locale = "ar-SA",
      precision = 2,
      min,
      max,
      step = 0.01,
      allowNegative = false,
      showPrefix = true,
      showSuffix = false,
      error,
      hint,
      formatOptions,
      onValueChange,
      disabled,
      label,
      name,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const formatter = React.useMemo(
      () =>
        new Intl.NumberFormat(locale, {
          style: "currency",
          currency: currencyCode,
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
          ...formatOptions,
        }),
      [locale, currencyCode, precision, formatOptions]
    );

    const parse = (value: string): number | null => {
      const digits = value.replace(/[^\d.-]/g, "");
      if (!digits) return null;

      let number = parseFloat(digits) / Math.pow(10, precision);
      if (isNaN(number)) return null;

      if (!allowNegative) {
        number = Math.abs(number);
      }

      if (typeof min === "number") {
        number = Math.max(number, min);
      }

      if (typeof max === "number") {
        number = Math.min(number, max);
      }

      return number;
    };

    const format = (value: number | null): string => {
      if (value === null) return "";

      const formatted = formatter.format(value);
      if (!showPrefix) {
        return formatted.replace(/^[^\d]*/, "");
      }
      if (!showSuffix) {
        return formatted.replace(/[^\d.]*$/, "");
      }
      return formatted;
    };

    // Update input value when prop value changes
    React.useEffect(() => {
      if (!focused) {
        setInputValue(format(value ?? null));
      }
    }, [value, focused]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const parsedValue = parse(rawValue);
    
      // Keep the raw input while focused
      setInputValue(rawValue);
    
      // Create a synthetic event that matches React.ChangeEvent<HTMLInputElement>
      const syntheticEvent: React.ChangeEvent<HTMLInputElement> = {
        target: {
          value: parsedValue === null ? '' : parsedValue.toString(),
          name,
          type: 'text', // Change to 'text' since we're dealing with a currency input
        },
        currentTarget: {
          value: parsedValue === null ? '' : parsedValue.toString(),
          name,
          type: 'text',
        },
        bubbles: true,
        cancelable: true,
        defaultPrevented: false,
        isTrusted: true,
        // You can add more properties if needed, but these are the essential ones
      } as React.ChangeEvent<HTMLInputElement>;

      // Call the original onChange if provided
      if (onChange) {
        onChange(syntheticEvent); // Pass the synthetic event
      }
    
      if (onValueChange) {
        onValueChange({
          float: parsedValue,
          formatted: format(parsedValue),
        });
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      props.onFocus?.(e); // Safe to call because onFocus is now part of props
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      const parsedValue = parse(inputValue);
      setInputValue(format(parsedValue));
      props.onBlur?.(e); // Safe to call because onBlur is now part of props
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
    
      // Handle up/down arrow keys
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const parsedValue = parse(inputValue) ?? 0;
        const delta = e.key === "ArrowUp" ? step : -step;
        const newValue = parsedValue + delta;
    
        if (
          (typeof min === "number" && newValue < min) ||
          (typeof max === "number" && newValue > max)
        ) {
          return;
        }
    
        const formattedValue = format(newValue);
        setInputValue(formattedValue);
    
        // Create a synthetic event
        const syntheticEvent: React.ChangeEvent<HTMLInputElement> = {
          target: {
            value: newValue.toString(),
            name: name || '',
            type: 'text',
          },
          currentTarget: {
            value: newValue.toString(),
            name: name || '',
            type: 'text',
          },
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
          isTrusted: true,
        } as React.ChangeEvent<HTMLInputElement>;
    
        // Call the original onChange if provided
        onChange?.(syntheticEvent);
    
        if (onValueChange) {
          onValueChange({
            float: newValue,
            formatted: formattedValue,
          });
        }
      }
    
      props.onKeyDown?.(e); // Safe to call because onKeyDown is now part of props
    };

    return (
      <InputWrapper>
        {label && <Label>{label}</Label>}
        <div className={cn({ variant, size }, className)}>
          <div className="relative">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {currencySymbol}
            </div>
            <StyledInput
              ref={inputRef}
              type="text"
              name={name}
              inputMode="decimal"
              value={inputValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              aria-invalid={!!error}
              {...props}
            />
          </div>
          <FormError error={error} />
        </div>
      </InputWrapper>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
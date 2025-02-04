import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';
import { InputNumberProps } from '../utils/type';

export const inputNumberVariants = cva('relative inline-flex w-full', {
  variants: {
    variant: {
      default: '[&_input]:border [&_input]:rounded-md',
      filled: '[&_input]:bg-muted [&_input]:border-b',
      ghost: '[&_input]:bg-transparent [&_input]:border-b',
    },
    size: {
      sm: '[&_input]:text-sm [&_input]:p-2 [&_button]:text-sm',
      md: '[&_input]:text-base [&_input]:p-3 [&_button]:text-base',
      lg: '[&_input]:text-lg [&_input]:p-4 [&_button]:text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      className,
      variant,
      size,
      value,
      onChange,
      label,
      error,
      min,
      max,
      step = 1,
      controls = true,
      format = String,
      parse = Number,
      precision = 0,
      prefix,
      suffix,
      showButtons = true,
      buttonPlacement = 'right',
      locale = 'en-US',
      hint,
      disabled,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<string>(
      value !== undefined ? format(value) : ''
    );
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(format(value));
      }
    }, [value, format]);

    const updateValue = (newValue: number) => {
      if (min !== undefined && newValue < min) {
        newValue = min;
      }
      if (max !== undefined && newValue > max) {
        newValue = max;
      }

      if (onChange) {
        onChange({
          target: {
            value: newValue,
          },
        });
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setInternalValue(inputValue);

      if (inputValue === '') {
        if (onChange) {
          onChange({
            target: {
              value: 0,
            },
          });
        }
        return;
      }

      const parsedValue = parse(inputValue);
      if (!isNaN(parsedValue)) {
        updateValue(parsedValue);
      }
    };

    const handleBlur = () => {
      setFocused(false);
      if (value !== undefined) {
        setInternalValue(format(value));
      }
    };

    const handleFocus = () => {
      setFocused(true);
      if (value !== undefined) {
        setInternalValue(format(value));
      }
    };

    const handleIncrement = () => {
      if (disabled) return;
      const currentValue = parse(internalValue) || 0;
      updateValue(currentValue + step);
    };

    const handleDecrement = () => {
      if (disabled) return;
      const currentValue = parse(internalValue) || 0;
      updateValue(currentValue - step);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleIncrement();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleDecrement();
      }
    };

    const renderButton = (
      type: 'increment' | 'decrement',
      placement: 'right' | 'left' | 'top' | 'bottom'
    ) => {
      const isIncrement = type === 'increment';
      const baseClasses =
        'flex items-center justify-center transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed';
      const placementClasses = {
        right: 'px-2 border-l',
        left: 'px-2 border-r',
        top: 'py-1 border-b',
        bottom: 'py-1 border-t',
      };

      return (
        <button
          type="button"
          className={cn(baseClasses, placementClasses[placement], 'bg-primary text-white')}
          onClick={isIncrement ? handleIncrement : handleDecrement}
          disabled={
            disabled ||
            (isIncrement
              ? max !== undefined && parse(internalValue) >= max
              : min !== undefined && parse(internalValue) <= min)
          }
          tabIndex={-1}
        >
          {isIncrement ? '+' : '-'}
        </button>
      );
    };

    return (
      <div className="space-y-2">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            className={cn(
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50',
              error && 'border-red-500',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            value={prefix ? `${prefix}${internalValue}` : internalValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            {...props}
          />
          {controls && (
            <div className="absolute inset-y-0 right-0 flex">
              {buttonPlacement === 'sides' && showButtons && (
                <div className="absolute left-0 inset-y-0">{renderButton('decrement', 'left')}</div>
              )}

              {buttonPlacement === 'stacked' && showButtons && (
                <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col">
                  {renderButton('increment', 'top')}
                  {renderButton('decrement', 'bottom')}
                </div>
              )}

              {buttonPlacement === 'right' && showButtons && (
                <div className="absolute right-0 inset-y-0">
                  {renderButton('increment', 'right')}
                </div>
              )}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      </div>
    );
  }
);

InputNumber.displayName = 'InputNumber';

export { InputNumber };

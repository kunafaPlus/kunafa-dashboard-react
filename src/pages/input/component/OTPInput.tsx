import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';
import { OTPInputProps } from '../utils/type';

const otpInputVariants = cva('flex items-center justify-center gap-2', {
  variants: {
    variant: {
      default: '',
      bordered: 'p-4 border rounded-lg',
      ghost: 'p-4 bg-muted/50 rounded-lg',
    },
    size: {
      sm: '[&_input]:w-8 [&_input]:h-8 [&_input]:text-lg',
      md: '[&_input]:w-10 [&_input]:h-10 [&_input]:text-xl',
      lg: '[&_input]:w-12 [&_input]:h-12 [&_input]:text-2xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  (
    {
      className,
      value = '',
      onChange,
      length = 6,
      label,
      error,
      autoFocus = false,
      disabled = false,
      pattern = /^[0-9]$/,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string[]>(
      value.split('').slice(0, length).concat(Array(length).fill('')).slice(0, length)
    );
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    React.useEffect(() => {
      if (value) {
        setInternalValue(
          value.split('').slice(0, length).concat(Array(length).fill('')).slice(0, length)
        );
      }
    }, [value, length]);

    const focusInput = (index: number) => {
      if (index < 0) index = 0;
      if (index >= length) index = length - 1;
      inputRefs.current[index]?.focus();
    };

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (disabled) return;

      // Allow only one character that matches the pattern
      if (newValue && !pattern.test(newValue[newValue.length - 1])) return;

      const newInternalValue = [...internalValue];
      newInternalValue[index] = newValue.slice(-1);
      setInternalValue(newInternalValue);

      if (onChange) {
        onChange({
          target: {
            value: newInternalValue.join(''),
          },
        });
      }

      // Auto focus next input
      if (newValue) {
        focusInput(index + 1);
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        const newInternalValue = [...internalValue];
        newInternalValue[index] = '';
        setInternalValue(newInternalValue);

        if (onChange) {
          onChange({
            target: {
              value: newInternalValue.join(''),
            },
          });
        }

        focusInput(index - 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusInput(index + 1);
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      if (disabled) return;

      const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
      const validChars = pastedData.split('').filter((char) => pattern.test(char));
      const newInternalValue = [...validChars, ...Array(length).fill('')].slice(0, length);

      setInternalValue(newInternalValue);
      if (onChange) {
        onChange({
          target: {
            value: newInternalValue.join(''),
          },
        });
      }
    };

    return (
      <div ref={ref} className="space-y-2">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <div className={cn('flex gap-2', disabled && 'opacity-50', className)}>
          {Array.from({ length }).map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              className={cn(
                'w-10 h-12 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50',
                error && 'border-red-500',
                disabled && 'cursor-not-allowed'
              )}
              value={internalValue[index]}
              onChange={(e) => { handleChange(index, e); }}
              onKeyDown={(e) => { handleKeyDown(index, e); }}
              onPaste={handlePaste}
              disabled={disabled}
              autoFocus={autoFocus && index === 0}
              {...props}
            />
          ))}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

OTPInput.displayName = 'OTPInput';

export { OTPInput, otpInputVariants };

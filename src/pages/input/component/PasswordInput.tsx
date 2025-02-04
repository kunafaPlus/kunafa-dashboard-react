import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import zxcvbn from 'zxcvbn';

import { cn } from '../../../utils/cn';


const passwordInputVariants = cva('w-full', {
  variants: {
    variant: {
      default: 'border rounded-lg',
      filled: 'bg-muted border-transparent',
      ghost: 'border-transparent',
    },
    size: {
      sm: 'text-sm py-1 px-2',
      md: 'text-base py-2 px-3',
      lg: 'text-lg py-3 px-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

interface PasswordStrength {
  score: number;
  feedback: {
    warning: string;
    suggestions: string[];
  };
}

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof passwordInputVariants> {
  error?: string;
  hint?: string;
  showStrengthMeter?: boolean;
  showToggle?: boolean;
  showGenerator?: boolean;
  minLength?: number;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  onStrengthChange?: (strength: PasswordStrength) => void;
}

const generatePassword = (options: {
  length: number;
  numbers: boolean;
  special: boolean;
  upper: boolean;
  lower: boolean;
}): string => {
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';

  let chars = '';
  if (options.numbers) chars += numbers;
  if (options.special) chars += special;
  if (options.upper) chars += upper;
  if (options.lower) chars += lower;

  if (!chars) chars = lower + upper + numbers;

  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Ensure at least one character from each required set
  const requiredChars = [];
  if (options.numbers)
    requiredChars.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
  if (options.special)
    requiredChars.push(special.charAt(Math.floor(Math.random() * special.length)));
  if (options.upper) requiredChars.push(upper.charAt(Math.floor(Math.random() * upper.length)));
  if (options.lower) requiredChars.push(lower.charAt(Math.floor(Math.random() * lower.length)));

  for (let i = 0; i < requiredChars.length; i++) {
    const pos = Math.floor(Math.random() * options.length);
    password = password.slice(0, pos) + requiredChars[i] + password.slice(pos + 1);
  }

  return password;
};

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      variant,
      size,
      error,
      hint,
      showStrengthMeter = true,
      showToggle = true,
      showGenerator = true,
      minLength = 8,
      requireNumbers = true,
      requireSpecialChars = true,
      requireUppercase = true,
      requireLowercase = true,
      onStrengthChange,
      onChange,
      value,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [strength, setStrength] = React.useState<PasswordStrength>({
      score: 0,
      feedback: { warning: '', suggestions: [] },
    });

    const validatePassword = (password: string) => {
      if (!password) return true;

      const hasMinLength = password.length >= minLength;
      const hasNumbers = !requireNumbers || /\d/.test(password);
      const hasSpecial = !requireSpecialChars || /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const hasUpper = !requireUppercase || /[A-Z]/.test(password);
      const hasLower = !requireLowercase || /[a-z]/.test(password);

      return hasMinLength && hasNumbers && hasSpecial && hasUpper && hasLower;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const password = e.target.value;
      const result = zxcvbn(password);
      const newStrength = {
        score: result.score,
        feedback: result.feedback,
      };

      setStrength(newStrength);
      onStrengthChange?.(newStrength);
      onChange?.(e);
    };

    const handleGeneratePassword = () => {
      const password = generatePassword({
        length: minLength,
        numbers: requireNumbers,
        special: requireSpecialChars,
        upper: requireUppercase,
        lower: requireLowercase,
      });

      const event = {
        target: { value: password },
      } as React.ChangeEvent<HTMLInputElement>;

      handleChange(event);
    };

    const getStrengthColor = (score: number) => {
      switch (score) {
        case 0:
          return 'bg-destructive';
        case 1:
          return 'bg-destructive/75';
        case 2:
          return 'bg-yellow-500';
        case 3:
          return 'bg-green-500/75';
        case 4:
          return 'bg-green-500';
        default:
          return 'bg-muted';
      }
    };

    return (
      <div className="space-y-1.5">
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={cn(
              passwordInputVariants({ variant, size }),
              'pr-20 bg-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-destructive focus:ring-destructive',
              className
            )}
            onChange={handleChange}
            value={value}
            disabled={disabled}
            {...props}
          />

          <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
            {showGenerator && (
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="p-1 text-muted-foreground hover:text-foreground"
                disabled={disabled}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            {showToggle && (
              <button
                type="button"
                onClick={() => { setShowPassword(!showPassword); }}
                className="p-1 text-muted-foreground hover:text-foreground"
                disabled={disabled}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
                      clipRule="evenodd"
                    />
                    <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    <path
                      fillRule="evenodd"
                      d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        {showStrengthMeter && value && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    index <= strength.score ? getStrengthColor(strength.score) : 'bg-muted'
                  )}
                />
              ))}
            </div>

            {(strength.feedback.warning || strength.feedback.suggestions.length > 0) && (
              <div className="text-sm space-y-1">
                {strength.feedback.warning && (
                  <p className="text-destructive">{strength.feedback.warning}</p>
                )}
                {strength.feedback.suggestions.map((suggestion, index) => (
                  <p key={index} className="text-muted-foreground">
                    {suggestion}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {!validatePassword(value as string) && (
          <div className="text-sm text-destructive">
            Password must:
            {minLength > 0 && (
              <span className="block">- Be at least {minLength} characters long</span>
            )}
            {requireNumbers && <span className="block">- Contain at least one number</span>}
            {requireSpecialChars && (
              <span className="block">- Contain at least one special character</span>
            )}
            {requireUppercase && (
              <span className="block">- Contain at least one uppercase letter</span>
            )}
            {requireLowercase && (
              <span className="block">- Contain at least one lowercase letter</span>
            )}
          </div>
        )}

        {(error || hint) && (
          <div className={cn('text-sm', error ? 'text-destructive' : 'text-muted-foreground')}>
            {error || hint}
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };

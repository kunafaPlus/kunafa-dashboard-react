import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { PasswordProps } from "./types/type";



const defaultStrengthLevels = [
  {
    label: "ضعيف",
    color: "bg-red-500",
    regex: /^.{1,7}$/,
  },
  {
    label: "متوسط",
    color: "bg-yellow-500",
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  },
  {
    label: "قوي",
    color: "bg-green-500",
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
];

const Password = React.forwardRef<HTMLInputElement, PasswordProps>(
  ({ 
    className,
    variant,
    size,
    value = "",
    onChange,
    label,
    error,
    showToggle = true,
    showStrength = true,
    strengthLevels = defaultStrengthLevels,
    hint,
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [strength, setStrength] = React.useState(0);

    React.useEffect(() => {
      if (!value) {
        setStrength(0);
        return;
      }

      for (let i = strengthLevels.length - 1; i >= 0; i--) {
        if (strengthLevels[i].regex.test(value)) {
          setStrength(i + 1);
          return;
        }
      }
      setStrength(0);
    }, [value, strengthLevels]);

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={cn(
              "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50",
              error && "border-red-500",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            value={value}
            onChange={onChange}
            disabled={disabled}
            {...props}
          />
          {showToggle && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          )}
        </div>
        {showStrength && value && (
          <div className="space-y-1">
            <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  strength > 0 && strengthLevels[strength - 1].color
                )}
                style={{ width: `${(strength / strengthLevels.length) * 100}%` }}
              />
            </div>
            {strength > 0 && (
              <p className="text-sm text-gray-600">
                قوة كلمة المرور: {strengthLevels[strength - 1].label}
              </p>
            )}
          </div>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1 text-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Password.displayName = "Password";

export { Password };

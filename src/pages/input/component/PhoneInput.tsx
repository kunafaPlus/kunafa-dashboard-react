import React, { useState, useEffect, useRef, useCallback, useMemo, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { parsePhoneNumber, CountryCode, AsYouType } from "libphonenumber-js";

// Define PhoneNumber type for better type safety
interface PhoneNumber {
  number: string;
  countryCode: string;
  isValid: boolean;
  formatted: string;
  international: string;
  national: string;
}

const phoneInputVariants = cva(
  "w-full px-4",
  {
    variants: {
      variant: {
        default: "border rounded-lg",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "size">,
    VariantProps<typeof phoneInputVariants> {
  value?: string;
  onChange?: (value: PhoneNumber) => void;
  defaultCountry?: string;
  onlyCountries?: string[];
  preferredCountries?: string[];
  error?: string;
  label?: string;
  hint?: string;
  showFlags?: boolean;
  showCountryCode?: boolean;
  showFormatted?: boolean;
  validateOnBlur?: boolean;
}
interface CountryData {
  [key: string]: { name: string; flag: string,code?:string };
}
// Country data can be moved to a separate file or fetched dynamically
const COUNTRY_DATA: CountryData = {
  US: { name: "United States", flag: "🇺🇸",code:"12" },
  GB: { name: "United Kingdom", flag: "🇬🇧",code:"12" },
  SA: { name: "Saudi Arabia", flag: "🇸🇦" ,code:"12"},
};

// Function to get country code based on country code
const getCountryCode = (country: CountryCode): string => {
  return COUNTRY_DATA[country]?.code || "";
};

// Component for rendering the country dropdown
const CountryDropdown = ({
  isOpen,
  selectedCountry,
  availableCountries,
  onCountryChange,
  closeDropdown,
  showFlags,
  label
}: {
  isOpen: boolean;
  selectedCountry: CountryCode;
  availableCountries: Array<{ code: CountryCode; name: string; flag: string }>;
  onCountryChange: (country: CountryCode) => void;
  closeDropdown: () => void;
  showFlags: boolean;
  label?:string
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md max-h-60 overflow-y-auto">
           {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
      {availableCountries.map((country) => (
        <button
          key={country.code}
          type="button"
          onClick={() => {
            onCountryChange(country.code);
            closeDropdown();
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
        >
          {showFlags && <span className="text-lg">{country.flag}</span>}
          <span>{country.name}</span>
        </button>
      ))}
    </div>
  );
};

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      variant,
      size,
      value,
      onChange,
      defaultCountry = "US" as CountryCode,
      onlyCountries,
      preferredCountries,
      error,
      label,
      hint,
      showFlags = true,
      showCountryCode = true,
      showFormatted = true,
      validateOnBlur = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const [selectedCountry, setSelectedCountry] = useState<any>(defaultCountry);
    const [inputValue, setInputValue] = useState<string>(value || "");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Memoize available countries to avoid unnecessary recalculations
    const availableCountries = useMemo(() => {
      let countries = Object.entries(COUNTRY_DATA).map(([code, data]) => ({
        code: code as CountryCode,
        ...data,
      }));

      if (onlyCountries) {
        countries = countries.filter((country) => onlyCountries.includes(country.code));
      }

      if (preferredCountries) {
        const preferred = countries.filter((country) => preferredCountries.includes(country.code));
        const others = countries.filter((country) => !preferredCountries.includes(country.code));
        countries = [...preferred, ...others];
      }

      return countries;
    }, [onlyCountries, preferredCountries]);

    // Event handler for clicking outside the dropdown
    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      },
      []
    );

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [handleClickOutside]);

    // Function to format the phone number
    const formatPhoneNumber = useCallback(
      (number: string, country: CountryCode): PhoneNumber => {
        try {
          const asYouType = new AsYouType(country);
          const formatted = asYouType.input(number);
          const phoneNumber = parsePhoneNumber(number, country);

          return {
            number: phoneNumber.number || "",
            countryCode: country,
            isValid: phoneNumber.isValid(),
            formatted: formatted,
            international: phoneNumber.formatInternational(),
            national: phoneNumber.formatNational(),
          };
        } catch (error) {
          return {
            number,
            countryCode: country,
            isValid: false,
            formatted: number,
            international: number,
            national: number,
          };
        }
      },
      []
    );

    // Handler for country change
    const handleCountryChange = useCallback(
      (country: CountryCode) => {
        setSelectedCountry(country);
        setIsOpen(false);

        const phoneNumber = formatPhoneNumber(inputValue, country);
        onChange?.(phoneNumber);
      },
      [inputValue, onChange, formatPhoneNumber]
    );

    // Handler for input change
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/[^\d]/g, "");
        setInputValue(newValue);

        if (!validateOnBlur) {
          const phoneNumber = formatPhoneNumber(newValue, selectedCountry);
          onChange?.(phoneNumber);
        }
      },
      [validateOnBlur, selectedCountry, formatPhoneNumber]
    );

    // Handler for blur
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (validateOnBlur) {
          const phoneNumber = formatPhoneNumber(inputValue, selectedCountry);
          onChange?.(phoneNumber);
        }
        props.onBlur?.(e);
      },
      [inputValue, selectedCountry, validateOnBlur, onChange, props.onBlur]
    );

    // Determine the formatted value
    const formattedValue = useMemo(() => {
      if (showFormatted) {
        return new AsYouType(selectedCountry).input(inputValue);
      }
      return inputValue;
    }, [showFormatted, inputValue, selectedCountry]);

    return (
      <div className={cn("space-y-1.5", className)}>
        <div className="relative flex gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => !disabled && setIsOpen(!isOpen)}
              className={cn(
                "flex items-center gap-1 px-2 py-1.5 border rounded-md hover:bg-accent transition-colors",
                disabled ? "opacity-50 cursor-not-allowed" : ""
              )}
              disabled={disabled}
            >
              {showFlags && (
                <span className="text-lg">
                  {COUNTRY_DATA[selectedCountry]?.flag || "🌍"} {/* Fallback flag */}
                </span>
              )}
              {showCountryCode && (
                <span className="text-sm">
                  {getCountryCode(selectedCountry)} {/* Use helper function */}
                </span>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <CountryDropdown
              isOpen={isOpen}
              selectedCountry={selectedCountry}
              availableCountries={availableCountries}
              onCountryChange={handleCountryChange}
              closeDropdown={() => setIsOpen(false)}
              showFlags={showFlags}
            />
          </div>

          <input
            ref={ref}
            type="tel"
            className={cn(
              phoneInputVariants({ variant, size }),
              "flex-1 bg-transparent transition-colors outline-input-focus border-input-border disabled:opacity-50 disabled:cursor-not-allowed",
              error ? "border-destructive focus:ring-destructive" : ""
            )}
            value={formattedValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={disabled}
            aria-describedby={error || hint ? "phone-input-error" : undefined}
            aria-invalid={!!error}
            {...props}
          />
        </div>

        {(error || hint) && (
          <div id="phone-input-error" className={cn(
            "text-sm",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || hint}
          </div>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
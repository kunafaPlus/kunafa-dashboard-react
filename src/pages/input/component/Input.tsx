import { cva, type VariantProps } from 'class-variance-authority';
import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { CheckboxGroupProps, DropdownProps, RadioInputProps, SwitchProps } from '../utils/type';
import { CheckboxProps, ValueWithLabel } from '../utils/type';

import { FormError } from './FormError';

const inputVariants = cva(
  'flex-1 w-full focus:outline-none focus:ring-2 focus:ring-primary border-2 transition-all rounded-md',
  {
    variants: {
      variant: {
        default: 'border-primary',
        error: 'border-red-500',
      },
      size: {
        default: 'py-3 px-3',
        sm: 'py-2 px-2',
        lg: 'py-4 px-4',
      },
      hasIcon: {
        true: 'pl-10 rtl:pl-3 rtl:pr-10',
        false: '',
      },
      hasEndText: {
        true: 'pr-20 rtl:pr-3 rtl:pl-20',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      hasIcon: false,
      hasEndText: false,
    },
  }
);

interface InputProps extends VariantProps<typeof inputVariants> {
  label?: string;
  id?: string;
  error?: string;
  icon?: React.ReactNode;
  endText?: string;
  isTextArea?: boolean;
  rows?: number;
  className?: string;
  placeholder?: string;
  type?: string;
  props?: any;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      id,
      error,
      icon,
      endText,
      isTextArea,
      rows,
      variant,
      size,
      placeholder,
      className,
      type,
      ...props
    },
    ref
  ) => {
    const Component = isTextArea ? 'textarea' : 'input';
    const hasIcon = !!icon;
    const hasEndText = !!endText;

    return (
      <InputWrapper>
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative w-full">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>
          )}
          <Component
            className={inputVariants({
              variant: error ? 'error' : variant,
              size,
              hasIcon,
              hasEndText,
              className,
            })}
            ref={ref as any}
            id={id}
            aria-invalid={!!error}
            rows={isTextArea ? rows : undefined}
            {...props}
          />
          {endText && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{endText}</div>
          )}
        </div>
        {error && <FormError error={error} />}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';

export const RadioInput: React.FC<RadioInputProps> = ({ id, label, name, checked, onChange }) => (
  <div className="flex items-center mb-4">
    <input
      id={id}
      type="radio"
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-6 h-6 text-primary border-border-primary focus:ring-primary"
    />
    <label htmlFor={id} className="ms-2 text-lg font-medium text-text-primary">
      {label}
    </label>
  </div>
);

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  name,
  options,
  value,
  placeholder = 'اختر...',
  error,
  touched,
  onChange,
  onBlur,
}) => (
  <div className="w-full">
    <label htmlFor={name} className="mb-3 block text-text-primary">
      {label}
    </label>
    <div className="relative">
      <StyledSelect
        name={name}
        id={name}
        value={value}
        onChange={(e) => { onChange(e.target.value); }}
        onBlur={onBlur}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option: ValueWithLabel) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
    </div>
    {error && touched && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Switch Component

export const Switch: React.FC<SwitchProps> = ({
  label,
  name,
  checked = false,
  onChange,
  disabled = false,
}) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      className="sr-only peer"
      disabled={disabled}
    />
    <div
      className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer ${disabled ? 'opacity-50 cursor-not-allowed' : 'peer-checked:bg-primary cursor-pointer'} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full`}
    ></div>
    <span className={`ms-3 text-text-primary ${disabled ? 'opacity-50' : ''}`}>{label}</span>
  </label>
);

// Checkbox Component

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  name,
  checked = false,
  onChange,
  disabled = false,
  error,
  touched,
}) => (
  <div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className={`w-5 h-5 text-primary bg-gray-100 border-border-primary rounded focus:ring-primary focus:ring-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${error && touched ? 'border-red-500' : 'border-border-primary'}`}
      />
      <span className={`ms-3 text-text-primary ${disabled ? 'opacity-50' : ''}`}>{label}</span>
    </label>
    {error && touched && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// CheckboxGroup Component

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  error,
  touched,
}) => {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    onChange(
      checked ? [...selectedValues, value] : selectedValues.filter((v: string) => v !== value)
    );
  };

  return (
    <div className="w-full">
      <label className="mb-3 block text-text-primary">{label}</label>
      <div className="space-y-2">
        {options.map((option: ValueWithLabel) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={selectedValues.includes(option.value)}
            onChange={(checked: boolean) => { handleCheckboxChange(option.value, checked); }}
          />
        ))}
      </div>
      {error && touched && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Styled Components
export const InputWrapper = styled.div`
  margin-bottom: 1rem;
  width: 100%; /* تأكد من أن الغلاف يأخذ العرض الكامل */
`;
export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 0.875rem;
`;
export const baseInputStyles = `
  width: 100%; 
  padding: 0.75rem; 
  border: 2px solid #d9d9d9; 
  border-radius: 4px; 
  font-size: 1rem; 
  transition: all 0.3s ease;
  box-sizing: border-box; /* تأكد من أن الحشو والحدود لا تزيد من العرض */

  &:focus { 
    outline: none; 
    border-color: #4096ff; 
    box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.2); 
  }

  &[aria-invalid="true"] { 
    border-color: #ff4d4f;
    &:focus { 
      border-color: #ff4d4f; 
      box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2); 
    }
  }
`;

export const StyledInput = styled.input`
  ${baseInputStyles}
`;
export const StyledTextArea = styled.textarea`
  ${baseInputStyles}
`;
export const StyledSelect = styled.select`
  ${baseInputStyles}
`;

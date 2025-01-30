import React from 'react';
import { FormError } from './FormError';
import { InputWrapper, Label, StyledSelect } from '../utils/styles';
import { CustomSelectProps } from '../utils/type';
;



export const CustomSelect = React.forwardRef<HTMLSelectElement, CustomSelectProps>(
  ({ label, error, options, ...props }, ref) => {
    return (
      <InputWrapper>
        {label && <Label>{label}</Label>}
        <StyledSelect
          ref={ref}
          aria-invalid={!!error}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>
        <FormError error={error} />
      </InputWrapper>
    );
  }
);

CustomSelect.displayName = 'CustomSelect'; 
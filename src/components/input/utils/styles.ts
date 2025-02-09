import styled from 'styled-components';

export const InputWrapper = styled.div`
  margin-bottom: 1rem;
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
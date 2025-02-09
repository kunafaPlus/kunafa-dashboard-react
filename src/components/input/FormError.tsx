import React from 'react';
import styled from 'styled-components';

const ErrorWrapper = styled.div`
  margin-top: 0.25rem;
`;

const ErrorMessage = styled.span`
  display: block;
  color: #ff4d4f;
  font-size: 0.75rem;
  animation: fadeIn 0.2s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ErrorIcon = styled.span`
  margin-right: 4px;
  color: #ff4d4f;
`;

interface FormErrorProps {
  error?: string;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ error, className }) => {
  if (!error) return null;

  return (
    <ErrorWrapper className={className}>
      <ErrorMessage>
        <ErrorIcon>⚠</ErrorIcon>
        {error}
      </ErrorMessage>
    </ErrorWrapper>
  );
}; 
import React from 'react';

export interface FieldErrorProps {
  message: string;
}

export const FieldError: React.FC<FieldErrorProps> = ({ message }) => {
  return (
    <p className="mt-1 text-sm text-red-600">
      {message}
    </p>
  );
}; 
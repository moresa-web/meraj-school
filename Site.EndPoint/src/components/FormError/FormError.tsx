import React from 'react';
import { AppError } from '../../utils/errorHandler';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';

interface FormErrorProps {
  error: AppError | null;
  className?: string;
}

const FormError: React.FC<FormErrorProps> = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`mt-2 ${className}`}>
      <ErrorDisplay
        error={error}
        className="text-sm"
      />
    </div>
  );
};

export default FormError; 
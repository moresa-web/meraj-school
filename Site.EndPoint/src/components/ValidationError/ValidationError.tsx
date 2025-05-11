import React from 'react';
import { AppError } from '../../utils/errorHandler';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';

interface ValidationErrorProps {
  error: AppError | null;
  className?: string;
}

const ValidationError: React.FC<ValidationErrorProps> = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`mt-1 ${className}`}>
      <ErrorDisplay
        error={error}
        className="text-sm"
      />
    </div>
  );
};

export default ValidationError; 
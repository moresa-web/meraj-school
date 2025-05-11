import React from 'react';
import { AppError } from '../../utils/errorHandler';

interface AnimatedFieldErrorProps {
  error: AppError | null;
  className?: string;
}

const AnimatedFieldError: React.FC<AnimatedFieldErrorProps> = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div
      className={`flex items-center mt-1 text-sm text-red-600 animate-fade-in ${className}`}
      role="alert"
    >
      <svg
        className="w-4 h-4 ml-1 animate-shake"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{error.message}</span>
    </div>
  );
};

export default AnimatedFieldError; 
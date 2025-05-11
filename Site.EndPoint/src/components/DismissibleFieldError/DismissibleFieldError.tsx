import React, { useEffect, useState } from 'react';
import { AppError } from '../../utils/errorHandler';

interface DismissibleFieldErrorProps {
  error: AppError | null;
  duration?: number;
  onDismiss?: () => void;
  className?: string;
}

const DismissibleFieldError: React.FC<DismissibleFieldErrorProps> = ({
  error,
  duration = 5000,
  onDismiss,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) {
          onDismiss();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [error, duration, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!error || !isVisible) return null;

  return (
    <div
      className={`flex items-center justify-between mt-1 text-sm text-red-600 animate-fade-in ${className}`}
      role="alert"
    >
      <div className="flex items-center">
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
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-current hover:opacity-75 focus:outline-none"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default DismissibleFieldError; 
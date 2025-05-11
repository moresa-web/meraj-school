import React from 'react';
import { AppError, ErrorType } from '../../utils/errorHandler';
import { ERROR_MESSAGES } from '../../utils/errorConstants';

interface ErrorDisplayProps {
  error: AppError;
  onDismiss?: () => void;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
  className = ''
}) => {
  const getErrorIcon = (type: ErrorType) => {
    switch (type) {
      case ErrorType.NETWORK:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case ErrorType.VALIDATION:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case ErrorType.AUTH:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case ErrorType.SERVER:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
    }
  };

  const getErrorColor = (type: ErrorType) => {
    switch (type) {
      case ErrorType.NETWORK:
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case ErrorType.VALIDATION:
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case ErrorType.AUTH:
        return 'bg-red-50 text-red-800 border-red-200';
      case ErrorType.SERVER:
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 flex items-start space-x-3 rtl:space-x-reverse ${getErrorColor(error.type)} ${className}`}
      role="alert"
    >
      <div className="flex-shrink-0">{getErrorIcon(error.type)}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{error.message}</p>
        {error.originalError?.message && (
          <p className="mt-1 text-sm opacity-75">{error.originalError.message}</p>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-current hover:opacity-75 focus:outline-none"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay; 
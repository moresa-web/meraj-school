import { useState, useCallback } from 'react';
import { ErrorHandler, showErrorToUser } from '../utils/errorHandler';
import { AppError, ErrorType } from '../utils/errorTypes';
import { ERROR_MESSAGES } from '../utils/errorConstants';

type ErrorMessagesType = typeof ERROR_MESSAGES;
type ErrorTypeKey = keyof ErrorMessagesType;

export function useErrorHandler() {
  const [error, setError] = useState<AppError | null>(null);
  const errorHandler = ErrorHandler.getInstance();

  const handleError = useCallback((error: Error) => {
    const appError = errorHandler.handleError(error);
    setError(appError);
    showErrorToUser(appError);
  }, []);

  const handleAxiosError = useCallback((error: any) => {
    const appError = errorHandler.handleAxiosError(error);
    setError(appError);
    showErrorToUser(appError);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getErrorMessage = useCallback((type: ErrorType, key: string): string => {
    const typeKey = type.toLowerCase() as ErrorTypeKey;
    const messages = ERROR_MESSAGES[typeKey];
    return messages?.[key as keyof typeof messages] || ERROR_MESSAGES.GENERAL.UNKNOWN;
  }, []);

  return {
    error,
    handleError,
    handleAxiosError,
    clearError,
    getErrorMessage
  };
} 
import React from 'react';
import { AxiosError } from 'axios';
import { ErrorType, AppError } from './errorTypes';
import { ERROR_MESSAGES } from './errorConstants';

export { ErrorType };
export type { AppError };

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleAxiosError(error: AxiosError): AppError {
    const appError: AppError = {
      type: ErrorType.UNKNOWN,
      message: ERROR_MESSAGES.GENERAL.UNKNOWN,
      originalError: error,
      timestamp: new Date()
    };

    if (error.response) {
      switch (error.response.status) {
        case 400:
          appError.type = ErrorType.VALIDATION;
          appError.message = ERROR_MESSAGES.VALIDATION.INVALID_INPUT;
          break;
        case 401:
          appError.type = ErrorType.AUTH;
          appError.message = ERROR_MESSAGES.AUTH.UNAUTHORIZED;
          break;
        case 403:
          appError.type = ErrorType.AUTH;
          appError.message = ERROR_MESSAGES.AUTH.FORBIDDEN;
          break;
        case 404:
          appError.type = ErrorType.SERVER;
          appError.message = ERROR_MESSAGES.SERVER.NOT_FOUND;
          break;
        case 500:
          appError.type = ErrorType.SERVER;
          appError.message = ERROR_MESSAGES.SERVER.INTERNAL;
          break;
        default:
          appError.type = ErrorType.SERVER;
          appError.message = ERROR_MESSAGES.SERVER.UNKNOWN;
      }
    } else if (error.request) {
      appError.type = ErrorType.NETWORK;
      appError.message = ERROR_MESSAGES.NETWORK.NO_RESPONSE;
    }

    this.logError(appError);
    return appError;
  }

  handleError(error: Error): AppError {
    const appError: AppError = {
      type: ErrorType.UNKNOWN,
      message: error.message || ERROR_MESSAGES.GENERAL.UNKNOWN,
      originalError: error,
      timestamp: new Date()
    };

    this.logError(appError);
    return appError;
  }

  private logError(error: AppError): void {
    this.errorLog.push(error);
    console.error('Error:', {
      type: error.type,
      message: error.message,
      timestamp: error.timestamp,
      originalError: error.originalError
    });
  }

  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }
}

export const errorHandler = ErrorHandler.getInstance();

export function showErrorToUser(error: AppError): void {
  console.error('User-facing error:', error.message);
}

export function withErrorHandler<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  return function WithErrorHandler(props: P) {
    const handleError = (error: Error) => {
      const appError = errorHandler.handleError(error);
      showErrorToUser(appError);
    };

    return (
      <ErrorBoundary onError={handleError}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError(error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
          <p className="mt-2 text-sm text-red-600">{this.state.error?.message}</p>
          <button
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 
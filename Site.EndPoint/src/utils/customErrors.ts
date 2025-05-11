import { ErrorType } from './errorHandler';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// تابع کمکی برای تشخیص نوع خطا
export const getErrorType = (error: Error): ErrorType => {
  switch (error.name) {
    case 'ValidationError':
      return ErrorType.VALIDATION;
    case 'NetworkError':
      return ErrorType.NETWORK;
    case 'AuthenticationError':
      return ErrorType.AUTH;
    case 'ServerError':
      return ErrorType.SERVER;
    default:
      return ErrorType.UNKNOWN;
  }
}; 
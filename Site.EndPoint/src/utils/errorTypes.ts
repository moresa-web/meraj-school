export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  AUTH = 'AUTH',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  timestamp: Date;
}

export interface ValidationError extends AppError {
  type: ErrorType.VALIDATION;
  field?: string;
  value?: any;
}

export interface NetworkError extends AppError {
  type: ErrorType.NETWORK;
  statusCode?: number;
}

export interface ServerError extends AppError {
  type: ErrorType.SERVER;
  statusCode?: number;
}

export interface AuthError extends AppError {
  type: ErrorType.AUTH;
  statusCode?: number;
}

export interface UnknownError extends AppError {
  type: ErrorType.UNKNOWN;
}

export type ErrorWithType = ValidationError | NetworkError | ServerError | AuthError | UnknownError;

export function isValidationError(error: AppError): error is ValidationError {
  return error.type === ErrorType.VALIDATION;
}

export function isNetworkError(error: AppError): error is NetworkError {
  return error.type === ErrorType.NETWORK;
}

export function isServerError(error: AppError): error is ServerError {
  return error.type === ErrorType.SERVER;
}

export function isAuthError(error: AppError): error is AuthError {
  return error.type === ErrorType.AUTH;
}

export function isUnknownError(error: AppError): error is UnknownError {
  return error.type === ErrorType.UNKNOWN;
} 
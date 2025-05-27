export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly errors?: any[];

    constructor(message: string, statusCode: number, errors?: any[]) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.errors = errors;
        
        // تنظیم prototype برای instanceof
        Object.setPrototypeOf(this, AppError.prototype);

        Error.captureStackTrace(this, this.constructor);
    }

    public static badRequest(message: string, errors?: any[]): AppError {
        return new AppError(message, 400, errors);
    }

    public static unauthorized(message: string = 'دسترسی غیرمجاز'): AppError {
        return new AppError(message, 401);
    }

    public static forbidden(message: string = 'دسترسی ممنوع'): AppError {
        return new AppError(message, 403);
    }

    public static notFound(message: string = 'منبع مورد نظر یافت نشد'): AppError {
        return new AppError(message, 404);
    }

    public static tooManyRequests(message: string): AppError {
        return new AppError(message, 429);
    }

    public static validationError(message: string, errors: any[]): AppError {
        return new AppError(message, 422, errors);
    }

    public static internal(message: string): AppError {
        return new AppError(message, 500);
    }
} 
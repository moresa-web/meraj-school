import { Request, Response, NextFunction } from 'express';

// تعریف interface برای خطاهای سفارشی
interface CustomError extends Error {
    statusCode?: number;
    errors?: any[];
}

// middleware مدیریت خطا
export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // تنظیم کد خطای پیش‌فرض
    const statusCode = err.statusCode || 500;
    
    // لاگ کردن خطا
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // ارسال پاسخ خطا
    res.status(statusCode).json({
        success: false,
        message: err.message || 'خطای سرور',
        errors: err.errors || [],
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}; 
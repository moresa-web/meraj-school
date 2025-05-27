import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { TokenPayload } from '../types/express';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // دریافت توکن از هدر Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw AppError.unauthorized('لطفاً وارد حساب کاربری خود شوید');
        }

        const token = authHeader.split(' ')[1];

        // بررسی اعتبار توکن
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as TokenPayload;

        // ذخیره اطلاعات کاربر در درخواست
        req.user = decoded;

        next();
    } catch (error) {
        logger.error('Error in authMiddleware:', error);
        if (error instanceof jwt.JsonWebTokenError) {
            next(AppError.unauthorized('توکن نامعتبر است'));
        } else if (error instanceof jwt.TokenExpiredError) {
            next(AppError.unauthorized('توکن منقضی شده است'));
        } else if (error instanceof AppError) {
            next(error);
        } else {
            next(AppError.internal('خطا در احراز هویت'));
        }
    }
}; 
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { TokenPayload } from '../types/express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// اضافه کردن interface به Request
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// میدلور احراز هویت
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
        // دریافت توکن از هدر Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'لطفاً ابتدا وارد حساب کاربری خود شوید'
            });
        }

        const token = authHeader.split(' ')[1];
  if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'توکن احراز هویت یافت نشد'
            });
  }

        // بررسی اعتبار توکن
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as TokenPayload;
        if (!decoded) {
            return res.status(401).json({
                status: 'error',
                message: 'توکن نامعتبر است'
            });
    }

        // اضافه کردن اطلاعات کاربر به درخواست
    req.user = decoded;
    next();
  } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            status: 'error',
            message: 'خطا در احراز هویت'
        });
  }
};

// تابع کمکی برای چک کردن نقش ادمین
export const checkIsAdmin = (req: Request): boolean => {
  return req.user?.role === 'admin';
};

// میدلور بررسی دسترسی ادمین
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!checkIsAdmin(req)) {
    return res.status(403).json({ message: 'شما دسترسی لازم برای این عملیات را ندارید' });
  }
  next();
}; 
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
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
      throw new Error();
  }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'لطفا وارد حساب کاربری خود شوید' });
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
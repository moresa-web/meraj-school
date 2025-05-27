import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface RateLimitConfig {
    windowMs: number;
    max: number;
    message?: string;
    statusCode?: number;
}

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

export class RateLimitMiddleware {
    private static instance: RateLimitMiddleware;
    private store: RateLimitStore;
    private config: RateLimitConfig;

    private constructor(config: RateLimitConfig) {
        this.store = {};
        this.config = {
            windowMs: config.windowMs || 15 * 60 * 1000, // 15 minutes
            max: config.max || 100,
            message: config.message || 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.',
            statusCode: config.statusCode || 429
        };

        // پاکسازی خودکار داده‌های منقضی شده
        setInterval(() => this.cleanup(), this.config.windowMs);
    }

    public static getInstance(config: RateLimitConfig = {
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.',
        statusCode: 429
    }): RateLimitMiddleware {
        if (!RateLimitMiddleware.instance) {
            RateLimitMiddleware.instance = new RateLimitMiddleware(config);
        }
        return RateLimitMiddleware.instance;
    }

    private cleanup(): void {
        const now = Date.now();
        Object.keys(this.store).forEach(key => {
            if (now > this.store[key].resetTime) {
                delete this.store[key];
            }
        });
    }

    public middleware() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const key = this.getKey(req);
                const now = Date.now();
                const windowMs = this.config.windowMs;

                // اگر کلید وجود نداشت یا منقضی شده بود، آن را ایجاد کن
                if (!this.store[key] || now > this.store[key].resetTime) {
                    this.store[key] = {
                        count: 0,
                        resetTime: now + windowMs
                    };
                }

                // افزایش شمارنده
                this.store[key].count++;

                // بررسی محدودیت
                if (this.store[key].count > this.config.max) {
                    const retryAfter = Math.ceil((this.store[key].resetTime - now) / 1000);
                    res.setHeader('Retry-After', retryAfter.toString());
                    return res.status(this.config.statusCode!).json({
                        status: 'error',
                        message: this.config.message
                    });
                }

                // تنظیم هدرهای پاسخ
                res.setHeader('X-RateLimit-Limit', this.config.max.toString());
                res.setHeader('X-RateLimit-Remaining', (this.config.max - this.store[key].count).toString());
                res.setHeader('X-RateLimit-Reset', this.store[key].resetTime.toString());

                next();
            } catch (error) {
                logger.error('Error in rate limit middleware:', error);
                next();
            }
        };
    }

    private getKey(req: Request): string {
        // استفاده از IP و مسیر برای ایجاد کلید یکتا
        return `${req.ip}-${req.path}`;
    }
}

// ایجاد یک نمونه پیش‌فرض
export const rateLimitMiddleware = RateLimitMiddleware.getInstance().middleware(); 
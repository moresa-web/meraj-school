import express from 'express';
import { subscribeToNewsletter, unsubscribeFromNewsletter, getSubscribers } from '../controllers/newsletterController';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// مسیر عمومی برای ثبت نام در خبرنامه - بدون نیاز به احراز هویت
router.post('/subscribe', subscribeToNewsletter);

// مسیر عمومی برای لغو اشتراک از خبرنامه - بدون نیاز به احراز هویت
router.post('/unsubscribe', unsubscribeFromNewsletter);

// مسیر مدیریتی برای دریافت لیست مشترکین - نیازمند احراز هویت و دسترسی ادمین
router.get('/subscribers', authMiddleware, isAdmin, getSubscribers);

export default router; 
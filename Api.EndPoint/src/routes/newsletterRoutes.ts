import express from 'express';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware';
import {
  getNewsletters,
  getNewsletter,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  sendNewsletter,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getSubscribers,
  deleteSubscriber,
  deactivateSubscriber,
  activateSubscriber
} from '../controllers/newsletterController';

const router = express.Router();

// مسیرهای عمومی برای مشترکین
router.post('/subscribe', subscribeToNewsletter);
router.post('/unsubscribe', unsubscribeFromNewsletter);

// مسیرهای مدیریتی برای خبرنامه‌ها
router.get('/', authMiddleware, isAdmin, getNewsletters);
// مسیر مدیریتی برای دریافت لیست مشترکین - باید قبل از مسیر با پارامتر باشد
router.get('/subscribers', authMiddleware, isAdmin, getSubscribers);
router.get('/:id', authMiddleware, isAdmin, getNewsletter);
router.post('/', authMiddleware, isAdmin, createNewsletter);
router.put('/:id', authMiddleware, isAdmin, updateNewsletter);
router.delete('/:id', authMiddleware, isAdmin, deleteNewsletter);
router.post('/:id/send', authMiddleware, isAdmin, sendNewsletter);
// مسیر مدیریتی برای حذف مشترک خبرنامه
router.delete('/subscribers/:id', authMiddleware, isAdmin, deleteSubscriber);
// مسیر مدیریتی برای غیرفعال کردن مشترک خبرنامه
router.patch('/subscribers/:id/deactivate', authMiddleware, isAdmin, deactivateSubscriber);
// مسیر مدیریتی برای فعال‌سازی مشترک خبرنامه
router.patch('/subscribers/:id/activate', authMiddleware, isAdmin, activateSubscriber);

export default router; 
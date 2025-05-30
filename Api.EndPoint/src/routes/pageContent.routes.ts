import express from 'express';
import { getPageContent, updatePageContent, createPageContent } from '../controllers/pageContent.controller';
import { authMiddleware as auth } from '../middleware/auth.middleware';

const router = express.Router();

// دریافت محتوای یک صفحه
router.get('/:pageId', getPageContent);

// ایجاد محتوای جدید برای یک صفحه (فقط ادمین)
router.post('/', auth, createPageContent);

// بروزرسانی محتوای یک صفحه (فقط ادمین)
router.put('/:pageId', auth, updatePageContent);

export default router; 
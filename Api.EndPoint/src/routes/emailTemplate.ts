import express from 'express';
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getActiveTemplate
} from '../controllers/emailTemplateController';
import { auth, isAdmin } from '../middleware/auth';

const router = express.Router();

// همه مسیرها نیاز به احراز هویت دارند
router.use(auth);
router.use(isAdmin);

// دریافت همه قالب‌ها
router.get('/', getTemplates);

// دریافت یک قالب خاص
router.get('/:id', getTemplate);

// دریافت قالب فعال برای یک نوع خاص
router.get('/active/:type', getActiveTemplate);

// ایجاد قالب جدید
router.post('/', createTemplate);

// به‌روزرسانی قالب
router.patch('/:id', updateTemplate);

// حذف قالب
router.delete('/:id', deleteTemplate);

export default router; 
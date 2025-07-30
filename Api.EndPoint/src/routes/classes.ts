import express from 'express';
import {
  getAllClasses,
  getAllClassesForAdmin,
  getClassById,
  getClassBySlug,
  createClass,
  updateClass,
  deleteClass,
  toggleLike,
  registerForClass,
  checkRegistration,
  unregisterFromClass,
  getClassStudents
} from '../controllers/classController';
import { authMiddleware as auth } from '../middleware/auth.middleware';
import { upload } from '../controllers/upload.controller';
import { Class } from '../models/Class';

const router = express.Router();

// مسیرهای عمومی
router.get('/', getAllClasses);           // دریافت همه کلاس‌ها

// مسیرهای ادمین (قبل از مسیرهای با پارامتر)
router.get('/admin/all', auth, getAllClassesForAdmin); // دریافت همه کلاس‌ها برای ادمین

// مسیرهای محافظت شده (نیاز به احراز هویت)
router.post('/', auth, upload.single('image'), createClass);           // ایجاد کلاس جدید

// مسیرهای با پارامتر
router.get('/slug/:slug', getClassBySlug); // دریافت یک کلاس با slug
router.get('/:id', getClassById);         // دریافت یک کلاس با ID
router.post('/:id/like', toggleLike);      // لایک کردن یک کلاس
router.post('/:id/register', registerForClass); // ثبت نام در کلاس
router.get('/:id/check-registration', checkRegistration); // بررسی وضعیت ثبت نام
router.post('/:id/unregister', unregisterFromClass); // انصراف از کلاس
router.put('/:id', auth, upload.single('image'), updateClass);         // بروزرسانی کلاس
router.delete('/:id', auth, deleteClass);      // حذف کلاس
router.get('/:id/students', auth, getClassStudents); // اضافه کردن مسیر جدید

export default router; 
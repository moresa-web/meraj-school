import express from 'express';
import {
  getAllClasses,
  getClassById,
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
router.get('/:id', getClassById);         // دریافت یک کلاس با ID
router.post('/:id/like', toggleLike);      // لایک کردن یک کلاس
router.post('/:id/register', registerForClass); // ثبت نام در کلاس
router.get('/:id/check-registration', checkRegistration); // بررسی وضعیت ثبت نام
router.post('/:id/unregister', unregisterFromClass); // انصراف از کلاس

// مسیرهای محافظت شده (نیاز به احراز هویت)
router.post('/', auth, upload.single('image'), createClass);           // ایجاد کلاس جدید
router.put('/:id', auth, upload.single('image'), updateClass);         // بروزرسانی کلاس
router.delete('/:id', auth, deleteClass);      // حذف کلاس

// مسیرهای ادمین
router.get('/:id/students', auth, getClassStudents); // اضافه کردن مسیر جدید

export default router; 
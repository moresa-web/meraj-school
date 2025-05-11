import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { checkIsAdmin } from '../middleware/auth';

// تنظیمات ذخیره‌سازی فایل
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// فیلتر فایل‌ها
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('فقط فایل‌های تصویری مجاز هستند'));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!checkIsAdmin(req)) {
      return res.status(403).json({ message: 'شما دسترسی لازم را ندارید' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'هیچ فایلی آپلود نشده است' });
    }

    // Return the full path including /uploads/
    res.json({ url: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(500).json({ message: 'خطا در آپلود فایل' });
  }
}; 
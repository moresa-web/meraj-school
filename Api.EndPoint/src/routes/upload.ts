import express from 'express';
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware as auth } from '../middleware/auth.middleware';

const router: Router = express.Router();

// تنظیم مسیر پوشه uploads
const UPLOAD_DIR = process.env.NODE_ENV === 'production'
  ? 'C:\\inetpub\\wwwroot\\moresa\\mohammadrezasardashti\\site\\uploads'
  : path.join(__dirname, '../../uploads');

// اضافه کردن لاگ برای بررسی مسیر
console.log('Upload directory:', UPLOAD_DIR);
console.log('Upload directory exists:', fs.existsSync(UPLOAD_DIR));
console.log('Upload directory is directory:', fs.statSync(UPLOAD_DIR).isDirectory());

// تنظیمات ذخیره‌سازی فایل
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Upload directory in storage:', UPLOAD_DIR);
    // ایجاد پوشه uploads اگر وجود نداشته باشد
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // ایجاد نام یکتا برای فایل
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// فیلتر فایل‌ها
const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // فقط اجازه آپلود تصاویر
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('فقط فایل‌های تصویری مجاز هستند'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

// حذف فایل
router.delete('/:filename', auth, async (req, res) => {
  try {
    const filename = req.params.filename;
    console.log('Filename to delete:', filename);
    
    const filePath = path.join(UPLOAD_DIR, filename);
    
    console.log('Upload directory:', UPLOAD_DIR);
    console.log('Full file path:', filePath);
    console.log('File exists:', fs.existsSync(filePath));
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('File deleted successfully');
      res.status(200).json({ message: 'فایل با موفقیت حذف شد' });
    } else {
      console.log('File not found:', filePath);
      res.status(404).json({ message: 'فایل یافت نشد' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'خطا در حذف فایل' });
  }
});

// آپلود تصویر
router.post('/', auth, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'هیچ فایلی آپلود نشده است' });
      }

      console.log('Uploaded file:', {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      });

      // ایجاد URL برای دسترسی به فایل
      const fileUrl = `/uploads/${req.file.filename}`;
      console.log('New file URL:', fileUrl);
      
      res.json({
        url: fileUrl,
        message: 'تصویر با موفقیت آپلود شد'
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'خطا در آپلود فایل' });
    }
  });
});

export default router; 
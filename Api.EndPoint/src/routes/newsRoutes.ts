import express from 'express';
import { auth, isAdmin } from '../middleware/auth';
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  toggleLike
} from '../controllers/newsController';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// تنظیمات آپلود فایل
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('فرمت فایل نامعتبر است. فقط تصاویر JPEG، PNG و GIF مجاز هستند.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// مسیرهای عمومی
router.get('/', getNews);
router.get('/:id', getNewsById);
router.post('/:id/like', toggleLike);

// مسیرهای محافظت شده (فقط ادمین)
router.post('/', auth, isAdmin, upload.single('image'), createNews);
router.put('/:id', auth, isAdmin, upload.single('image'), updateNews);
router.delete('/:id', auth, isAdmin, deleteNews);

export default router; 
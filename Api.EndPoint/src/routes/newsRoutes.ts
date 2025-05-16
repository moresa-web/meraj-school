import express from 'express';
import { auth, isAdmin } from '../middleware/auth';
import {
  getNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  toggleLike
} from '../controllers/newsController';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// تنظیم مسیر آپلود فایل‌ها بر اساس محیط
const UPLOAD_DIR = process.env.NODE_ENV === 'production' 
  ? 'C:\\inetpub\\wwwroot\\moresa\\mohammadrezasardashti\\site\\uploads'
  : path.join(__dirname, '../../uploads');

// تنظیمات آپلود فایل
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('فرمت فایل نامعتبر است. فقط تصاویر JPEG، PNG، GIF و WebP مجاز هستند.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// مسیرهای عمومی
router.get('/', getNews);
router.get('/:slug', getNewsBySlug);
router.post('/:slug/like', toggleLike);

// مسیرهای ادمین
router.post('/', auth, isAdmin, upload.single('image'), createNews);
router.put('/:slug', auth, isAdmin, upload.single('image'), updateNews);
router.delete('/:slug', auth, isAdmin, deleteNews);

export default router; 
import express from 'express';
import { Content } from '../models/Content';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware';
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

// دریافت محتوای یک بخش
router.get('/:page/:section', async (req, res) => {
  try {
    const { page, section } = req.params;
    console.log('GET /content/:page/:section - Request params:', { page, section });

    const content = await Content.getContentWithDefaults(page, section);
    console.log('GET /content/:page/:section - Content found:', content);

    if (!content) {
      console.log('GET /content/:page/:section - No content found');
      return res.status(404).json({ message: 'محتوا یافت نشد' });
    }

    res.json(content.data);
  } catch (error) {
    console.error('GET /content/:page/:section - Error:', error);
    res.status(500).json({
      message: 'خطا در دریافت محتوا',
      error: error instanceof Error ? error.message : 'خطای ناشناخته',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// به‌روزرسانی محتوای یک بخش
router.put('/:page/:section', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { page, section } = req.params;
    const updateData = req.body;
    console.log('PUT /content/:page/:section - Request params:', { page, section, updateData });

    let content = await Content.findOne({ page, section });
    if (!content) {
      content = new Content({
        page,
        section,
        data: updateData
      });
    } else {
      content.data = { ...content.data, ...updateData };
    }

    await content.save();
    console.log('PUT /content/:page/:section - Content updated:', content);
    res.json(content.data);
  } catch (error) {
    console.error('PUT /content/:page/:section - Error:', error);
    res.status(500).json({
      message: 'خطا در به‌روزرسانی محتوا',
      error: error instanceof Error ? error.message : 'خطای ناشناخته',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// حذف تصویر
router.delete('/image', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: 'آدرس تصویر الزامی است' });
    }

    // استخراج نام فایل از URL
    const filename = imageUrl.split('/').pop();
    if (!filename) {
      return res.status(400).json({ message: 'نام فایل نامعتبر است' });
    }

    // مسیر کامل فایل
    const filePath = path.join(__dirname, '../../uploads', filename);

    // بررسی وجود فایل
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'فایل یافت نشد' });
    }

    // حذف فایل
    fs.unlinkSync(filePath);
    console.log('File deleted:', filePath);

    res.json({ message: 'تصویر با موفقیت حذف شد' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      message: 'خطا در حذف تصویر',
      error: error instanceof Error ? error.message : 'خطای ناشناخته'
    });
  }
});

// آپلود تصویر
router.post('/upload', authMiddleware, isAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'هیچ فایلی آپلود نشده است' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    console.log('POST /content/upload - Image uploaded:', imageUrl);
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('POST /content/upload - Error:', error);
    res.status(500).json({
      message: 'خطا در آپلود تصویر',
      error: error instanceof Error ? error.message : 'خطای ناشناخته',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

export default router; 
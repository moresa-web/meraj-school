import express from 'express';
import { Content } from '../models/Content';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// تنظیم مسیر آپلود
const uploadPath = process.env.NODE_ENV === 'production'
  ? 'C:\\inetpub\\wwwroot\\moresa\\mohammadrezasardashti\\site\\uploads'
  : path.join(__dirname, '../uploads');

// اطمینان از وجود پوشه آپلود
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// اضافه کردن لاگ برای بررسی مسیر
console.log('Content route upload path:', uploadPath);
console.log('Content route upload path exists:', fs.existsSync(uploadPath));
console.log('Content route upload path is directory:', fs.statSync(uploadPath).isDirectory());

// تنظیمات آپلود فایل
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // اطمینان از وجود پوشه آپلود
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    console.log('Saving file to:', uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('فرمت فایل مجاز نیست. فقط JPEG، PNG و GIF مجاز هستند.'));
    }
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

    // برای hero section، اگر فیلدهای title و description وجود نداشتند، مقادیر پیش‌فرض را اضافه می‌کنیم
    if (page === 'home' && section === 'hero') {
      const defaultContent = {
        logo: '/images/logo.png',
        title: 'دبیرستان معراج',
        description: 'دبیرستان معراج - مرکز آموزش و پرورش با کیفیت و استانداردهای جهانی'
      };
      res.json({ ...defaultContent, ...content.data });
    } else {
      res.json(content.data);
    }
  } catch (error) {
    console.error('GET /content/:page/:section - Error:', error);
    res.status(500).json({
      message: 'خطا در دریافت محتوا',
      error: error instanceof Error ? error.message : 'خطای ناشناخته'
    });
  }
});

// به‌روزرسانی محتوای یک بخش
router.put('/:page/:section', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { page, section } = req.params;
    const updates = req.body;

    // بررسی وجود محتوا
    let existingContent = await Content.findOne({ page, section });
    if (existingContent) {
      // بروزرسانی محتوا
      const updatedContent = await Content.findOneAndUpdate(
        { page, section },
        { $set: { data: { ...existingContent.data, ...updates } } },
        { new: true }
      );
      if (!updatedContent) {
        return res.status(404).json({ message: 'محتوا یافت نشد' });
      }
      return res.json(updatedContent.data);
    } else {
      // ایجاد محتوای جدید
      const newContent = await Content.create({
        page,
        section,
        data: updates
      });
      return res.json(newContent.data);
    }
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: 'خطا در بروزرسانی محتوا' });
  }
});

// حذف تصویر
router.delete('/image', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: 'آدرس تصویر الزامی است' });
    }

    // حذف فایل از سرور
    const imagePath = path.join(uploadPath, path.basename(imageUrl));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({ message: 'تصویر با موفقیت حذف شد' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'خطا در حذف تصویر' });
  }
});

// آپلود تصویر
router.post('/upload', authMiddleware, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'فایل آپلود نشده است' });
    }

    // حذف فایل قبلی اگر وجود داشته باشد
    if (req.body.oldImage) {
      const oldImagePath = path.join(uploadPath, path.basename(req.body.oldImage));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // ذخیره مسیر فایل در دیتابیس
    const imageUrl = `/uploads/${req.file.filename}`;
    console.log('File uploaded:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      url: imageUrl
    });
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'خطا در آپلود تصویر' });
  }
});

export default router; 
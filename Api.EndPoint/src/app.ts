import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import authRoutes from './routes/auth';
import userRoutes from './routes/userRoutes';
import newsRoutes from './routes/newsRoutes';
import classRoutes from './routes/classes';
import pageContentRoutes from './routes/pageContent.routes';
import contactRoutes from './routes/contact';
import contentRoutes from './routes/content';
import seoRoutes from './routes/seo';
import newsletterRoutes from './routes/newsletterRoutes';
import { upload } from './controllers/upload.controller';
import uploadRoutes from './routes/upload';

// لود کردن متغیرهای محیطی
dotenv.config();

// ایجاد اپلیکیشن Express
const app = express();

// میدلورها
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'http://mohammadrezasardashti.ir'
    : ['http://localhost:5173', 'http://mohammadrezasardashti.ir'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// سرو فایل‌های آپلود شده
const uploadPath = process.env.NODE_ENV === 'production'
  ? 'C:\\inetpub\\wwwroot\\moresa\\mohammadrezasardashti\\site\\uploads'
  : path.join(__dirname, '../uploads');

// اطمینان از وجود پوشه آپلود
if (!require('fs').existsSync(uploadPath)) {
  require('fs').mkdirSync(uploadPath, { recursive: true });
}

// تنظیم مسیر استاتیک برای فایل‌های آپلود شده
app.use('/uploads', express.static(uploadPath));

// اضافه کردن لاگ برای بررسی مسیر
console.log('App upload path:', uploadPath);
console.log('App upload path exists:', require('fs').existsSync(uploadPath));
console.log('App upload path is directory:', require('fs').statSync(uploadPath).isDirectory());

// مسیرهای API
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/page-content', pageContentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/newsletter', newsletterRoutes);

// مسیر آپلود فایل
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'هیچ فایلی آپلود نشده است' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    console.log('File uploaded:', fileUrl);
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'خطا در آپلود فایل' });
  }
});

// مسیر اصلی
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Meraj School API' });
});

// مدیریت خطاها
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'خطای سرور' });
});

// اتصال به دیتابیس و شروع سرور
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj-school')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

export default app; 
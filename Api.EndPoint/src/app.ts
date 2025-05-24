import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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
import emailTemplateRoutes from './routes/emailTemplate';
import dashboard from "./routes/dashboard"
import classesRouter from './routes/classes';
import sitemapRoutes from './routes/sitemapRoutes';
import usersRouter from './routes/users';

// لود کردن متغیرهای محیطی
dotenv.config();

// ایجاد اپلیکیشن Express
const app = express();

// تنظیمات rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقیقه
  max: 100, // حداکثر 100 درخواست در هر window
  message: 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.'
});

// تنظیمات CORS
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['http://mohammadrezasardashti.ir', 'http://admin.mohammadrezasardashti.ir']
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// سرو فایل‌های آپلود شده
const uploadPath = process.env.NODE_ENV === 'production'
  ? 'C:\\inetpub\\wwwroot\\moresa\\mohammadrezasardashti\\site\\uploads'
  : path.join(__dirname, '../uploads');

// اطمینان از وجود پوشه آپلود
if (!require('fs').existsSync(uploadPath)) {
  require('fs').mkdirSync(uploadPath, { recursive: true });
}

// اضافه کردن هدرهای CORS و CORP برای مسیر /uploads
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.use('/uploads', express.static(uploadPath));

// اضافه کردن لاگ برای بررسی مسیر
console.log('Static files path:', uploadPath);
console.log('Static files path exists:', require('fs').existsSync(uploadPath));
console.log('Static files path is directory:', require('fs').statSync(uploadPath).isDirectory());

// مسیرهای API
app.use('/api/auth', authRoutes);
app.use('/api/classes', classesRouter);
app.use('/api/news', newsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/page-content', pageContentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/email-templates', emailTemplateRoutes);
app.use('/api/dashboard', dashboard);
app.use('/api/sitemap', sitemapRoutes);
app.use('/api/users', usersRouter);

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
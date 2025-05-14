import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import classRoutes from './routes/classes';
import authRoutes from './routes/auth';
import newsRoutes from './routes/newsRoutes';
import userRoutes from './routes/userRoutes';
import pageContentRoutes from './routes/pageContent.routes';
import path from 'path';
import { upload, uploadImage } from './controllers/upload.controller';
import contentRoutes from './routes/content';
import contactRoutes from './routes/contact';
// لود کردن متغیرهای محیطی
dotenv.config();

// ایجاد اپلیکیشن Express
const app = express();

// میدلورها
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://mohammadrezasardashti.ir'
}));
app.use(express.json());
app.use(morgan('dev'));

// سرو فایل‌های آپلود شده
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// مسیرهای API
app.use('/api/auth', authRoutes);    // مسیرهای احراز هویت
app.use('/api/classes', classRoutes); // مسیرهای کلاس‌ها
app.use('/api/news', newsRoutes);    // مسیرهای اخبار
app.use('/api/user', userRoutes);    // مسیرهای کاربران
app.use('/api/page-content', pageContentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);
// مسیر اصلی
app.get('/', (req, res) => {
  res.json({ message: 'خوش آمدید به API دبیرستان معراج' });
});

app.post('/api/upload', upload.single('image'), uploadImage);

// مدیریت خطاها
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'خطای سرور',
    error: err.message
  });
});

// اتصال به دیتابیس
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj-school')
  .then(() => console.log('اتصال به دیتابیس برقرار شد'))
  .catch((err) => console.error('خطا در اتصال به دیتابیس:', err));

// شروع سرور
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`سرور در پورت ${PORT} در حال اجراست`);
});

export default app; 
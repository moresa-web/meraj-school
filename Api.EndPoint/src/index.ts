import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes';

// لود کردن متغیرهای محیطی
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// تنظیم مسیر استاتیک برای فایل‌های آپلود شده
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', routes);

// اتصال به دیتابیس
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// شروع سرور
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
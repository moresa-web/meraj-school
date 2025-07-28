import mongoose from 'mongoose';
import { User } from '../models/User';
import { config } from '../config';

const createAdmin = async () => {
  try {
    // اتصال به دیتابیس
    await mongoose.connect(config.database.url);
    console.log('اتصال به دیتابیس برقرار شد.');

    // بررسی وجود کاربر
    const existingUser = await User.findOne({
      $or: [
        { username: 'moresa-web' },
        { email: 'info@moresa-web.ir' }
      ]
    });

    if (existingUser) {
      console.log('کاربر با این مشخصات قبلاً وجود دارد.');
      process.exit(0);
    }

    // ایجاد کاربر admin
    const adminUser = await User.create({
      username: 'moresa-web',
      email: 'info@moresa-web.ir',
      password: 'Admin@123', // رمز عبور پیش‌فرض
      role: 'admin',
      fullName: 'مدیر سیستم',
      phone: '09123456789' // شماره تماس پیش‌فرض
    });

    console.log('کاربر admin با موفقیت ایجاد شد:', adminUser);
    process.exit(0);
  } catch (error) {
    console.error('خطا در ایجاد کاربر admin:', error);
    process.exit(1);
  }
};

createAdmin(); 
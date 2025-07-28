import mongoose from 'mongoose';
import { User } from '../models/User';
import { config } from '../config';

const recreateAdmin = async () => {
  try {
    // اتصال به دیتابیس
    await mongoose.connect(config.database.url);
    console.log('اتصال به دیتابیس برقرار شد.');

    // حذف کاربر موجود
    await User.deleteMany({
      $or: [
        { username: 'moresa-web' },
        { email: 'info@moresa-web.ir' },
        { phone: '09123456789' }
      ]
    });
    console.log('کاربران قبلی حذف شدند.');

    // ایجاد کاربر admin جدید
    const adminUser = new User({
      username: 'moresa-web',
      email: 'info@moresa-web.ir',
      password: 'Admin@123', // رمز عبور پیش‌فرض
      role: 'admin',
      fullName: 'مدیر سیستم',
      phone: '09123456789' // شماره تماس پیش‌فرض
    });

    await adminUser.save();

    console.log('کاربر admin با موفقیت ایجاد شد:', adminUser);
    process.exit(0);
  } catch (error) {
    console.error('خطا در ایجاد کاربر admin:', error);
    process.exit(1);
  }
};

recreateAdmin(); 
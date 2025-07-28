import mongoose from 'mongoose';
import { User } from '../models/User';
import { config } from '../config';

const createCorrectAdmin = async () => {
  try {
    // اتصال به دیتابیس
    await mongoose.connect(config.database.url);
    console.log('اتصال به دیتابیس برقرار شد.');

    // بررسی وجود کاربر admin با ایمیل صحیح
    const existingAdmin = await User.findOne({
      $or: [
        { email: 'info@merajfutureschool.ir' },
        { username: 'info@merajfutureschool.ir' }
      ]
    });

    if (existingAdmin) {
      console.log('کاربر admin با ایمیل info@merajfutureschool.ir قبلاً وجود دارد:', existingAdmin);
      
      // بررسی اینکه آیا کاربر admin است
      if (existingAdmin.role !== 'admin') {
        console.log('کاربر موجود admin نیست. در حال تغییر نقش...');
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('نقش کاربر به admin تغییر یافت.');
      }
      
      process.exit(0);
    }

    // حذف کاربران موجود با شماره تلفن تکراری
    await User.deleteMany({ phone: '09123456789' });
    console.log('کاربران با شماره تلفن تکراری حذف شدند.');

    // ایجاد کاربر admin جدید با ایمیل صحیح
    const adminUser = new User({
      username: 'info@merajfutureschool.ir',
      email: 'info@merajfutureschool.ir',
      password: 'Admin@123', // رمز عبور پیش‌فرض
      role: 'admin',
      fullName: 'مدیر سیستم',
      phone: '09123456789' // شماره تماس پیش‌فرض
    });

    await adminUser.save();

    console.log('کاربر admin با ایمیل صحیح با موفقیت ایجاد شد:', adminUser);
    process.exit(0);
  } catch (error) {
    console.error('خطا در ایجاد کاربر admin:', error);
    process.exit(1);
  }
};

createCorrectAdmin(); 
import mongoose from 'mongoose';
import { User } from '../models/User';
import { config } from '../config';

async function initDatabase() {
  try {
    // اتصال به دیتابیس
    await mongoose.connect(config.database.url);
    console.log('Connected to database');

    // پاک کردن تمام کاربران قبلی
    await User.deleteMany({});
    console.log('Cleared existing users');

    // ایجاد کاربر ادمین
    const adminUser = new User({
      username: 'moresa-web',
      email: 'info@moresa-web.ir',
      password: 'Admin@123',
      role: 'admin',
      fullName: 'مدیر سیستم',
      phone: '09123456789'
    });

    await adminUser.save();
    console.log('Admin user created successfully:', {
      id: adminUser._id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
      fullName: adminUser.fullName
    });

    // نمایش تمام کاربران
    const users = await User.find({});
    console.log('All users in database:', users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    })));

    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

initDatabase(); 
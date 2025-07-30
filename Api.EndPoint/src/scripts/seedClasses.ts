import mongoose from 'mongoose';
import { Class } from '../models/Class';
import dotenv from 'dotenv';

dotenv.config();

const sampleClasses = [
  {
    title: 'ریاضی پیشرفته',
    teacher: 'دکتر احمدی',
    schedule: 'شنبه - 14:00',
    description: 'کلاس ریاضی پیشرفته برای دانش‌آموزان دبیرستان با تمرکز بر مفاهیم پیشرفته',
    price: 250000,
    level: 'پیشرفته',
    image: '',
    category: 'ریاضی',
    slug: 'riazi-pishrafte',
    capacity: 20,
    enrolledStudents: 15,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-15'),
    isActive: true,
    likedBy: [],
    registrations: []
  },
  {
    title: 'فیزیک کنکور',
    teacher: 'استاد محمدی',
    schedule: 'یکشنبه - 16:00',
    description: 'آموزش فیزیک کنکور با حل تست‌های استاندارد و نکات کلیدی',
    price: 300000,
    level: 'متوسط',
    image: '',
    category: 'فیزیک',
    slug: 'fizik-konkur',
    capacity: 25,
    enrolledStudents: 20,
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-06-20'),
    isActive: true,
    likedBy: [],
    registrations: []
  },
  {
    title: 'شیمی آلی',
    teacher: 'دکتر رضایی',
    schedule: 'دوشنبه - 10:00',
    description: 'آموزش شیمی آلی با تمرکز بر واکنش‌ها و مکانیزم‌های شیمیایی',
    price: 280000,
    level: 'پیشرفته',
    image: '',
    category: 'شیمی',
    slug: 'shimi-ali',
    capacity: 18,
    enrolledStudents: 12,
    startDate: new Date('2024-01-25'),
    endDate: new Date('2024-06-25'),
    isActive: true,
    likedBy: [],
    registrations: []
  },
  {
    title: 'ادبیات فارسی',
    teacher: 'استاد کریمی',
    schedule: 'سه‌شنبه - 14:00',
    description: 'آموزش ادبیات فارسی با تحلیل متون و آموزش فنون نگارش',
    price: 200000,
    level: 'متوسط',
    image: '',
    category: 'ادبیات',
    slug: 'adabiat-farsi',
    capacity: 22,
    enrolledStudents: 18,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-07-01'),
    isActive: true,
    likedBy: [],
    registrations: []
  },
  {
    title: 'زبان انگلیسی',
    teacher: 'خانم احمدی',
    schedule: 'چهارشنبه - 16:00',
    description: 'آموزش زبان انگلیسی با تمرکز بر مهارت‌های چهارگانه',
    price: 350000,
    level: 'پیشرفته',
    image: '',
    category: 'زبان',
    slug: 'zaban-english',
    capacity: 20,
    enrolledStudents: 20,
    startDate: new Date('2024-02-05'),
    endDate: new Date('2024-07-05'),
    isActive: true,
    likedBy: [],
    registrations: []
  },
  {
    title: 'زیست شناسی',
    teacher: 'دکتر نوری',
    schedule: 'پنجشنبه - 10:00',
    description: 'آموزش زیست شناسی با تمرکز بر مفاهیم سلولی و مولکولی',
    price: 270000,
    level: 'متوسط',
    image: '',
    category: 'زیست',
    slug: 'zist-shenasi',
    capacity: 20,
    enrolledStudents: 16,
    startDate: new Date('2024-02-10'),
    endDate: new Date('2024-07-10'),
    isActive: true,
    likedBy: [],
    registrations: []
  },
  {
    title: 'هندسه تحلیلی',
    teacher: 'استاد صادقی',
    schedule: 'جمعه - 14:00',
    description: 'آموزش هندسه تحلیلی با حل مسائل پیچیده و کاربردی',
    price: 320000,
    level: 'پیشرفته',
    image: '',
    category: 'ریاضی',
    slug: 'hendese-tahlili',
    capacity: 15,
    enrolledStudents: 10,
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-07-15'),
    isActive: true,
    likedBy: [],
    registrations: []
  },
  {
    title: 'تاریخ ایران',
    teacher: 'دکتر حسینی',
    schedule: 'شنبه - 10:00',
    description: 'آموزش تاریخ ایران از دوران باستان تا معاصر',
    price: 180000,
    level: 'متوسط',
    image: '',
    category: 'تاریخ',
    slug: 'tarikh-iran',
    capacity: 25,
    enrolledStudents: 22,
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-07-20'),
    isActive: true,
    likedBy: [],
    registrations: []
  }
];

async function seedClasses() {
  try {
    // اتصال به دیتابیس
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj-school';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // حذف کلاس‌های موجود
    await Class.deleteMany({});
    console.log('🗑️ Deleted existing classes');

    // اضافه کردن کلاس‌های نمونه
    const createdClasses = await Class.insertMany(sampleClasses);
    console.log(`✅ Created ${createdClasses.length} sample classes`);

    console.log('🎉 Classes seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding classes:', error);
    process.exit(1);
  }
}

seedClasses(); 
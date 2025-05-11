import mongoose, { Document, Schema } from 'mongoose';

// تعریف interface برای کلاس تقویتی
export interface IRegistration {
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  grade: string;
  registeredAt: Date;
  ip: string;
}

export interface IClass extends Document {
  title: string;           // عنوان کلاس
  teacher: string;         // نام استاد
  schedule: string;        // برنامه زمانی
  description: string;     // توضیحات
  price: number;          // قیمت
  level: string;          // سطح کلاس
  image: string;          // تصویر کلاس
  category: string;       // دسته‌بندی
  views: number;          // تعداد بازدید
  likes: number;          // تعداد لایک
  capacity: number;       // ظرفیت کلاس
  enrolledStudents: number; // تعداد دانش‌آموزان ثبت‌نام شده
  startDate: Date;        // تاریخ شروع
  endDate: Date;          // تاریخ پایان
  isActive: boolean;      // وضعیت فعال بودن کلاس
  likedBy: string[];      // لیست دانش‌آموزانی که کلاس را لایک کرده‌اند
  registrations: IRegistration[]; // لیست ثبت‌نام‌ها
  createdAt: Date;        // تاریخ ایجاد
  updatedAt: Date;        // تاریخ بروزرسانی
}

// تعریف schema برای کلاس تقویتی
const classSchema = new Schema<IClass>({
  title: {
    type: String,
    required: [true, 'عنوان کلاس الزامی است'],
    trim: true
  },
  teacher: {
    type: String,
    required: [true, 'نام استاد الزامی است'],
    trim: true
  },
  schedule: {
    type: String,
    required: [true, 'برنامه زمانی الزامی است']
  },
  description: {
    type: String,
    required: [true, 'توضیحات الزامی است']
  },
  price: {
    type: Number,
    required: [true, 'قیمت الزامی است'],
    min: [0, 'قیمت نمی‌تواند منفی باشد']
  },
  level: {
    type: String,
    required: [true, 'سطح کلاس الزامی است'],
    enum: ['مقدماتی', 'متوسط', 'پیشرفته']
  },
  image: {
    type: String,
    required: [true, 'تصویر کلاس الزامی است']
  },
  category: {
    type: String,
    required: [true, 'دسته‌بندی الزامی است']
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
    required: [true, 'ظرفیت کلاس الزامی است'],
    min: [1, 'ظرفیت باید حداقل 1 نفر باشد']
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: [true, 'تاریخ شروع الزامی است']
  },
  endDate: {
    type: Date,
    required: [true, 'تاریخ پایان الزامی است']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  likedBy: [{ type: String }],
  registrations: [{
    studentName: { type: String, required: true },
    studentPhone: { type: String, required: true },
    parentPhone: { type: String, required: true },
    grade: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now },
    ip: { type: String, required: true }
  }]
}, {
  timestamps: true // اضافه کردن createdAt و updatedAt به صورت خودکار
});

// ایجاد ایندکس برای جستجوی بهتر
classSchema.index({ title: 'text', description: 'text', teacher: 'text' });

// ایجاد مدل
export const Class = mongoose.model<IClass>('Class', classSchema); 
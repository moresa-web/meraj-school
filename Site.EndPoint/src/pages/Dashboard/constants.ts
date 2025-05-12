export const API_URL = 'http://localhost:5000/api';

export const PAGES = [
  { id: 'news', title: 'مدیریت اخبار' },
  { id: 'classes', title: 'مدیریت کلاس‌های تقویتی' },
  { id: 'contacts', title: 'مدیریت پیام‌ها' }
];

export const NEWS_CATEGORIES = [
  'اخبار مدرسه',
  'مسابقات',
  'افتخارات',
  'برنامه‌ها'
];

export const CLASS_LEVELS = [
  'مقدماتی',
  'متوسط',
  'پیشرفته'
] as const; 
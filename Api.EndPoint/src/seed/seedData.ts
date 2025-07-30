import { ISchoolInfo } from '../models/SchoolInfo';
import { ISEO } from '../models/SEO';
import { INews } from '../models/News';
import { IFAQ } from '../models/FAQ';
import { IClass } from '../models/Class';
import { IContent } from '../models/Content';
import { IPageContent } from '../models/PageContent';
import mongoose from 'mongoose';

export const schoolInfoData: Partial<ISchoolInfo> = {
  name: 'دبیرستان پسرانه معراج',
  address: 'بلوار دانش آموز، دانش آموز 10',
  phone: '+985138932030',
  email: 'info@merajschool.ir',
  website: 'https://merajschool.ir',
  description: 'دبیرستان پسرانه معراج، مدرسه‌ای هوشمند در مشهد با امکانات پیشرفته آموزشی، کلاس‌های تقویتی، ثبت‌نام آنلاین و سیستم مدیریت هوشمند برای دانش‌آموزان و والدین.',
  workingHours: '7:30 تا 15:00',
  socialMedia: {
    instagram: 'https://www.instagram.com/merajschool/'
  },
  updatedAt: new Date()
};

export const seoData: Partial<ISEO> = {
  siteUrl: 'https://merajfutureschool.ir',
  schoolName: 'دبیرستان پسرانه معراج',
  title: 'دبیرستان پسرانه معراج',
  description: 'دبیرستان پسرانه معراج، مدرسه‌ای هوشمند در مشهد با امکانات پیشرفته آموزشی، کلاس‌های تقویتی، ثبت‌نام آنلاین و سیستم مدیریت هوشمند برای دانش‌آموزان و والدین.',
  keywords: [
    'دبیرستان پسرانه معراج',
    'مدرسه هوشمند مشهد',
    'کلاس تقویتی',
    'ثبت‌نام آنلاین',
    'اخبار مدرسه',
    'مشهد',
    'آموزش'
  ],
  address: 'بلوار دانش آموز، دانش آموز 10',
  phone: '+985138932030',
  email: 'info@merajschool.ir',
  image: '/images/logo.png',
  updatedAt: new Date()
};

export const newsData: Partial<INews>[] = [
  {
    title: 'افتتاح آزمایشگاه جدید علوم تجربی',
    slug: 'opening-new-science-lab',
    content: `آزمایشگاه مجهز به جدیدترین تجهیزات علمی برای دانش‌آموزان دبیرستان معراج افتتاح شد.

این آزمایشگاه با سرمایه‌گذاری قابل توجه مدرسه و با استفاده از جدیدترین تکنولوژی‌های روز دنیا ساخته شده است. تجهیزات موجود در این آزمایشگاه شامل:

• میکروسکوپ‌های دیجیتال پیشرفته
• دستگاه‌های اندازه‌گیری دقیق
• کیت‌های آزمایشگاهی کامل
• سیستم‌های کامپیوتری مجهز

دانش‌آموزان می‌توانند از این امکانات برای انجام آزمایش‌های مختلف در دروس فیزیک، شیمی و زیست‌شناسی استفاده کنند.`,
    summary: 'آزمایشگاه مجهز به جدیدترین تجهیزات علمی برای دانش‌آموزان دبیرستان معراج افتتاح شد.',
    image: '/images/news1.jpg',
    publishDate: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    status: 'published',
    tags: ['آموزشی', 'علمی', 'آزمایشگاه'],
    stockTickers: [],
    views: 1250,
    likes: 89,
    likedBy: [],
    date: new Date('2024-01-15T10:00:00Z'),
    author: {
      userId: '1',
      fullName: 'مدیریت مدرسه',
      email: 'admin@merajschool.ir'
    }
  },
  {
    title: 'قهرمانی تیم فوتبال در مسابقات منطقه‌ای',
    slug: 'football-team-championship',
    content: `تیم فوتبال دبیرستان معراج با پیروزی در فینال مسابقات منطقه‌ای، عنوان قهرمانی را کسب کرد.

این تیم که تحت هدایت مربی مجرب و با تلاش بی‌وقفه دانش‌آموزان تشکیل شده بود، در تمام مراحل مسابقات عملکردی درخشان از خود نشان داد. در فینال که در ورزشگاه اصلی شهر برگزار شد، تیم ما با نتیجه 3-1 حریف خود را شکست داد.

نکات برجسته این قهرمانی:
• عملکرد تیمی عالی
• روحیه ورزشکاری بالا
• حمایت بی‌نظیر خانواده‌ها و معلمان
• آمادگی جسمانی و تکنیکی مناسب`,
    summary: 'تیم فوتبال دبیرستان معراج با پیروزی در فینال مسابقات منطقه‌ای، عنوان قهرمانی را کسب کرد.',
    image: '/images/news2.jpg',
    publishDate: new Date('2024-01-14T14:30:00Z'),
    updatedAt: new Date('2024-01-14T14:30:00Z'),
    status: 'published',
    tags: ['ورزشی', 'افتخارات', 'فوتبال'],
    stockTickers: [],
    views: 2100,
    likes: 156,
    likedBy: [],
    date: new Date('2024-01-14T14:30:00Z'),
    author: {
      userId: '2',
      fullName: 'مربی ورزشی',
      email: 'sport@merajschool.ir'
    }
  },
  {
    title: 'برگزاری مسابقه کتابخوانی مدرسه‌ای',
    slug: 'school-reading-competition',
    content: `مسابقه کتابخوانی سالانه مدرسه با حضور گسترده دانش‌آموزان برگزار شد.

این مسابقه که با هدف ترویج فرهنگ مطالعه و کتابخوانی برگزار می‌شود، امسال با استقبال بی‌نظیر دانش‌آموزان مواجه شد. بیش از 200 دانش‌آموز در این مسابقه شرکت کردند و کتاب‌های مختلفی را مطالعه و نقد کردند.

مراحل مسابقه:
• مرحله اول: مطالعه کتاب‌های انتخابی
• مرحله دوم: ارائه خلاصه و نقد
• مرحله سوم: مسابقه حضوری
• مرحله نهایی: اعلام برندگان`,
    summary: 'مسابقه کتابخوانی سالانه مدرسه با حضور گسترده دانش‌آموزان و با هدف ترویج فرهنگ مطالعه برگزار شد.',
    image: '/images/news3.jpg',
    publishDate: new Date('2024-01-13T09:15:00Z'),
    updatedAt: new Date('2024-01-13T09:15:00Z'),
    status: 'published',
    tags: ['فرهنگی', 'آموزشی', 'کتابخوانی'],
    stockTickers: [],
    views: 980,
    likes: 52,
    likedBy: [],
    date: new Date('2024-01-13T09:15:00Z'),
    author: {
      userId: '3',
      fullName: 'معاون فرهنگی',
      email: 'cultural@merajschool.ir'
    }
  }
];

export const faqData: Partial<IFAQ>[] = [
  {
    question: 'نحوه ثبت‌نام در مدرسه چگونه است؟',
    answer: 'ثبت‌نام از طریق سایت مدرسه و به صورت آنلاین انجام می‌شود.',
    category: 'ثبت‌نام',
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: 'آیا کلاس‌های تقویتی برگزار می‌شود؟',
    answer: 'بله، کلاس‌های تقویتی در تمام دروس اصلی برگزار می‌شود.',
    category: 'آموزش',
    order: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const classData: Partial<IClass>[] = [
  {
    title: 'کلاس هفتم الف',
    teacher: 'استاد احمدی',
    schedule: 'شنبه تا چهارشنبه 8 تا 12',
    description: 'کلاس هفتم الف با امکانات هوشمند',
    price: 500000,
    level: 'مقدماتی',
    image: 'https://example.com/class7a.jpg',
    category: 'هفتم',
    views: 0,
    likes: 0,
    capacity: 30,
    enrolledStudents: 0,
    startDate: new Date(),
    endDate: new Date(),
    isActive: true,
    likedBy: [],
    registrations: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'کلاس هشتم ب',
    teacher: 'استاد محمدی',
    schedule: 'شنبه تا چهارشنبه 13 تا 17',
    description: 'کلاس هشتم ب با امکانات هوشمند',
    price: 600000,
    level: 'متوسط',
    image: 'https://example.com/class8b.jpg',
    category: 'هشتم',
    views: 0,
    likes: 0,
    capacity: 30,
    enrolledStudents: 0,
    startDate: new Date(),
    endDate: new Date(),
    isActive: true,
    likedBy: [],
    registrations: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const contentData: Partial<IContent>[] = [
  {
    page: 'about',
    section: 'main',
    data: {
      title: 'درباره مدرسه',
      description: 'مدرسه معراج یکی از بهترین مدارس هوشمند مشهد است.'
    }
  },
  {
    page: 'rules',
    section: 'main',
    data: {
      title: 'قوانین مدرسه',
      description: 'قوانین و مقررات مدرسه معراج'
    }
  }
];

export const pageContentData: Partial<IPageContent>[] = [
  {
    pageId: 'home',
    title: 'صفحه اصلی',
    content: {
      sections: [
        {
          type: 'text',
          content: 'به مدرسه معراج خوش آمدید. مدرسه هوشمند با امکانات پیشرفته.',
          order: 1
        },
        {
          type: 'image',
          content: 'https://example.com/hero.jpg',
          order: 2,
          metadata: {
            alt: 'تصویر مدرسه'
          }
        }
      ]
    },
    isActive: true,
    lastModifiedBy: new mongoose.Types.ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]; 
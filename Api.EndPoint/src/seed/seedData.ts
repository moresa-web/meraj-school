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
  siteUrl: 'https://mohammadrezasardashti.ir',
  siteName: 'دبیرستان پسرانه معراج',
  siteDescription: 'دبیرستان پسرانه معراج، مدرسه‌ای هوشمند در مشهد با امکانات پیشرفته آموزشی، کلاس‌های تقویتی، ثبت‌نام آنلاین و سیستم مدیریت هوشمند برای دانش‌آموزان و والدین.',
  keywords: [
    'دبیرستان پسرانه معراج',
    'مدرسه هوشمند مشهد',
    'کلاس تقویتی',
    'ثبت‌نام آنلاین',
    'اخبار مدرسه',
    'مشهد',
    'آموزش'
  ],
  updatedAt: new Date()
};

export const newsData: Partial<INews>[] = [
  {
    title: 'افتتاح آزمایشگاه جدید',
    slug: 'افتتاح-آزمایشگاه-جدید',
    content: 'آزمایشگاه جدید مدرسه با امکانات پیشرفته افتتاح شد.',
    summary: 'آزمایشگاه جدید مدرسه افتتاح شد.',
    image: 'https://example.com/lab.jpg',
    publishDate: new Date(),
    updatedAt: new Date(),
    status: 'published',
    tags: ['آزمایشگاه', 'مدرسه'],
    stockTickers: [],
    views: 0,
    likes: 0,
    likedBy: [],
    date: new Date()
  },
  {
    title: 'برگزاری مسابقات علمی',
    slug: 'برگزاری-مسابقات-علمی',
    content: 'مسابقات علمی سالانه مدرسه در تاریخ 15 خرداد برگزار خواهد شد.',
    summary: 'مسابقات علمی سالانه مدرسه برگزار می‌شود.',
    image: 'https://example.com/competition.jpg',
    publishDate: new Date(),
    updatedAt: new Date(),
    status: 'published',
    tags: ['مسابقه', 'علمی'],
    stockTickers: [],
    views: 0,
    likes: 0,
    likedBy: [],
    date: new Date()
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
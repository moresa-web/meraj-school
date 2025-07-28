import { SchoolInfo } from '../models/SchoolInfo';
import SEO from '../models/SEO';
import News from '../models/News';
import { FAQ } from '../models/FAQ';
import { Class } from '../models/Class';
import { Content } from '../models/Content';
import PageContent from '../models/PageContent';
import {
  schoolInfoData,
  seoData,
  newsData,
  faqData,
  classData,
  contentData,
  pageContentData
} from './seedData';

export const seedDatabase = async () => {
  try {
    // پاک کردن داده‌های قبلی
    await SchoolInfo.deleteMany({});
    await SEO.deleteMany({});
    await News.deleteMany({});
    await FAQ.deleteMany({});
    await Class.deleteMany({});
    await Content.deleteMany({});
    await PageContent.deleteMany({});

    // وارد کردن داده‌های جدید
    await SchoolInfo.create(schoolInfoData);
    await SEO.create(seoData);
    await News.insertMany(newsData);
    await FAQ.insertMany(faqData);
    await Class.insertMany(classData);
    await Content.insertMany(contentData);
    await PageContent.insertMany(pageContentData);

    console.log('داده‌های تست با موفقیت وارد شدند.');
  } catch (error) {
    console.error('خطا در وارد کردن داده‌های تست:', error);
    throw error;
  }
}; 
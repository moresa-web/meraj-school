import mongoose from 'mongoose';
import News from '../models/News';
import dotenv from 'dotenv';

dotenv.config();

const sampleNews = [
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
    category: 'اخبار مدرسه',
    author: {
      userId: '1',
      fullName: 'مدیریت مدرسه',
      email: 'admin@merajschool.ir'
    },
    image: '/images/news1.jpg',
    publishDate: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    status: 'published',
    tags: ['آموزشی', 'علمی', 'آزمایشگاه'],
    stockTickers: [],
    views: 1250,
    likes: 89,
    likedBy: [],
    date: new Date('2024-01-15T10:00:00Z')
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
    category: 'افتخارات',
    author: {
      userId: '2',
      fullName: 'مربی ورزشی',
      email: 'sport@merajschool.ir'
    },
    image: '/images/news2.jpg',
    publishDate: new Date('2024-01-14T14:30:00Z'),
    updatedAt: new Date('2024-01-14T14:30:00Z'),
    status: 'published',
    tags: ['ورزشی', 'افتخارات', 'فوتبال'],
    stockTickers: [],
    views: 2100,
    likes: 156,
    likedBy: [],
    date: new Date('2024-01-14T14:30:00Z')
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
    category: 'فرهنگی',
    author: {
      userId: '3',
      fullName: 'معاون فرهنگی',
      email: 'cultural@merajschool.ir'
    },
    image: '/images/news3.jpg',
    publishDate: new Date('2024-01-13T09:15:00Z'),
    updatedAt: new Date('2024-01-13T09:15:00Z'),
    status: 'published',
    tags: ['فرهنگی', 'آموزشی', 'کتابخوانی'],
    stockTickers: [],
    views: 980,
    likes: 52,
    likedBy: [],
    date: new Date('2024-01-13T09:15:00Z')
  }
];

const addNews = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj-school';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing news
    await News.deleteMany({});
    console.log('Cleared existing news');

    // Insert news items one by one
    for (const newsData of sampleNews) {
      try {
        const news = new News(newsData);
        await news.save();
        console.log(`Added news: ${news.title} (slug: ${news.slug})`);
      } catch (error) {
        console.error(`Error adding news "${newsData.title}":`, (error as Error).message);
      }
    }

    console.log('News addition completed successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the function
addNews(); 
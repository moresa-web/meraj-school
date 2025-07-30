import mongoose from 'mongoose';
import { Content } from '../models/Content';
import dotenv from 'dotenv';

dotenv.config();

const missingContent = [
  // Stats Section
  {
    page: 'home',
    section: 'stats',
    data: {
      title: 'آمار و دستاوردهای ما',
      description: 'در طول سال‌های فعالیت، افتخار خدمت به هزاران دانش‌آموز و خانواده‌های محترم را داشته‌ایم.',
      stats: [
        { 
          number: '۲۰+', 
          text: 'سال تجربه آموزشی',
          icon: 'graduation'
        },
        { 
          number: '۵۰+', 
          text: 'معلم مجرب',
          icon: 'teacher'
        },
        { 
          number: '۱۰۰۰+', 
          text: 'دانش‌آموز موفق',
          icon: 'student'
        },
        { 
          number: '۹۵٪', 
          text: 'قبولی در دانشگاه',
          icon: 'trophy'
        }
      ]
    }
  },
  // Testimonials Section
  {
    page: 'home',
    section: 'testimonials',
    data: {
      title: 'نظرات دانش‌آموزان و والدین',
      description: 'تجربیات و نظرات افرادی که با ما همکاری داشته‌اند',
      testimonials: [
        {
          name: 'علی محمدی',
          role: 'والد دانش‌آموز',
          text: 'با تشکر از کادر مجرب مدرسه معراج که با تلاش و پشتکار خود باعث پیشرفت تحصیلی فرزندم شدند. محیط آموزشی عالی و معلمان دلسوزی دارد.',
          rating: 5
        },
        {
          name: 'مریم احمدی',
          role: 'دانش‌آموز',
          text: 'فضای آموزشی مدرسه معراج بسیار عالی است و معلمان دلسوز و با تجربه‌ای دارد. برنامه‌های فوق‌العاده و امکانات خوبی دارد.',
          rating: 5
        },
        {
          name: 'رضا کریمی',
          role: 'والد دانش‌آموز',
          text: 'برنامه‌ریزی دقیق و مشاوره‌های تحصیلی مدرسه معراج کمک زیادی به آینده تحصیلی فرزندم کرد. از کادر آموزشی راضی هستم.',
          rating: 5
        }
      ]
    }
  },
  // Latest News Section
  {
    page: 'home',
    section: 'latestNews',
    data: {
      title: 'آخرین اخبار',
      description: 'جدیدترین اخبار و رویدادهای دبیرستان معراج',
      showViewAll: true,
      viewAllText: 'مشاهده همه اخبار',
      viewAllLink: '/news'
    }
  },
  // Features Section
  {
    page: 'home',
    section: 'features',
    data: {
      title: 'ویژگی‌های مدرسه',
      subtitle: 'چرا دبیرستان معراج را انتخاب کنید؟',
      features: [
        {
          title: 'آموزش با کیفیت',
          description: 'با بهترین معلمان و روش‌های آموزشی روز دنیا',
          icon: 'graduation'
        },
        {
          title: 'امکانات پیشرفته',
          description: 'کلاس‌های مجهز و تکنولوژی‌های نوین آموزشی',
          icon: 'building'
        },
        {
          title: 'محیط امن',
          description: 'محیطی امن و مناسب برای رشد و پیشرفت دانش‌آموزان',
          icon: 'security'
        }
      ]
    }
  },
  // CTA Section
  {
    page: 'home',
    section: 'cta',
    data: {
      title: 'آماده‌ای برای شروع؟',
      description: 'همین حالا به خانواده بزرگ مدرسه معراج بپیوندید و از امکانات آموزشی منحصر به فرد ما بهره‌مند شوید.',
      primaryButton: {
        text: 'ثبت‌نام کلاس‌های تقویتی',
        link: '/classes'
      },
      secondaryButton: {
        text: 'تماس با ما',
        link: '/contact'
      },
      features: [
        {
          title: 'کیفیت آموزشی بالا',
          description: 'با بهترین معلمان و روش‌های آموزشی روز دنیا',
          icon: 'graduation'
        },
        {
          title: 'امکانات پیشرفته',
          description: 'کلاس‌های مجهز و تکنولوژی‌های نوین آموزشی',
          icon: 'building'
        },
        {
          title: 'پشتیبانی 24/7',
          description: 'همیشه در کنار شما برای پاسخگویی به سوالات',
          icon: 'support'
        }
      ]
    }
  },
  // About Hero Section
  {
    page: 'about',
    section: 'hero',
    data: {
      title: 'درباره دبیرستان معراج',
      description: 'مدرسه‌ای با بیش از 20 سال سابقه در ارائه خدمات آموزشی با کیفیت'
    }
  },
  // About Main Section
  {
    page: 'about',
    section: 'main',
    data: {
      title: 'تاریخچه و افتخارات',
      description: 'دبیرستان معراج از سال 1380 فعالیت خود را آغاز کرده و در این مدت افتخارات بسیاری کسب کرده است.',
      image: '/images/about-school.png',
      stats: {
        students: '500+',
        teachers: '50+',
        years: '20+',
        awards: '100+'
      }
    }
  },
  // News Hero Section
  {
    page: 'news',
    section: 'hero',
    data: {
      title: 'اخبار و رویدادها',
      description: 'آخرین اخبار، اطلاعیه‌ها و رویدادهای دبیرستان معراج را دنبال کنید',
      stats: {
        totalNews: '۲۵۰+',
        totalViews: '۱۵۰K+',
        totalLikes: '۱۲K+'
      }
    }
  },
  // Contact Main Section
  {
    page: 'contact',
    section: 'main',
    data: {
      heroTitle: 'تماس با ما',
      heroDescription: 'راه‌های ارتباطی با دبیرستان معراج',
      contactInfo: {
        address: 'مشهد، خیابان امام رضا، خیابان معراج، دبیرستان معراج',
        phone: '(۰۵۱) ۳۸۹۳۲۰۳۰',
        email: 'info@meraj-school.ir'
      },
      sectionTitles: {
        contactForm: 'ارسال پیام',
        contactInfo: 'اطلاعات تماس',
        location: 'موقعیت مکانی'
      },
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3257.1234567890123!2d59.12345678901234!3d36.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDA3JzI0LjUiTiA1OcKwMDcnMjQuNSJF!5e0!3m2!1sen!2sir!4v1234567890123!5m2!1sen!2sir',
      mapLocation: {
        lat: 36.2972,
        lng: 59.6067
      }
    }
  },
  // Contact Info Section
  {
    page: 'contact',
    section: 'info',
    data: {
      title: 'اطلاعات تماس',
      subtitle: 'راه‌های مختلف ارتباطی با دبیرستان معراج',
      contactInfo: [
        {
          icon: 'MapPin',
          title: 'آدرس',
          value: 'مشهد، خیابان امام رضا، خیابان معراج، دبیرستان معراج',
          description: 'دفتر مرکزی دبیرستان'
        },
        {
          icon: 'Phone',
          title: 'تلفن',
          value: '(۰۵۱) ۳۸۹۳۲۰۳۰',
          description: 'شنبه تا چهارشنبه ۸ صبح تا ۴ عصر'
        },
        {
          icon: 'Mail',
          title: 'ایمیل',
          value: 'info@meraj-school.ir',
          description: 'پاسخگویی در کمتر از ۲۴ ساعت'
        },
        {
          icon: 'Clock',
          title: 'ساعات کاری',
          value: '۸:۰۰ - ۱۶:۰۰',
          description: 'شنبه تا چهارشنبه'
        },
        {
          icon: 'Users',
          title: 'پشتیبانی',
          value: '۲۴/۷',
          description: 'پشتیبانی آنلاین'
        },
        {
          icon: 'Globe',
          title: 'وب‌سایت',
          value: 'www.meraj-school.ir',
          description: 'اطلاعات بیشتر'
        }
      ],
      ctaTitle: 'نیاز به راهنمایی دارید؟',
      ctaText: 'تیم پشتیبانی ما آماده پاسخگویی به سوالات شما در هر زمان از شبانه‌روز است.'
    }
  },
  // Classes Hero Section
  {
    page: 'classes',
    section: 'hero',
    data: {
      title: 'کلاس‌های تقویتی',
      description: 'با بهترین اساتید و روش‌های نوین آموزشی، آینده تحصیلی فرزندتان را تضمین کنید',
      stats: {
        totalClasses: 15,
        activeStudents: 500,
        successRate: 95,
        totalHours: 480
      }
    }
  },
  // Classes Features Section
  {
    page: 'classes',
    section: 'features',
    data: {
      title: 'مزایای کلاس‌های تقویتی',
      subtitle: 'چرا کلاس‌های تقویتی دبیرستان معراج؟',
      features: [
        {
          title: 'اساتید مجرب',
          description: 'تدریس توسط اساتید با تجربه و متخصص در هر زمینه',
          icon: 'GraduationCap'
        },
        {
          title: 'کلاس‌های کم‌جمعیت',
          description: 'کلاس‌های با تعداد محدود دانش‌آموز برای یادگیری بهتر',
          icon: 'Users'
        },
        {
          title: 'برنامه‌ریزی شخصی',
          description: 'برنامه‌ریزی آموزشی متناسب با سطح و نیاز هر دانش‌آموز',
          icon: 'ClipboardList'
        },
        {
          title: 'امکانات دیجیتال',
          description: 'استفاده از تکنولوژی‌های نوین آموزشی و نرم‌افزارهای تخصصی',
          icon: 'Monitor'
        },
        {
          title: 'گزارش‌گیری منظم',
          description: 'ارائه گزارش‌های منظم از پیشرفت تحصیلی دانش‌آموزان',
          icon: 'BarChart3'
        },
        {
          title: 'زمان‌بندی انعطاف‌پذیر',
          description: 'زمان‌بندی کلاس‌ها متناسب با برنامه دانش‌آموزان',
          icon: 'Clock'
        },
        {
          title: 'گواهی پایان دوره',
          description: 'اعطای گواهی معتبر پایان دوره به دانش‌آموزان',
          icon: 'Award'
        },
        {
          title: 'پشتیبانی آموزشی',
          description: 'پشتیبانی و راهنمایی مستمر در طول دوره آموزشی',
          icon: 'Shield'
        },
        {
          title: 'آزمون‌های استاندارد',
          description: 'برگزاری آزمون‌های استاندارد و شبیه‌سازی کنکور برای آمادگی بهتر',
          icon: 'Target'
        }
      ]
    }
  },
  // Classes List Section
  {
    page: 'classes',
    section: 'list',
    data: {
      title: 'کلاس‌های موجود',
      subtitle: 'کلاس یافت شد'
    }
  },
  // About Stats Section
  {
    page: 'about',
    section: 'stats',
    data: {
      title: 'آمار و ارقام',
      description: 'دستاوردهای دبیرستان معراج در طول سال‌های فعالیت',
      stats: [
        {
          number: '500+',
          label: 'دانش‌آموز',
          description: 'دانش‌آموزان فعال در حال تحصیل'
        },
        {
          number: '50+',
          label: 'استاد',
          description: 'اساتید مجرب و متخصص'
        },
        {
          number: '20+',
          label: 'سال تجربه',
          description: 'سابقه درخشان در آموزش'
        },
        {
          number: '98%',
          label: 'رضایت',
          description: 'رضایت والدین و دانش‌آموزان'
        }
      ]
    }
  },
  // About Timeline Section
  {
    page: 'about',
    section: 'timeline',
    data: {
      title: 'تاریخچه مدرسه معراج',
      description: 'مروری بر مهم‌ترین رویدادها و دستاوردهای مدرسه در طول سال‌های فعالیت',
      timelineEvents: [
        {
          year: '1380',
          event: 'تأسیس مدرسه',
          description: 'دبیرستان معراج با هدف ارائه آموزش با کیفیت تأسیس شد.',
          icon: 'Building',
          achievement: 'شروع فعالیت'
        },
        {
          year: '1385',
          event: 'افتتاح ساختمان جدید',
          description: 'ساختمان جدید مدرسه با امکانات مدرن افتتاح شد.',
          icon: 'Building2',
          achievement: 'توسعه امکانات'
        },
        {
          year: '1390',
          event: 'کسب رتبه برتر',
          description: 'مدرسه در رتبه‌بندی مدارس برتر کشور قرار گرفت.',
          icon: 'Trophy',
          achievement: 'رتبه برتر'
        },
        {
          year: '1395',
          event: 'راه‌اندازی کلاس‌های هوشمند',
          description: 'تمام کلاس‌ها به سیستم‌های هوشمند مجهز شدند.',
          icon: 'Monitor',
          achievement: 'هوشمندسازی'
        },
        {
          year: '1400',
          event: 'پذیرش 1000 دانش‌آموز',
          description: 'تعداد دانش‌آموزان مدرسه به 1000 نفر رسید.',
          icon: 'Users',
          achievement: '1000 دانش‌آموز'
        },
        {
          year: '2023',
          event: 'جشن 20 سالگی و آینده‌نگری',
          description: 'جشن 20 سالگی مدرسه با حضور دانش‌آموزان، والدین و همکاران. برنامه‌ریزی برای توسعه بیشتر و پذیرش دانش‌آموزان جدید.',
          icon: 'PartyPopper',
          achievement: '20 سال تجربه'
        }
      ],
      stats: {
        years: '20+',
        students: '500+',
        awards: '50+'
      }
    }
  },
  // Hero Section with updated logo
  {
    page: 'home',
    section: 'hero',
    data: {
      logo: '/uploads/1753700617990-616076321.png',
      title: 'دبیرستان معراج',
      description: 'دبیرستان معراج - مرکز آموزش و پرورش با کیفیت و استانداردهای جهانی',
      primaryButton: {
        text: 'شروع کنید',
        link: '/classes'
      },
      secondaryButton: {
        text: 'درباره ما',
        link: '/about'
      }
    }
  }
];

const addMissingContent = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj-school';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Add each missing content section
    for (const contentData of missingContent) {
      try {
        // Check if content already exists
        const existingContent = await Content.findOne({ 
          page: contentData.page, 
          section: contentData.section 
        });

        if (existingContent) {
          // Update existing content
          await Content.findOneAndUpdate(
            { page: contentData.page, section: contentData.section },
            { $set: { data: contentData.data } },
            { new: true }
          );
          console.log(`Updated content: ${contentData.page}/${contentData.section}`);
        } else {
          // Create new content
          const newContent = new Content(contentData);
          await newContent.save();
          console.log(`Added content: ${contentData.page}/${contentData.section}`);
        }
      } catch (error) {
        console.error(`Error processing ${contentData.page}/${contentData.section}:`, (error as Error).message);
      }
    }

    console.log('Content addition/update completed successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the function
addMissingContent(); 
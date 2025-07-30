import mongoose from 'mongoose';
import { Content } from '../models/Content';
import dotenv from 'dotenv';

dotenv.config();

const seedContent = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj-school';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Default content for all sections
    const defaultContent = [
      // Home page sections
      {
        page: 'home',
        section: 'hero',
        data: {
          logo: '/images/logo.png',
          title: 'دبیرستان معراج',
          description: 'دبیرستان معراج - مرکز آموزش و پرورش با کیفیت و استانداردهای جهانی'
        }
      },
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
      {
        page: 'home',
        section: 'stats',
        data: {
          stats: [
            {
              number: '۲۰+',
              text: 'سال تجربه آموزشی'
            },
            {
              number: '۵۰+',
              text: 'معلم مجرب'
            },
            {
              number: '۱۰۰۰+',
              text: 'دانش‌آموز موفق'
            },
            {
              number: '۹۵٪',
              text: 'قبولی در دانشگاه'
            }
          ]
        }
      },
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

      // Classes page sections
      {
        page: 'classes',
        section: 'list',
        data: {
          title: 'کلاس‌های موجود',
          subtitle: 'کلاس یافت شد'
        }
      },
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
      {
        page: 'classes',
        section: 'features',
        data: {
          title: 'مزایای کلاس‌های تقویتی',
          subtitle: 'چرا باید کلاس‌های تقویتی معراج را انتخاب کنید؟',
          features: [
            {
              title: 'اساتید مجرب',
              description: 'با بیش از 20 سال تجربه در تدریس و آماده‌سازی دانش‌آموزان برای کنکور',
              icon: 'GraduationCap'
            },
            {
              title: 'کلاس‌های کوچک',
              description: 'حداکثر 15 دانش‌آموز در هر کلاس برای یادگیری بهتر و توجه بیشتر',
              icon: 'Users'
            },
            {
              title: 'مشاوره تحصیلی',
              description: 'مشاوره تخصصی برای انتخاب رشته و برنامه‌ریزی تحصیلی',
              icon: 'ClipboardList'
            },
            {
              title: 'امکانات مدرن',
              description: 'کلاس‌های مجهز به تکنولوژی‌های نوین آموزشی',
              icon: 'Monitor'
            },
            {
              title: 'گزارش پیشرفت',
              description: 'گزارش‌های منظم از پیشرفت تحصیلی دانش‌آموزان',
              icon: 'BarChart3'
            },
            {
              title: 'پشتیبانی 24/7',
              description: 'پشتیبانی کامل در تمام ساعات شبانه‌روز',
              icon: 'Clock'
            }
          ]
        }
      },

      // Contact page sections
      {
        page: 'contact',
        section: 'main',
        data: {
          title: 'تماس با ما',
          description: 'برای ارتباط با ما می‌توانید از طریق فرم زیر یا اطلاعات تماس با ما در ارتباط باشید.',
          address: 'بلوار دانش آموز، دانش آموز 10',
          phone: '+985138932030',
          email: 'info@merajschool.ir',
          socialMedia: {
            instagram: 'https://www.instagram.com/merajschool/',
            twitter: '@MerajSchoolIR'
          },
          mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3257.1234567890123!2d59.12345678901234!3d36.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDA3JzI0LjUiTiA1OcKwMDcnMjQuNSJF!5e0!3m2!1sen!2sir!4v1234567890123!5m2!1sen!2sir',
          mapLocation: {
            lat: 36.2972,
            lng: 59.6067
          }
        }
      },
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

      // About page sections
      {
        page: 'about',
        section: 'hero',
        data: {
          title: 'درباره دبیرستان معراج',
          description: 'مدرسه‌ای با بیش از 20 سال سابقه در ارائه خدمات آموزشی با کیفیت'
        }
      },
      {
        page: 'about',
        section: 'main',
        data: {
          title: 'تاریخچه و افتخارات',
          description: 'دبیرستان معراج از سال 1380 فعالیت خود را آغاز کرده و در این مدت افتخارات بسیاری کسب کرده است.',
          stats: {
            students: '500+',
            teachers: '50+',
            years: '20+',
            awards: '100+'
          }
        }
      },
      {
        page: 'about',
        section: 'features',
        data: {
          title: 'ویژگی‌های منحصر به فرد',
          subtitle: 'چرا دبیرستان معراج؟',
          features: [
            {
              title: 'آموزش با کیفیت',
              description: 'با بهترین معلمان و روش‌های آموزشی',
              icon: 'graduation'
            },
            {
              title: 'امکانات مدرن',
              description: 'کلاس‌های مجهز به تکنولوژی‌های نوین',
              icon: 'building'
            },
            {
              title: 'محیط امن',
              description: 'محیطی امن و مناسب برای رشد',
              icon: 'security'
            }
          ]
        }
      },
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
      {
        page: 'about',
        section: 'team',
        data: {
          title: 'تیم مدیریتی',
          description: 'تیم متخصص و با تجربه ما متعهد به ارائه بهترین خدمات آموزشی و پرورشی به دانش‌آموزان است',
          teamMembers: [
            {
              name: 'دکتر احمد محمدی',
              role: 'مدیر مدرسه',
              bio: 'دکتر محمدی با بیش از 15 سال تجربه در مدیریت آموزشی، هدایت مدرسه معراج را بر عهده دارد.',
              avatar: 'Crown'
            },
            {
              name: 'خانم فاطمه احمدی',
              role: 'معاون آموزشی',
              bio: 'خانم احمدی متخصص در برنامه‌ریزی آموزشی و نظارت بر کیفیت تدریس است.',
              avatar: 'GraduationCap'
            },
            {
              name: 'استاد محمود کریمی',
              role: 'مشاور تحصیلی',
              bio: 'استاد کریمی با تخصص در روانشناسی تحصیلی، راهنمای دانش‌آموزان در مسیر موفقیت است.',
              avatar: 'UserCheck'
            },
            {
              name: 'خانم زهرا نوری',
              role: 'مسئول امور دانش‌آموزی',
              bio: 'خانم نوری مسئولیت نظارت بر امور دانش‌آموزی و ارتباط با والدین را بر عهده دارد.',
              avatar: 'Users'
            }
          ]
        }
      },
      {
        page: 'about',
        section: 'timeline',
        data: {
          title: 'تاریخچه مدرسه معراج',
          description: 'مروری بر مهم‌ترین رویدادها و دستاوردهای مدرسه در طول سال‌های فعالیت',
          events: [
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

      // News page sections
      {
        page: 'news',
        section: 'hero',
        data: {
          title: "اخبار و رویدادها",
          description: "آخرین اخبار و رویدادهای دبیرستان معراج"
        }
      }
    ];

    // Insert or update content
    for (const contentItem of defaultContent) {
      await Content.findOneAndUpdate(
        { page: contentItem.page, section: contentItem.section },
        { $set: { data: contentItem.data } },
        { upsert: true, new: true }
      );
      console.log(`✅ Content updated for ${contentItem.page}/${contentItem.section}`);
    }

    console.log('🎉 Content seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding content:', error);
    process.exit(1);
  }
};

seedContent(); 
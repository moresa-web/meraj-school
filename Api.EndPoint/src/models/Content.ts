import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContent extends Document {
  page: string;
  section: string;
  data: {
    logo?: string;
    title?: string;
    description?: string;
    heroImage?: string;
    features?: {
      title: string;
      description: string;
      icon: string;
    }[];
    [key: string]: any;
  };
}

interface IContentModel extends Model<IContent> {
  getContentWithDefaults(page: string, section: string): Promise<IContent | null>;
}

const defaultContent: Record<string, Record<string, any>> = {
  home: {
    hero: {
      logo: '/images/logo.png',
      title: 'مدرسه معراج',
      description: 'به مدرسه معراج خوش آمدید. اینجا جایی است که دانش‌آموزان می‌توانند در محیطی امن و پویا به یادگیری بپردازند.',
      heroImage: '/images/hero-bg.jpg'
    },
    features: {
      title: 'ویژگی‌های مدرسه',
      description: 'مدرسه معراج با امکانات و ویژگی‌های منحصر به فرد',
      features: [
        {
          title: 'آموزش با کیفیت',
          description: 'با استفاده از جدیدترین متدهای آموزشی و اساتید مجرب',
          icon: 'book'
        },
        {
          title: 'محیط امن',
          description: 'محیطی امن و مناسب برای رشد و پیشرفت دانش‌آموزان',
          icon: 'building'
        },
        {
          title: 'فعالیت‌های متنوع',
          description: 'برنامه‌های متنوع آموزشی و تفریحی برای دانش‌آموزان',
          icon: 'users'
        }
      ]
    },
    news: {
      title: 'آخرین اخبار',
      description: 'جدیدترین اخبار و رویدادهای مدرسه مرج',
      news: [
        {
          _id: '1',
          title: 'افتتاح آزمایشگاه جدید',
          description: 'آزمایشگاه جدید با تجهیزات پیشرفته برای دانش‌آموزان افتتاح شد',
          image: '/images/news/lab.jpg',
          date: '۱۴۰۲/۱۲/۱۵',
          category: 'اخبار مدرسه',
          views: 0,
          likes: 0,
          likedBy: []
        },
        {
          _id: '2',
          title: 'برگزاری مسابقات علمی',
          description: 'مسابقات علمی سالانه با حضور دانش‌آموزان برتر برگزار شد',
          image: '/images/news/competition.jpg',
          date: '۱۴۰۲/۱۲/۱۰',
          category: 'مسابقات',
          views: 0,
          likes: 0,
          likedBy: []
        },
        {
          _id: '3',
          title: 'افتخارات دانش‌آموزان',
          description: 'دانش‌آموزان مدرسه در المپیادهای علمی موفق به کسب رتبه شدند',
          image: '/images/news/achievements.jpg',
          date: '۱۴۰۲/۱۲/۰۵',
          category: 'افتخارات',
          views: 0,
          likes: 0,
          likedBy: []
        }
      ]
    },
    testimonials: {
      title: 'نظرات والدین',
      description: 'آنچه والدین درباره مدرسه معراج می‌گویند',
      testimonials: [
        {
          _id: '1',
          name: 'علی محمدی',
          role: 'والد دانش‌آموز کلاس سوم',
          text: 'از زمانی که فرزندم به مدرسه معراج آمده، پیشرفت قابل توجهی در یادگیری داشته است.',
          image: '/images/testimonials/parent1.jpg'
        },
        {
          _id: '2',
          name: 'مریم احمدی',
          role: 'والد دانش‌آموز کلاس پنجم',
          text: 'برنامه‌های آموزشی و تفریحی مدرسه بسیار متنوع و جذاب است.',
          image: '/images/testimonials/parent2.jpg'
        },
        {
          _id: '3',
          name: 'رضا کریمی',
          role: 'والد دانش‌آموز کلاس دوم',
          text: 'معلمان دلسوز و محیط آموزشی مناسب، مدرسه معراج را به یکی از بهترین مدارس تبدیل کرده است.',
          image: '/images/testimonials/parent3.jpg'
        }
      ]
    },
    cta: {
      title: 'به خانواده معراج بپیوندید',
      description: 'برای ثبت‌نام و کسب اطلاعات بیشتر با ما در تماس باشید',
      primaryButton: {
        text: 'ثبت‌نام کلاس‌های تقویتی',
        link: '/classes'
      },
      secondaryButton: {
        text: 'تماس با ما',
        link: '/contact'
      }
    },
    stats: {
      title: 'آمار مدرسه',
      description: 'آمار و ارقام مدرسه معراج',
      stats: [
        { number: '۲۰+', text: 'سال تجربه آموزشی' },
        { number: '۵۰+', text: 'معلم مجرب' },
        { number: '۱۰۰۰+', text: 'دانش‌آموز موفق' },
        { number: '۹۵٪', text: 'قبولی در دانشگاه' }
      ]
    }
  },
  about: {
    main: {
      mainTitle: 'دبیرستان معراج',
      mainDescription: 'دبیرستان معراج با بیش از 20 سال سابقه درخشان در زمینه آموزش و پرورش، همواره در تلاش بوده است تا با بهره‌گیری از اساتید مجرب و امکانات آموزشی پیشرفته، محیطی مناسب برای رشد و شکوفایی استعدادهای دانش‌آموزان فراهم کند.\n\nما معتقدیم که هر دانش‌آموز دارای استعدادهای منحصر به فردی است و وظیفه ما کشف و پرورش این استعدادهاست. با برنامه‌های آموزشی متنوع و کلاس‌های تقویتی، تلاش می‌کنیم تا دانش‌آموزان را برای موفقیت در آینده آماده کنیم.',
      features: [
        {
          title: 'آموزش با کیفیت',
          description: 'استفاده از اساتید مجرب و روش‌های نوین آموزشی'
        },
        {
          title: 'امکانات پیشرفته',
          description: 'آزمایشگاه‌های مجهز و کلاس‌های هوشمند'
        },
        {
          title: 'مشاوره تحصیلی',
          description: 'مشاوره تخصصی برای انتخاب رشته و برنامه‌ریزی تحصیلی'
        }
      ]
    }
  }
};

const ContentSchema: Schema = new Schema({
  page: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  data: {
    type: Schema.Types.Mixed,
    required: true,
    default: {}
  }
}, {
  timestamps: true
});

// متد استاتیک برای دریافت محتوا با اطلاعات پیش‌فرض
ContentSchema.statics.getContentWithDefaults = async function(page: string, section: string) {
  try {
    console.log('Searching for content:', { page, section });
    
    const content = await this.findOne({ page, section });
    console.log('Found content:', content);
    
    if (content) {
      return content;
    }
    
    // اگر محتوایی وجود نداشت، اطلاعات پیش‌فرض را برمی‌گرداند
    if (defaultContent[page]?.[section]) {
      console.log('Creating new content with defaults:', defaultContent[page][section]);
      
      const newContent = new this({
        page,
        section,
        data: defaultContent[page][section]
      });
      
      await newContent.save();
      console.log('Saved new content:', newContent);
      
      return newContent;
    }
    
    console.log('No content found and no defaults available');
    return null;
  } catch (error) {
    console.error('Error in getContentWithDefaults:', error);
    throw error;
  }
};

// حذف ایندکس‌های قبلی
ContentSchema.index({ page: 1, section: 1 }, { unique: true });

export const Content = mongoose.model<IContent, IContentModel>('Content', ContentSchema); 
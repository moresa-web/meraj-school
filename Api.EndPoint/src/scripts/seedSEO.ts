import mongoose from 'mongoose';
import SEO from '../models/SEO';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj-school';

const seoData = {
  title: 'دبیرستان پسرانه معراج | مدرسه هوشمند در مشهد',
  description: 'دبیرستان پسرانه معراج، مدرسه‌ای هوشمند در مشهد با امکانات پیشرفته آموزشی، کلاس‌های تقویتی، ثبت‌نام آنلاین و سیستم مدیریت هوشمند برای دانش‌آموزان و والدین.',
  keywords: ['دبیرستان پسرانه معراج', 'مدرسه هوشمند مشهد', 'کلاس تقویتی', 'ثبت‌نام آنلاین', 'اخبار مدرسه', 'مشهد', 'آموزش', 'مدرسه دولتی مشهد'],
  image: 'https://merajfutureschool.ir/images/logo.png',
  siteUrl: 'https://merajfutureschool.ir',
  schoolName: 'دبیرستان پسرانه معراج',
  address: 'بلوار دانش آموز، دانش آموز 10، مشهد مقدس',
  phone: '+985138932030',
  email: 'info@merajschool.ir',
  socialMedia: {
    instagram: 'https://www.instagram.com/merajschool/',
    twitter: '@MerajSchoolIR',
    telegram: 'https://t.me/merajschool',
    linkedin: 'https://linkedin.com/company/merajschool'
  },
  googleAnalyticsId: 'G-XXXXXXXXXX',
  googleTagManagerId: 'GTM-XXXXXXX',
  bingWebmasterTools: 'XXXXXXXXXX',
  yandexWebmaster: 'XXXXXXXXXX',
  defaultTitle: 'دبیرستان پسرانه معراج | مدرسه هوشمند در مشهد',
  defaultDescription: 'دبیرستان پسرانه معراج، مدرسه‌ای هوشمند در مشهد با امکانات پیشرفته آموزشی، کلاس‌های تقویتی، ثبت‌نام آنلاین و سیستم مدیریت هوشمند برای دانش‌آموزان و والدین.',
  defaultKeywords: ['دبیرستان پسرانه معراج', 'مدرسه هوشمند مشهد', 'کلاس تقویتی', 'ثبت‌نام آنلاین', 'اخبار مدرسه', 'مشهد', 'آموزش', 'مدرسه دولتی مشهد'],
  ogImage: 'https://merajfutureschool.ir/images/logo.png',
  twitterImage: 'https://merajfutureschool.ir/images/logo.png',
  favicon: 'https://merajfutureschool.ir/favicon.ico',
  themeColor: '#059669',
  backgroundColor: '#f8fafc',
  latitude: 36.328956,
  longitude: 59.509741,
  openingHours: 'Mo-Fr 07:30-14:30',
  priceRange: '$$',
  foundingDate: '1390',
  numberOfStudents: '500+',
  numberOfTeachers: '30+',
  slogan: 'آموزش با کیفیت، آینده‌سازی موفق',
  awards: ['مدرسه برتر منطقه', 'مدرسه هوشمند نمونه', 'مدرسه سبز'],
  serviceTypes: ['آموزش دوره اول متوسطه', 'کلاس‌های تقویتی', 'فعالیت‌های فوق برنامه', 'مشاوره تحصیلی'],
  curriculum: 'دوره اول متوسطه',
  educationalLevel: 'دوره اول متوسطه',
  structuredData: {
    organization: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "دبیرستان پسرانه معراج",
      "alternateName": "مدرسه معراج",
      "description": "دبیرستان پسرانه معراج، مدرسه‌ای هوشمند در مشهد با امکانات پیشرفته آموزشی، کلاس‌های تقویتی، ثبت‌نام آنلاین و سیستم مدیریت هوشمند برای دانش‌آموزان و والدین.",
      "url": "https://merajfutureschool.ir/",
      "logo": "https://merajfutureschool.ir/images/logo.png",
      "image": "https://merajfutureschool.ir/images/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IR",
        "addressLocality": "مشهد مقدس",
        "addressRegion": "خراسان رضوی",
        "streetAddress": "بلوار دانش آموز، دانش آموز 10"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+985138932030",
        "areaServed": "IR",
        "availableLanguage": ["fa", "en"]
      },
      "sameAs": [
        "https://www.instagram.com/merajschool/",
        "https://twitter.com/MerajSchoolIR",
        "https://t.me/merajschool",
        "https://linkedin.com/company/merajschool"
      ],
      "email": "info@merajschool.ir"
    },
    school: {
      "@context": "https://schema.org",
      "@type": "School",
      "name": "دبیرستان پسرانه معراج",
      "alternateName": "مدرسه معراج",
      "description": "دبیرستان پسرانه معراج، مدرسه‌ای هوشمند در مشهد با امکانات پیشرفته آموزشی، کلاس‌های تقویتی، ثبت‌نام آنلاین و سیستم مدیریت هوشمند برای دانش‌آموزان و والدین.",
      "url": "https://merajfutureschool.ir/",
      "logo": "https://merajfutureschool.ir/images/logo.png",
      "image": "https://merajfutureschool.ir/images/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IR",
        "addressLocality": "مشهد مقدس",
        "addressRegion": "خراسان رضوی",
        "streetAddress": "بلوار دانش آموز، دانش آموز 10"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+985138932030",
        "areaServed": "IR",
        "availableLanguage": ["fa", "en"],
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "07:30",
          "closes": "14:30"
        }
      },
      "sameAs": [
        "https://www.instagram.com/merajschool/",
        "https://twitter.com/MerajSchoolIR",
        "https://t.me/merajschool",
        "https://linkedin.com/company/merajschool"
      ],
      "email": "info@merajschool.ir",
      "openingHours": "Mo-Fr 07:30-14:30",
      "priceRange": "$$",
      "hasMap": "https://www.google.com/maps/place/دبیرستان+پسرانه+معراج+۲مشهد+مقدس/@36.328956,59.509741,17z",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 36.328956,
        "longitude": 59.509741
      },
      "areaServed": {
        "@type": "City",
        "name": "مشهد مقدس",
        "addressCountry": "IR"
      },
      "curriculum": "دوره اول متوسطه",
      "educationalLevel": "دوره اول متوسطه",
      "foundingDate": "1390",
      "numberOfStudents": "500+",
      "numberOfTeachers": "30+",
      "slogan": "آموزش با کیفیت، آینده‌سازی موفق",
      "award": [
        "مدرسه برتر منطقه",
        "مدرسه هوشمند نمونه",
        "مدرسه سبز"
      ],
      "serviceType": [
        "آموزش دوره اول متوسطه",
        "کلاس‌های تقویتی",
        "فعالیت‌های فوق برنامه",
        "مشاوره تحصیلی"
      ]
    },
    localBusiness: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "دبیرستان پسرانه معراج",
      "alternateName": "مدرسه معراج",
      "description": "دبیرستان پسرانه معراج، مدرسه‌ای هوشمند در مشهد با امکانات پیشرفته آموزشی، کلاس‌های تقویتی، ثبت‌نام آنلاین و سیستم مدیریت هوشمند برای دانش‌آموزان و والدین.",
      "url": "https://merajfutureschool.ir/",
      "logo": "https://merajfutureschool.ir/images/logo.png",
      "image": "https://merajfutureschool.ir/images/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IR",
        "addressLocality": "مشهد مقدس",
        "addressRegion": "خراسان رضوی",
        "streetAddress": "بلوار دانش آموز، دانش آموز 10"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+985138932030",
        "areaServed": "IR",
        "availableLanguage": ["fa", "en"]
      },
      "sameAs": [
        "https://www.instagram.com/merajschool/",
        "https://twitter.com/MerajSchoolIR",
        "https://t.me/merajschool",
        "https://linkedin.com/company/merajschool"
      ],
      "email": "info@merajschool.ir",
      "openingHours": "Mo-Fr 07:30-14:30",
      "priceRange": "$$",
      "hasMap": "https://www.google.com/maps/place/دبیرستان+پسرانه+معراج+۲مشهد+مقدس/@36.328956,59.509741,17z",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 36.328956,
        "longitude": 59.509741
      }
    }
  }
};

async function seedSEO() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Clear existing SEO data
    console.log('Clearing existing SEO data...');
    await SEO.deleteMany({});
    console.log('Existing SEO data cleared');

    // Create new SEO document
    console.log('Creating new SEO document...');
    const seo = new SEO(seoData);
    await seo.save();
    console.log('SEO data seeded successfully');

    console.log('SEO Data:', {
      title: seo.title,
      description: seo.description,
      schoolName: seo.schoolName,
      siteUrl: seo.siteUrl
    });

    console.log('SEO seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding SEO data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedSEO(); 
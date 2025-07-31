import { Request, Response } from 'express';
import SEO from '../models/SEO';

export const getSEO = async (req: Request, res: Response) => {
  try {
    // Get the first SEO document (there should only be one)
    let seo = await SEO.findOne();
    
    // If no SEO document exists, create one with comprehensive default values
    if (!seo) {
      seo = await SEO.create({
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
      });
    }
    
    res.json(seo);
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    res.status(500).json({ message: 'خطا در دریافت اطلاعات SEO' });
  }
};

export const updateSEO = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      keywords,
      image,
      siteUrl,
      schoolName,
      address,
      phone,
      email,
      socialMedia,
      googleAnalyticsId,
      googleTagManagerId,
      bingWebmasterTools,
      yandexWebmaster,
      defaultTitle,
      defaultDescription,
      defaultKeywords,
      ogImage,
      twitterImage,
      favicon,
      themeColor,
      backgroundColor,
      structuredData,
      latitude,
      longitude,
      openingHours,
      priceRange,
      foundingDate,
      numberOfStudents,
      numberOfTeachers,
      slogan,
      awards,
      serviceTypes,
      curriculum,
      educationalLevel
    } = req.body;

    // Find the first SEO document
    let seo = await SEO.findOne();
    
    // If no SEO document exists, create one
    if (!seo) {
      seo = new SEO();
    }

    // Update fields if they are provided
    if (title !== undefined) seo.title = title;
    if (description !== undefined) seo.description = description;
    if (keywords !== undefined) {
      seo.keywords = Array.isArray(keywords) ? keywords : keywords.split(',').map((k: any) => k.trim()).filter(Boolean);
    }
    if (image !== undefined) seo.image = image;
    if (siteUrl !== undefined) seo.siteUrl = siteUrl;
    if (schoolName !== undefined) seo.schoolName = schoolName;
    if (address !== undefined) seo.address = address;
    if (phone !== undefined) seo.phone = phone;
    if (email !== undefined) seo.email = email;
    if (socialMedia !== undefined) {
      if (!seo.socialMedia) {
        seo.socialMedia = {
          instagram: '',
          twitter: '',
          telegram: '',
          linkedin: ''
        };
      }
      if (socialMedia.instagram !== undefined) seo.socialMedia.instagram = socialMedia.instagram;
      if (socialMedia.twitter !== undefined) seo.socialMedia.twitter = socialMedia.twitter;
      if (socialMedia.telegram !== undefined) seo.socialMedia.telegram = socialMedia.telegram;
      if (socialMedia.linkedin !== undefined) seo.socialMedia.linkedin = socialMedia.linkedin;
    }
    if (googleAnalyticsId !== undefined) seo.googleAnalyticsId = googleAnalyticsId;
    if (googleTagManagerId !== undefined) seo.googleTagManagerId = googleTagManagerId;
    if (bingWebmasterTools !== undefined) seo.bingWebmasterTools = bingWebmasterTools;
    if (yandexWebmaster !== undefined) seo.yandexWebmaster = yandexWebmaster;
    if (defaultTitle !== undefined) seo.defaultTitle = defaultTitle;
    if (defaultDescription !== undefined) seo.defaultDescription = defaultDescription;
    if (defaultKeywords !== undefined) {
      seo.defaultKeywords = Array.isArray(defaultKeywords) ? defaultKeywords : defaultKeywords.split(',').map((k: any) => k.trim()).filter(Boolean);
    }
    if (ogImage !== undefined) seo.ogImage = ogImage;
    if (twitterImage !== undefined) seo.twitterImage = twitterImage;
    if (favicon !== undefined) seo.favicon = favicon;
    if (themeColor !== undefined) seo.themeColor = themeColor;
    if (backgroundColor !== undefined) seo.backgroundColor = backgroundColor;
    if (structuredData !== undefined) seo.structuredData = structuredData;
    if (latitude !== undefined) seo.latitude = latitude;
    if (longitude !== undefined) seo.longitude = longitude;
    if (openingHours !== undefined) seo.openingHours = openingHours;
    if (priceRange !== undefined) seo.priceRange = priceRange;
    if (foundingDate !== undefined) seo.foundingDate = foundingDate;
    if (numberOfStudents !== undefined) seo.numberOfStudents = numberOfStudents;
    if (numberOfTeachers !== undefined) seo.numberOfTeachers = numberOfTeachers;
    if (slogan !== undefined) seo.slogan = slogan;
    if (awards !== undefined) {
      seo.awards = Array.isArray(awards) ? awards : awards.split(',').map((a: any) => a.trim()).filter(Boolean);
    }
    if (serviceTypes !== undefined) {
      seo.serviceTypes = Array.isArray(serviceTypes) ? serviceTypes : serviceTypes.split(',').map((s: any) => s.trim()).filter(Boolean);
    }
    if (curriculum !== undefined) seo.curriculum = curriculum;
    if (educationalLevel !== undefined) seo.educationalLevel = educationalLevel;

    seo.updatedAt = new Date();
    await seo.save();
    res.json(seo);
  } catch (error) {
    console.error('Error updating SEO data:', error);
    res.status(500).json({ message: 'خطا در بروزرسانی اطلاعات SEO' });
  }
}; 
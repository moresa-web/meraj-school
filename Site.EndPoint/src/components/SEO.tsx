import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'school';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  alternateLanguages?: { [key: string]: string };
}

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  image: string;
  siteUrl: string;
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    telegram?: string;
    linkedin?: string;
  };
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  bingWebmasterTools?: string;
  yandexWebmaster?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultKeywords?: string[];
  ogImage?: string;
  twitterImage?: string;
  favicon?: string;
  themeColor?: string;
  backgroundColor?: string;
  structuredData?: {
    organization?: any;
    school?: any;
    localBusiness?: any;
  };
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  priceRange?: string;
  foundingDate?: string;
  numberOfStudents?: string;
  numberOfTeachers?: string;
  slogan?: string;
  awards?: string[];
  serviceTypes?: string[];
  curriculum?: string;
  educationalLevel?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SEO = ({
  title: propTitle,
  description: propDescription,
  keywords: propKeywords,
  image: propImage,
  url = '/',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  noindex = false,
  nofollow = false,
  alternateLanguages = {}
}: SEOProps) => {
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/seo`);
        if (response.data) {
          console.log('SEO data fetched successfully:', response.data);
          setSeoData(response.data);
        }
      } catch (error) {
        console.error('Error fetching SEO data:', error);
        console.log('Using fallback SEO data');
                     // Fallback to basic defaults if API fails
             setSeoData({
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
               googleAnalyticsId: '',
               googleTagManagerId: '',
               bingWebmasterTools: '',
               yandexWebmaster: '',
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
      } finally {
        setLoading(false);
      }
    };

    fetchSEOData();
  }, []);

  // Don't render anything while loading
  if (loading || !seoData) {
    return null;
  }

  const siteUrl = seoData.siteUrl;
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  
  // Use prop values if provided, otherwise use API data
  const finalTitle = propTitle || seoData.defaultTitle || seoData.title;
  const finalDescription = propDescription || seoData.defaultDescription || seoData.description;
  const finalKeywords = propKeywords || (seoData.defaultKeywords || seoData.keywords || []).join(', ');
  const finalImage = propImage || seoData.ogImage || seoData.image;

  const generateSchemaMarkup = () => {
    if (type === 'article') {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": finalTitle,
        "description": finalDescription,
        "image": finalImage,
        "url": fullUrl,
        "datePublished": publishedTime,
        "dateModified": modifiedTime || publishedTime,
        "author": {
          "@type": "Person",
          "name": author || seoData.schoolName,
          "url": `${siteUrl}/teachers`
        },
        "publisher": {
          "@type": "Organization",
          "name": seoData.schoolName,
          "logo": {
            "@type": "ImageObject",
            "url": seoData.image,
            "width": 512,
            "height": 512
          },
          "url": siteUrl
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": fullUrl
        },
        "wordCount": finalDescription.length,
        "timeRequired": "PT5M",
        "inLanguage": "fa",
        "isAccessibleForFree": true,
        "isPartOf": {
          "@type": "WebSite",
          "name": seoData.schoolName,
          "url": siteUrl
        },
        "about": {
          "@type": "Thing",
          "name": section || "آموزش"
        },
        "mentions": (tags || []).map(tag => ({
          "@type": "Thing",
          "name": tag
        }))
      };
    }

    // Default to EducationalOrganization/School schema
    return seoData.structuredData?.school || seoData.structuredData?.organization || {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": seoData.schoolName,
      "alternateName": "مدرسه معراج",
      "description": seoData.description,
      "url": siteUrl,
      "logo": seoData.image,
      "image": seoData.image,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IR",
        "addressLocality": "مشهد مقدس",
        "addressRegion": "خراسان رضوی",
        "streetAddress": seoData.address
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": seoData.phone,
        "areaServed": "IR",
        "availableLanguage": ["fa", "en"],
        "hoursAvailable": seoData.openingHours ? {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "07:30",
          "closes": "14:30"
        } : undefined
      },
      "sameAs": [
        seoData.socialMedia?.instagram,
        seoData.socialMedia?.twitter,
        seoData.socialMedia?.telegram,
        seoData.socialMedia?.linkedin
      ].filter(Boolean),
      "email": seoData.email,
      "geo": seoData.latitude && seoData.longitude ? {
        "@type": "GeoCoordinates",
        "latitude": seoData.latitude,
        "longitude": seoData.longitude
      } : undefined,
      "curriculum": seoData.curriculum,
      "educationalLevel": seoData.educationalLevel,
      "foundingDate": seoData.foundingDate,
      "numberOfStudents": seoData.numberOfStudents,
      "numberOfTeachers": seoData.numberOfTeachers,
      "slogan": seoData.slogan,
      "award": seoData.awards || [],
      "serviceType": seoData.serviceTypes || []
    };
  };

  const generateHreflangTags = () => {
    const baseUrl = siteUrl;
    return [
      { lang: 'fa', url: `${baseUrl}${url}` },
      { lang: 'en', url: `${baseUrl}/en${url}` },
      { lang: 'x-default', url: `${baseUrl}${url}` }
    ];
  };

  const robotsContent = `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={seoData.schoolName} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="language" content="fa" />
      <meta name="revisit-after" content="1 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="coverage" content="worldwide" />
      <meta name="target" content="all" />
      <meta name="HandheldFriendly" content="true" />
      <meta name="format-detection" content="telephone=no" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Hreflang Tags */}
      {generateHreflangTags().map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content={seoData.schoolName} />
      <meta property="og:locale" content="fa_IR" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalTitle} />
      <meta property="og:determiner" content="the" />

      {/* Article-specific Open Graph tags */}
      {type === 'article' && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:modified_time" content={modifiedTime || publishedTime} />
          <meta property="article:author" content={author || seoData.schoolName} />
          <meta property="article:section" content={section || "آموزش"} />
          {(tags || []).map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={seoData.twitterImage || finalImage} />
      <meta name="twitter:site" content={seoData.socialMedia?.twitter || ''} />
      <meta name="twitter:creator" content={seoData.socialMedia?.twitter || ''} />
      <meta name="twitter:image:alt" content={finalTitle} />
      <meta name="twitter:label1" content="نویسنده" />
      <meta name="twitter:data1" content={author || seoData.schoolName} />

      {/* PWA Meta Tags */}
      <meta name="msapplication-TileColor" content={seoData.themeColor || "#059669"} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={seoData.schoolName} />

      {/* Performance Optimization */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateSchemaMarkup())}
      </script>

      {/* Google Analytics */}
      {seoData.googleAnalyticsId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${seoData.googleAnalyticsId}`}></script>
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${seoData.googleAnalyticsId}');
            `}
          </script>
        </>
      )}

      {/* Google Tag Manager */}
      {seoData.googleTagManagerId && (
        <>
          <script>
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${seoData.googleTagManagerId}');
            `}
          </script>
        </>
      )}

      {/* Bing Webmaster Tools */}
      {seoData.bingWebmasterTools && (
        <meta name="msvalidate.01" content={seoData.bingWebmasterTools} />
      )}

      {/* Yandex Webmaster */}
      {seoData.yandexWebmaster && (
        <meta name="yandex-verification" content={seoData.yandexWebmaster} />
      )}
    </Helmet>
  );
};

export default SEO; 
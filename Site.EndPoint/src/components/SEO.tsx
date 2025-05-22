import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  image: string;
  siteUrl: string;
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    instagram: string;
    twitter: string;
  };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SEO = ({
  title: propTitle,
  description: propDescription,
  keywords: propKeywords,
  image: propImage,
  url = 'https://mohammadrezasardashti.ir',
  type = 'website'
}: SEOProps) => {
  const [seoData, setSeoData] = useState<SEOData>({
    title: 'دبیرستان پسرانه معراج | مدرسه هوشمند در مشهد',
    description: 'دبیرستان پسرانه معراج، مدرسه‌ای هوشمند در مشهد با امکانات پیشرفته آموزشی، کلاس‌های تقویتی، ثبت‌نام آنلاین و سیستم مدیریت هوشمند برای دانش‌آموزان و والدین.',
    keywords: 'دبیرستان پسرانه معراج, مدرسه هوشمند مشهد, کلاس تقویتی, ثبت‌نام آنلاین, اخبار مدرسه, مشهد, آموزش',
    image: 'https://mohammadrezasardashti.ir/images/logo.png',
    siteUrl: 'https://mohammadrezasardashti.ir',
    schoolName: 'دبیرستان پسرانه معراج',
    address: 'بلوار دانش آموز، دانش آموز 10',
    phone: '+985138932030',
    email: 'info@merajschool.ir',
    socialMedia: {
      instagram: 'https://www.instagram.com/merajschool/',
      twitter: '@MerajSchoolIR'
    }
  });

  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/seo`);
        if (response.data) {
          setSeoData(response.data);
        }
      } catch (error) {
        console.error('Error fetching SEO data:', error);
      }
    };

    fetchSEOData();
  }, []);

  const siteUrl = seoData.siteUrl;
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const finalTitle = propTitle || seoData.title;
  const finalDescription = propDescription || seoData.description;
  const finalKeywords = propKeywords || seoData.keywords;
  const finalImage = propImage || seoData.image;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content={seoData.schoolName} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Additional Meta Tags */}
      <meta name="author" content={seoData.schoolName} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Persian" />
      <meta name="revisit-after" content="7 days" />

      {/* Schema.org Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: seoData.schoolName,
          description: finalDescription,
          url: fullUrl,
          image: finalImage,
          address: {
            '@type': 'PostalAddress',
            streetAddress: seoData.address
          },
          telephone: seoData.phone,
          email: seoData.email,
          sameAs: [
            seoData.socialMedia.instagram,
            `https://twitter.com/${seoData.socialMedia.twitter}`
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO; 
import React, { lazy, Suspense } from 'react';
import SEO from '../../components/SEO';
import { Helmet } from 'react-helmet-async';

// Lazy load sections for better performance
const AboutHeroSection = lazy(() => import('./Sections/AboutHeroSection'));
const AboutMainSection = lazy(() => import('./Sections/AboutMainSection'));
const AboutFeaturesSection = lazy(() => import('./Sections/AboutFeaturesSection'));
const AboutStatsSection = lazy(() => import('./Sections/AboutStatsSection'));
const AboutTeamSection = lazy(() => import('./Sections/AboutTeamSection'));
const AboutTimelineSection = lazy(() => import('./Sections/AboutTimelineSection'));

const About: React.FC = () => {
  const title = import.meta.env.VITE_ABOUT_TITLE || 'درباره ما - دبیرستان پسرانه معراج';
  const description =
    import.meta.env.VITE_ABOUT_DESCRIPTION ||
    'آشنایی با تاریخچه، مأموریت و تیم دبیرستان پسرانه معراج؛ مرکزی پیشرو در آموزش با استانداردهای جهانی.';
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://merajschool.ir';
  const pagePath = '/about';
  const fullUrl = `${siteUrl}${pagePath}`;
  const ogImagePath = import.meta.env.VITE_OG_IMAGE_PATH || '/images/logo.png';
  const ogImage = `${siteUrl}${ogImagePath}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "url": fullUrl,
    "name": title,
    "description": description,
    "isPartOf": {
      "@type": "School",
      "name": import.meta.env.VITE_DEFAULT_TITLE || 'دبیرستان پسرانه معراج',
      "url": siteUrl,
      "logo": `${siteUrl}/images/logo.png`
    }
  };

  return (
    <>
      <SEO
        title="درباره ما | دبیرستان پسرانه معراج"
        description="معرفی دبیرستان پسرانه معراج مشهد. تاریخچه، اهداف، امکانات و افتخارات مدرسه. مدرسه‌ای پیشرفته با امکانات آموزشی مدرن."
        keywords="درباره دبیرستان معراج, تاریخچه مدرسه, امکانات مدرسه, افتخارات مدرسه, مدرسه هوشمند مشهد"
        url="/about"
      />
      <Helmet>
        {/* تنظیم عنوان و توضیحات متا */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={fullUrl} />

        {/* تنظیم Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:image" content={ogImage} />

        {/* تنظیم Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* داده‌ ساختار‌یافته JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen">
        
        <Suspense fallback={<div>درحال بارگذاری...</div>}>
          <AboutHeroSection />
          <AboutMainSection />
          <AboutFeaturesSection />
          <AboutStatsSection />
          <AboutTimelineSection />
          <AboutTeamSection />
        </Suspense>
      </div>
    </>
  );
};

export default About; 
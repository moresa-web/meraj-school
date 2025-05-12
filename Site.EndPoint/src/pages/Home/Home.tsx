import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';

// Lazy load heavy sections for performance
const HeroSection = lazy(() => import('./Sections/HeroSection'));
const StatsSection = lazy(() => import('./Sections/StatsSection'));
const FeaturesSection = lazy(() => import('./Sections/FeaturesSection'));
const LatestNewsSection = lazy(() => import('./Sections/LatestNewsSection'));
const TestimonialsSection = lazy(() => import('./Sections/TestimonialsSection'));
const CTASection = lazy(() => import('./Sections/CTASection'));

const Home: React.FC = () => {
  // In Create React App, environment variables are accessed through process.env
  // They must be prefixed with REACT_APP_ to be exposed to the client
  const title = process.env.REACT_APP_DEFAULT_TITLE || 'دبیرستان پسرانه معراج';
  const description = process.env.REACT_APP_DEFAULT_DESCRIPTION || 'دبیرستان پسرانه معراج - مرکز آموزش و پرورش با کیفیت و استانداردهای جهانی';
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://merajschool.ir';
  const ogImagePath = process.env.REACT_APP_OG_IMAGE_PATH || '/images/logo.png';
  const ogImage = `${siteUrl}${ogImagePath}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "School",
    "name": title,
    "description": description,
    "url": siteUrl,
    "logo": `${siteUrl}/images/logo.png`,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IR",
      "addressLocality": "مشهد",
      "streetAddress": "بلوار دانش آموز، دانش آموز 10"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "telephone": "+985138932030",
      "areaServed": "IR",
      "availableLanguage": ["fa"]
    },
    "sameAs": [
      "https://www.instagram.com/merajschool/",

    ],
    "email": "info@merajschool.ir"
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} data-rh="true" />
        <link rel="canonical" href={`${siteUrl}/`} data-rh="true" />
        <meta property="og:type" content="website" data-rh="true" />
        <meta property="og:url" content={`${siteUrl}/`} data-rh="true" />
        <meta property="og:title" content={title} data-rh="true" />
        <meta property="og:description" content={description} data-rh="true" />
        <meta property="og:image" content={ogImage} data-rh="true" />
        <meta property="og:image:width" content="500" data-rh="true" />
        <meta property="og:image:height" content="500" data-rh="true" />
        <meta property="og:image:alt" content="وب‌سایت رسمی دبیرستان پسرانه معراج" data-rh="true" />
        <meta name="twitter:card" content="summary_large_image" data-rh="true" />
        <meta name="twitter:title" content={title} data-rh="true" />
        <meta name="twitter:description" content={description} data-rh="true" />
        <meta name="twitter:image" content={ogImage} data-rh="true" />

        <script type="application/ld+json" data-rh="true">
          {JSON.stringify(structuredData)}
        </script>

      </Helmet>
      <div className="min-h-screen">
        <Suspense fallback={<div>درحال بارگذاری...</div>}>
          <HeroSection />
          <StatsSection />
          <FeaturesSection />
          <LatestNewsSection />
          <TestimonialsSection />
          <CTASection />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
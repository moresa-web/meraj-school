// src/pages/Home.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from './Sections/HeroSection';
import StatsSection from './Sections/StatsSection';
import FeaturesSection from './Sections/FeaturesSection';
import LatestNewsSection from './Sections/LatestNewsSection';
import TestimonialsSection from './Sections/TestimonialsSection';
import CTASection from './Sections/CTASection';

const Home: React.FC = () => {
  // In Create React App, environment variables are accessed through process.env
  // They must be prefixed with REACT_APP_ to be exposed to the client
  const title = process.env.REACT_APP_DEFAULT_TITLE || 'دبیرستان پسرانه معراج';
  const description = process.env.REACT_APP_DEFAULT_DESCRIPTION || 'دبیرستان پسرانه معراج - مرکز آموزش و پرورش با کیفیت و استانداردهای جهانی';
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://merajschool.ir';
  const ogImagePath = process.env.REACT_APP_OG_IMAGE_PATH || '/images/logo.png';
  const ogImage = `${siteUrl}${ogImagePath}`;

  console.log('Environment Variables:', {
    title,
    description,
    siteUrl,
    ogImage,
    rawTitle: process.env.REACT_APP_DEFAULT_TITLE,
    rawSiteUrl: process.env.REACT_APP_SITE_URL
  });

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${siteUrl}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="وب‌سایت رسمی دبیرستان پسرانه معراج" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <div className="min-h-screen">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <LatestNewsSection />
        <TestimonialsSection />
        <CTASection />
      </div>
    </>
  );
};

export default Home;
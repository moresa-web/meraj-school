import React, { lazy, Suspense } from 'react';
import SEO from '../../components/SEO';
import CTASection from './Sections/CTASection';

// Lazy load heavy sections for performance
const HeroSection = lazy(() => import('./Sections/HeroSection'));
const StatsSection = lazy(() => import('./Sections/StatsSection'));
const FeaturesSection = lazy(() => import('./Sections/FeaturesSection'));
const LatestNewsSection = lazy(() => import('./Sections/LatestNewsSection'));
const TestimonialsSection = lazy(() => import('./Sections/TestimonialsSection'));

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="دبیرستان پسرانه معراج | دوره اول"
        description="دبیرستان پسرانه معراج، مدرسه‌ای دولتی در مشهد با امکانات پیشرفته آموزشی، کلاس‌های تقویتی، ثبت‌نام آنلاین و سیستم مدیریت هوشمند برای دانش‌آموزان و والدین."
        keywords="دبیرستان پسرانه معراج, مدرسه دولتی مشهد, کلاس تقویتی, ثبت‌نام آنلاین, اخبار مدرسه, مشهد, آموزش"
        url="/"
      />
      <div className="min-h-screen">
        <Suspense fallback={<div>درحال بارگذاری...</div>}>
          <HeroSection />
          <StatsSection />
          <FeaturesSection />
          <LatestNewsSection />
          <TestimonialsSection />
        </Suspense>
        <CTASection />
      </div>
    </>
  );
};

export default Home;
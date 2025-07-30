import React, { lazy, Suspense } from 'react';
import SEO from '../../components/SEO';
import CTASection from './Sections/CTASection';
import { SkeletonLoading } from '../../components/SkeletonLoading';

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
        <Suspense fallback={
          <div className="space-y-16">
            {/* Hero Section Skeleton */}
            <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
              <div className="container mx-auto text-center">
                <div className="mb-8">
                  <SkeletonLoading type="image" width="120px" height="120px" className="mx-auto mb-6" />
                  <SkeletonLoading type="title" height="48px" width="80%" className="mx-auto mb-4" />
                  <SkeletonLoading type="text" height="20px" width="70%" className="mx-auto mb-6" />
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <SkeletonLoading type="button" width="160px" height="48px" />
                    <SkeletonLoading type="button" width="160px" height="48px" />
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Section Skeleton */}
            <section className="py-16 bg-gray-900">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <SkeletonLoading type="title" height="36px" width="60%" className="mx-auto mb-4" />
                  <SkeletonLoading type="text" height="18px" width="50%" className="mx-auto" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="text-center">
                      <SkeletonLoading type="title" height="32px" width="80px" className="mx-auto mb-2" />
                      <SkeletonLoading type="text" height="16px" width="100px" className="mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Section Skeleton */}
            <section className="py-16 bg-gray-800">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <SkeletonLoading type="title" height="36px" width="60%" className="mx-auto mb-4" />
                  <SkeletonLoading type="text" height="18px" width="50%" className="mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-6 shadow-md">
                      <SkeletonLoading type="image" width="64px" height="64px" className="mb-4" />
                      <SkeletonLoading type="title" height="24px" width="80%" className="mb-3" />
                      <SkeletonLoading type="text" height="16px" width="90%" className="mb-2" />
                      <SkeletonLoading type="text" height="16px" width="70%" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Latest News Section Skeleton */}
            <section className="py-16 bg-gray-900">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <SkeletonLoading type="title" height="36px" width="60%" className="mx-auto mb-4" />
                  <SkeletonLoading type="text" height="18px" width="50%" className="mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg shadow-md overflow-hidden border border-gray-600">
                      <SkeletonLoading type="image" height="200px" />
                      <div className="p-4">
                        <SkeletonLoading type="text" width="100px" height="14px" className="mb-2" />
                        <SkeletonLoading type="title" height="20px" width="90%" className="mb-3" />
                        <SkeletonLoading type="text" height="16px" width="80%" className="mb-4" />
                        <div className="flex justify-between items-center">
                          <SkeletonLoading type="button" width="100px" height="36px" />
                          <SkeletonLoading type="avatar" width="32px" height="32px" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials Section Skeleton */}
            <section className="py-16 bg-gray-800">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <SkeletonLoading type="title" height="36px" width="60%" className="mx-auto mb-4" />
                  <SkeletonLoading type="text" height="18px" width="50%" className="mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="bg-gray-700 rounded-2xl shadow-lg p-6 border border-gray-600">
                      <div className="mb-4">
                        <SkeletonLoading type="avatar" width="40px" height="40px" />
                      </div>
                      <div className="mb-6 space-y-3">
                        <SkeletonLoading type="text" height="16px" />
                        <SkeletonLoading type="text" height="16px" />
                        <SkeletonLoading type="text" height="16px" width="80%" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <SkeletonLoading type="title" height="18px" width="100px" />
                          <SkeletonLoading type="text" height="14px" width="80px" />
                        </div>
                        <div className="flex space-x-1">
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <SkeletonLoading key={starIndex} type="image" width="16px" height="16px" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        }>
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
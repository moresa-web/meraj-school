import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../../components/SEO';
import { toast, ToastContainer } from 'react-toastify';
import { SkeletonLoading } from '../../components/SkeletonLoading';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load sections
const ClassesHeroSection = lazy(() => import('./Sections/ClassesHeroSection'));
const ClassesSearchSection = lazy(() => import('./Sections/ClassesSearchSection'));
const ClassesListSection = lazy(() => import('./Sections/ClassesListSection'));
const ClassesFeaturesSection = lazy(() => import('./Sections/ClassesFeaturesSection'));

const Classes: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'همه کلاس‌ها');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'جدیدترین');

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateSearchParams('search', query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateSearchParams('category', category);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateSearchParams('sort', sort);
  };

  // Sync state with searchParams when URL changes
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'همه کلاس‌ها');
    setSearchQuery(searchParams.get('search') || '');
    setSortBy(searchParams.get('sort') || 'جدیدترین');
  }, [searchParams]);

  return (
    <>
      <SEO
        title="کلاس‌های تقویتی | دبیرستان پسرانه معراج"
        description="کلاس‌های تقویتی دبیرستان پسرانه معراج مشهد. ثبت‌نام آنلاین در کلاس‌های ریاضی، فیزیک، شیمی و سایر دروس با اساتید برجسته."
        keywords="کلاس تقویتی, کلاس ریاضی, کلاس فیزیک, کلاس شیمی, ثبت‌نام آنلاین, دبیرستان معراج"
        url="/classes"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        
        <Suspense fallback={
          <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <div className="text-center">
              <SkeletonLoading type="title" height="48px" width="300px" />
              <div className="mt-4">
                <SkeletonLoading type="text" lines={2} height="20px" />
              </div>
            </div>
          </div>
        }>
          <ClassesHeroSection />
          <ClassesSearchSection 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
          />
          <ClassesListSection 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
          />
          <ClassesFeaturesSection />
        </Suspense>
      </div>
    </>
  );
};

export default Classes; 
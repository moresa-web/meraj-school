import React, { lazy, Suspense, useState, useEffect } from 'react';
import './News.css';
import { useSearchParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load sections
const NewsHeroSection = lazy(() => import('./Sections/NewsHeroSection'));
const NewsSearchSection = lazy(() => import('./Sections/NewsSearchSection'));
const NewsListSection = lazy(() => import('./Sections/NewsListSection'));
const NewsFeaturesSection = lazy(() => import('./Sections/NewsFeaturesSection'));
const NewsCategoriesSection = lazy(() => import('./Sections/NewsCategoriesSection'));

const News: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Centralized state for search and filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'همه اخبار');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || 'همه برچسب‌ها');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(1);

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateSearchParams('search', value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateSearchParams('category', value);
    setCurrentPage(1);
  };

  const handleTagChange = (value: string) => {
    setSelectedTag(value);
    updateSearchParams('tag', value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateSearchParams('sort', value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>}>
        <NewsHeroSection />
      </Suspense>

      <Suspense fallback={<div className="h-32 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>}>
        <NewsSearchSection
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          sortBy={sortBy}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onTagChange={handleTagChange}
          onSortChange={handleSortChange}
        />
      </Suspense>

      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>}>
        <NewsListSection
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          sortBy={sortBy}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </Suspense>

      <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>}>
        <NewsFeaturesSection />
      </Suspense>

      <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>}>
        <NewsCategoriesSection />
      </Suspense>
    </div>
  );
};

export default News; 
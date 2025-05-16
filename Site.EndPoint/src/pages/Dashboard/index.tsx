import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import NewsRoutes from './features/news/routes';
import NewsletterRoutes from './features/newsletter/routes';

// کامپوننت‌های مستقیم برای مسیرهایی که فایل routes ندارند
import ClassListPage from './features/classes/pages/ClassListPage';
import ClassFormPage from './features/classes/pages/ClassFormPage';
import SEO from './features/seo/components/SEO';

const DashboardRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* چون در در App.tsx یا مسیر اصلی، مسیر /dashboard تعریف شده، 
        پس اینجا دیگر نیازی به /dashboard نیست */}
        <Route path="news/*" element={<NewsRoutes />} />
        <Route path="newsletter/*" element={<NewsletterRoutes />} />
        
        {/* مسیرهای کلاس‌ها */}
        <Route path="classes" element={<ClassListPage />} />
        <Route path="classes/add" element={<ClassFormPage />} />
        <Route path="classes/edit/:id" element={<ClassFormPage />} />
        
        {/* مسیر سئو */}
        <Route path="seo" element={<SEO />} />
      </Routes>
    </Layout>
  );
};

export default DashboardRoutes; 
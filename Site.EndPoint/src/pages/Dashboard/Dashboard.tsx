import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import NewsRoutes from './features/news/routes';
import NewsletterRoutes from './features/newsletter/routes';

// کامپوننت‌های مستقیم برای مسیرهایی که فایل routes ندارند
import ClassListPage from './features/classes/pages/ClassListPage';
import ClassFormPage from './features/classes/pages/ClassFormPage';
import SEO from './features/seo/components/SEO';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* مسیرها باید با "/" شروع شوند تا با منوی سایدبار مطابقت داشته باشند */}
        <Route path="/news/*" element={<NewsRoutes />} />
        <Route path="/newsletter/*" element={<NewsletterRoutes />} />
        
        {/* مسیرهای کلاس‌ها */}
        <Route path="/classes" element={<ClassListPage />} />
        <Route path="/classes/add" element={<ClassFormPage />} />
        <Route path="/classes/edit/:id" element={<ClassFormPage />} />
        
        {/* مسیر سئو */}
        <Route path="/seo" element={<SEO />} />
      </Routes>
    </Layout>
  );
};

export default Dashboard; 
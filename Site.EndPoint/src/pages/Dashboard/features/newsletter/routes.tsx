import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NewsletterSubscribers from './pages/NewsletterSubscribers';

const NewsletterRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<NewsletterSubscribers />} />
    </Routes>
  );
};

export default NewsletterRoutes; 
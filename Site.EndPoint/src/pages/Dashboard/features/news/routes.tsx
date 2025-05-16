import { Routes, Route } from 'react-router-dom';
import NewsPage from './pages/NewsPage';
import NewsFormPage from './pages/NewsFormPage';

const NewsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<NewsPage />} />
      <Route path="add" element={<NewsFormPage />} />
      <Route path=":id" element={<NewsFormPage />} />
    </Routes>
  );
};

export default NewsRoutes; 
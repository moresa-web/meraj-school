import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import NewsForm from '../components/NewsForm';
import { News, NewsFormData } from '../types';

interface LoadingStateProps {
  message?: string;
  error?: string | null;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'در حال بارگذاری...', error = null }) => {
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

const NewsFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { news, loading, error, addNews, updateNews, saving } = useNews();
  const [currentNews, setCurrentNews] = useState<News | undefined>(undefined);

  useEffect(() => {
    if (id && news.length > 0) {
      const foundNews = news.find(item => item._id === id);
      
      if (foundNews) {
        console.log('Found news for editing:', foundNews);
        setCurrentNews(foundNews);
      } else {
        console.error('News not found with ID:', id);
        console.log('Available news items:', news.map(n => ({ id: n._id, title: n.title })));
        navigate('/dashboard/news');
      }
    }
  }, [id, news, navigate]);

  const handleSubmit = async (formData: NewsFormData) => {
    if (id && currentNews) {
      console.log('Updating news with ID:', id, formData);
      return await updateNews(id, formData);
    } else {
      console.log('Adding new news:', formData);
      return await addNews(formData);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/news');
  };

  // نمایش وضعیت بارگذاری
  if (loading) {
    return <LoadingState message="در حال بارگذاری اخبار..." />;
  }

  // نمایش خطا
  if (error) {
    return <LoadingState error={error} />;
  }

  // اگر در حالت ویرایش هستیم و خبر هنوز پیدا نشده
  if (id && !currentNews) {
    return <LoadingState message="در حال بارگذاری خبر..." />;
  }

  return (
    <NewsForm
      news={currentNews}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      saving={saving}
    />
  );
};

export default NewsFormPage; 
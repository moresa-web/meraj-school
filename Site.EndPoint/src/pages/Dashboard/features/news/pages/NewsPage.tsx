import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import NewsList from '../components/NewsList';
import LoadingState from '../../../../../components/LoadingState';

const NewsPage: React.FC = () => {
  const navigate = useNavigate();
  const { news, loading, error, deleteNews } = useNews();

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این خبر اطمینان دارید؟')) {
      await deleteNews(id);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت اخبار</h1>
        <button
          onClick={() => navigate('/dashboard/news/add')}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          افزودن خبر جدید
        </button>
      </div>

      <NewsList
        news={news}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default NewsPage; 
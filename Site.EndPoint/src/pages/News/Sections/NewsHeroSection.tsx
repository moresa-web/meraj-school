import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Newspaper, Eye, Heart, Share2 } from 'lucide-react';
import EditableContent from '../../../components/EditableContent/EditableContent';
import './NewsHeroSection.css';

interface NewsHeroStats {
  totalNews: string;
  totalViews: string;
  totalLikes: string;
}

interface NewsHeroContent {
  title: string;
  description: string;
  stats: NewsHeroStats;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const defaultContent: NewsHeroContent = {
  title: "اخبار و رویدادها",
  description: "آخرین اخبار، اطلاعیه‌ها و رویدادهای دبیرستان معراج را دنبال کنید",
  stats: {
    totalNews: "۲۵۰+",
    totalViews: "۱۵۰K+",
    totalLikes: "۱۲K+"
  }
};

const NewsHeroSection: React.FC = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<NewsHeroContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setError(null);
        const response = await fetch(`${API_URL}/api/content/news/hero`);
        if (response.ok) {
          const data = await response.json();
          setContent({
            title: data.title || defaultContent.title,
            description: data.description || defaultContent.description,
            stats: {
              totalNews: data.stats?.totalNews || defaultContent.stats.totalNews,
              totalViews: data.stats?.totalViews || defaultContent.stats.totalViews,
              totalLikes: data.stats?.totalLikes || defaultContent.stats.totalLikes
            }
          });
        } else {
          throw new Error('خطا در دریافت اطلاعات');
        }
      } catch (error) {
        console.error('Error fetching news hero content:', error);
        setError(error instanceof Error ? error.message : 'خطا در دریافت اطلاعات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async (field: keyof NewsHeroContent | 'stats', newValue: any, statField?: keyof NewsHeroStats) => {
    try {
      let updatedContent = { ...content };

      if (field === 'stats' && statField) {
        updatedContent.stats = { ...updatedContent.stats, [statField]: newValue };
      } else {
        (updatedContent as any)[field] = newValue;
      }

      const response = await fetch(`${API_URL}/api/content/news/hero`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedContent)
      });

      if (response.ok) {
        setContent(updatedContent);
      } else {
        throw new Error('خطا در به‌روزرسانی محتوا');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      alert('خطا در به‌روزرسانی محتوا');
    }
  };

  if (isLoading) {
    return (
      <section className="news-hero-section loading" role="status" aria-live="polite">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="news-hero-section error" role="alert">
        <div className="error-content">
          <h3>خطا در بارگذاری</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            تلاش مجدد
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="news-hero-section">
      <div className="news-hero-container">
        <div className="news-hero-content">
          <div className="news-hero-icon">
            <Newspaper className="w-12 h-12" />
          </div>
          
          <h1 className="news-hero-title">
            <EditableContent
              type="text"
              value={content.title}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('title', newValue)}
            />
          </h1>
          <p className="news-hero-description">
            <EditableContent
              type="text"
              value={content.description}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('description', newValue)}
            />
          </p>
          
          <div className="news-hero-stats">
            <div className="news-hero-stat">
              <div className="news-hero-stat-icon">
                <Newspaper className="w-6 h-6" />
              </div>
              <div className="news-hero-stat-number">
                <EditableContent
                  type="text"
                  value={content.stats.totalNews}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleSave('stats', newValue, 'totalNews')}
                />
              </div>
              <div className="news-hero-stat-label">خبر منتشر شده</div>
            </div>

            <div className="news-hero-stat">
              <div className="news-hero-stat-icon">
                <Eye className="w-6 h-6" />
              </div>
              <div className="news-hero-stat-number">
                <EditableContent
                  type="text"
                  value={content.stats.totalViews}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleSave('stats', newValue, 'totalViews')}
                />
              </div>
              <div className="news-hero-stat-label">بازدید کل</div>
            </div>

            <div className="news-hero-stat">
              <div className="news-hero-stat-icon">
                <Heart className="w-6 h-6" />
              </div>
              <div className="news-hero-stat-number">
                <EditableContent
                  type="text"
                  value={content.stats.totalLikes}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleSave('stats', newValue, 'totalLikes')}
                />
              </div>
              <div className="news-hero-stat-label">لایک دریافت شده</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsHeroSection; 
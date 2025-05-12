import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import { Link } from 'react-router-dom';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import ShareModal from '../../../components/ShareModal/ShareModal';

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  views: number;
  likes: number;
  likedBy: string[];
}

interface NewsContent {
  title: string;
  description: string;
  news: NewsItem[];
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const LatestNewsSection: React.FC = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<NewsContent>({
    title: 'آخرین اخبار',
    description: 'جدیدترین اخبار و رویدادهای مدرسه مرج',
    news: []
  });
  const [likedNews, setLikedNews] = useState<Set<string>>(new Set());
  const { handleError } = useErrorHandler();
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);

  useEffect(() => {
    // Check if Web Share API is supported
    setIsWebShareSupported('share' in navigator);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_URL}/news?sortBy=newest&limit=3`);
        if (response.ok) {
          const news = await response.json();
          setContent(prev => ({
            ...prev,
            news
          }));

          // دریافت IP کاربر و بررسی لایک‌ها
          const userIP = await fetch(`${API_URL}/user/ip`).then(res => res.json());
          const liked = new Set<string>(
            news
              .filter((item: NewsItem) => item.likedBy.includes(userIP))
              .map((item: NewsItem) => item._id)
          );
          setLikedNews(liked);
        }
      } catch (error) {
        handleError(error as Error);
      }
    };

    fetchNews();
  }, [handleError]);

  const handleSave = async (field: keyof NewsContent, newValue: any) => {
    try {
      const updatedContent = { ...content, [field]: newValue };

      const response = await fetch(`${API_URL}/content/home/news`, {
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
        throw new Error('Failed to update news content');
      }
    } catch (error) {
      handleError(error as Error);
    }
  };

  const handleLike = async (newsId: string) => {
    try {
      const response = await fetch(`${API_URL}/news/${newsId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const updatedNews = await response.json();
        setContent(prev => ({
          ...prev,
          news: prev.news.map(item => 
            item._id === newsId ? updatedNews : item
          )
        }));

        // دریافت IP کاربر و به‌روزرسانی وضعیت لایک
        const userIP = await fetch(`${API_URL}/user/ip`).then(res => res.json());
        setLikedNews(prev => {
          const newSet = new Set(prev);
          if (updatedNews.likedBy.includes(userIP)) {
            newSet.add(newsId);
          } else {
            newSet.delete(newsId);
          }
          return newSet;
        });
      }
    } catch (error) {
      handleError(error as Error);
    }
  };

  const handleShare = (newsId: string) => {
    const newsItem = content.news.find(item => item._id === newsId);
    if (newsItem) {
      setSelectedNews(newsItem);
      setShowShareModal(true);
    }
  };

  const handleWebShare = async () => {
    if (!selectedNews) return;
    
    try {
      await navigator.share({
        title: selectedNews.title,
        text: selectedNews.description,
        url: `${window.location.origin}/news/${selectedNews._id}`
      });
      setShowShareModal(false);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyLink = () => {
    if (!selectedNews) return;
    const url = `${window.location.origin}/news/${selectedNews._id}`;
    navigator.clipboard.writeText(url);
    setShowShareModal(false);
  };

  const handleShareSocial = (platform: string) => {
    if (!selectedNews) return;
    const url = `${window.location.origin}/news/${selectedNews._id}`;
    const title = selectedNews.title;
    const text = selectedNews.description;

    let shareUrl = '';
    switch (platform) {
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
    }

    window.open(shareUrl, '_blank');
    setShowShareModal(false);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-emerald-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-emerald-600">
            <EditableContent
              type="text"
              value={content.title}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('title', newValue)}
            />
          </h2>
          <div className="text-gray-600 text-lg max-w-2xl mx-auto">
            <EditableContent
              type="text"
              value={content.description}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('description', newValue)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.news.map((newsItem, index) => (
            <article 
              key={newsItem._id} 
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={`${API_URL.replace('/api', '')}${newsItem.image}`}
                  alt={newsItem.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-sm transform transition-transform duration-300 group-hover:scale-105">
                    {newsItem.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 ml-2 text-emerald-600 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{newsItem.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 ml-1 text-emerald-600 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{newsItem.views}</span>
                    </div>
                    <button
                      onClick={() => handleLike(newsItem._id)}
                      className={`flex items-center ${likedNews.has(newsItem._id) ? 'text-red-500' : 'text-gray-500'}`}
                    >
                      <svg className="w-5 h-5 ml-1" fill={likedNews.has(newsItem._id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{newsItem.likes}</span>
                    </button>
                    <button
                      onClick={() => handleShare(newsItem._id)}
                      className="text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                  {newsItem.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {newsItem.description}
                </p>
                <Link
                  to={`/news/${newsItem._id}`}
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  ادامه مطلب
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        newsItem={selectedNews}
      />
    </section>
  );
};

export default LatestNewsSection;


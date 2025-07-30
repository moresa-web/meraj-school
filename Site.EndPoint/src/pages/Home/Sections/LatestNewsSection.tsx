import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import { Link } from 'react-router-dom';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import ShareModal from '../../../components/ShareModal/ShareModal';
import { NewsSkeleton, SkeletonLoading } from '../../../components/SkeletonLoading';
import { getImageUrl } from '../../../utils/format';
import { Eye, Heart, Share2, Calendar, User, Tag } from 'lucide-react';
import './LatestNewsSection.css';

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  author?: {
    userId: string;
    fullName: string;
    email: string;
  };
  views: number;
  likes: number;
  likedBy: string[];
  tags?: string[];
  slug: string;
}

interface NewsContent {
  title: string;
  description: string;
  news: NewsItem[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to format date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'تاریخ نامعتبر';
    }
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'تاریخ نامعتبر';
  }
};

// Helper function to get time ago
const getTimeAgo = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'زمان نامعتبر';
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 0) return 'لحظاتی پیش';
    if (diffInSeconds < 60) return 'لحظاتی پیش';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} دقیقه پیش`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ساعت پیش`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} روز پیش`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} ماه پیش`;
    return `${Math.floor(diffInSeconds / 31536000)} سال پیش`;
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return 'زمان نامعتبر';
  }
};

export const LatestNewsSection: React.FC = () => {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [content, setContent] = useState<NewsContent>({
    title: 'آخرین اخبار',
    description: 'جدیدترین اخبار و رویدادهای مدرسه معراج',
    news: []
  });
  const [likedNews, setLikedNews] = useState<Set<string>>(new Set());
  const { handleError } = useErrorHandler();
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Web Share API is supported
    setIsWebShareSupported('share' in navigator);
  }, []);

  // استفاده از Intersection Observer برای تشخیص زمانی که کاربر به این بخش می‌رسد
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setError(null);
        setIsLoading(true);
        
        const response = await fetch(`${API_URL}/api/news?sortBy=newest&limit=3`);
        if (response.ok) {
          const news = await response.json();
          setContent(prev => ({
            ...prev,
            news
          }));

          // دریافت IP کاربر و بررسی لایک‌ها
          try {
            const userIPResponse = await fetch(`${API_URL}/api/user/ip`);
            if (userIPResponse.ok) {
              const userIP = await userIPResponse.json();
              const liked = new Set<string>(
                news
                  .filter((item: NewsItem) => item.likedBy.includes(userIP))
                  .map((item: NewsItem) => item._id)
              );
              setLikedNews(liked);
            }
          } catch (ipError) {
            console.warn('Could not fetch user IP:', ipError);
          }
        } else {
          throw new Error('خطا در دریافت اخبار');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(error instanceof Error ? error.message : 'خطا در دریافت اخبار');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleSave = async (field: keyof NewsContent, newValue: any) => {
    try {
      const updatedContent = { ...content, [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/home/news`, {
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
        throw new Error('خطا در به‌روزرسانی محتوای اخبار');
      }
    } catch (error) {
      handleError(error as Error);
    }
  };

  const handleLike = async (newsId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/news/${newsId}/like`, {
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
        try {
          const userIPResponse = await fetch(`${API_URL}/api/user/ip`);
          if (userIPResponse.ok) {
            const userIP = await userIPResponse.json();
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
        } catch (ipError) {
          console.warn('Could not fetch user IP for like update:', ipError);
        }
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



  if (isLoading) {
    return (
      <section className="latest-news-section loading" role="status" aria-live="polite">
        <div className="news-container">
          <div className="news-header">
            <SkeletonLoading type="title" height="48px" width="60%" />
            <div className="mt-4">
              <SkeletonLoading type="text" lines={2} height="20px" />
            </div>
          </div>
          <NewsSkeleton count={3} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="latest-news-section error" role="alert">
        <div className="news-error-content">
          <h3>خطا در بارگذاری</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="news-retry-button"
          >
            تلاش مجدد
          </button>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef} 
      className="latest-news-section" 
      role="region" 
      aria-label="آخرین اخبار"
    >
      {/* Animated background elements */}
      <div className="news-background">
        <div className="news-floating-element news-element-1"></div>
        <div className="news-floating-element news-element-2"></div>
        <div className="news-floating-element news-element-3"></div>
      </div>

      <div className="news-container">
        <div className="news-header">
          <h2 className="news-title animate-fade-in-up">
            <EditableContent
              type="text"
              value={content.title}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('title', newValue)}
            />
          </h2>
          <div className="news-description animate-fade-in-up animation-delay-200">
            <EditableContent
              type="text"
              value={content.description}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('description', newValue)}
            />
          </div>
        </div>

        {content.news.length === 0 ? (
          <div className="news-empty-state" role="status">
            <svg className="news-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="news-empty-title">هیچ خبری یافت نشد</h3>
            <p className="news-empty-description">در حال حاضر خبری برای نمایش وجود ندارد.</p>
          </div>
        ) : (
          <div className="news-grid">
            {content.news.map((newsItem, index) => (
              <article
                key={newsItem._id}
                className="news-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link to={`/news/${newsItem.slug || newsItem._id}`} className="news-card-link">
                  <div className="news-card-image-container">
                    {newsItem.image ? (
                      <img 
                        src={getImageUrl(newsItem.image)} 
                        alt={newsItem.title}
                        className="news-card-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="news-card-image-placeholder">
                        <div className="news-card-image-icon">
                          <Tag className="w-8 h-8" />
                        </div>
                        <div className="news-card-image-title">{newsItem.category}</div>
                        <div className="news-card-image-subtitle">خبر</div>
                      </div>
                    )}
                    <div className="news-card-overlay">
                      <div className="news-card-overlay-buttons">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleLike(newsItem._id);
                          }}
                          className={`news-like-button ${likedNews.has(newsItem._id) ? 'liked' : ''}`}
                          aria-label="لایک کردن خبر"
                        >
                          <Heart className="w-4 h-4" />
                          <span>{newsItem.likes}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleShare(newsItem._id);
                          }}
                          className="news-share-button"
                          aria-label="اشتراک‌گذاری خبر"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="news-card-badge">
                      <span className="news-card-category">{newsItem.category}</span>
                    </div>
                  </div>

                  <div className="news-card-content">
                    <div className="news-card-header">
                      <h3 className="news-card-title">{newsItem.title}</h3>
                      <div className="news-card-meta">
                        <span className="news-card-date">
                          <Calendar className="w-4 h-4" />
                          {newsItem.date ? formatDate(newsItem.date) : formatDate(newsItem._id)}
                        </span>
                        <span className="news-card-time" title={getTimeAgo(newsItem._id)}>
                          {getTimeAgo(newsItem._id)}
                        </span>
                        {newsItem.author && (
                          <span className="news-card-author">
                            <User className="w-4 h-4" />
                            {newsItem.author.fullName}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="news-card-description">
                      {newsItem.description && newsItem.description.length > 150 
                        ? `${newsItem.description.substring(0, 150)}...` 
                        : newsItem.description}
                    </p>

                    <div className="news-card-footer">
                      <div className="news-card-stats">
                        <span className="news-card-views" title={`${newsItem.views} بازدید`}>
                          <Eye className="w-4 h-4" />
                          {newsItem.views.toLocaleString('fa-IR')}
                        </span>
                        <span className="news-card-likes" title={`${newsItem.likes} پسند`}>
                          <Heart className="w-4 h-4" />
                          {newsItem.likes.toLocaleString('fa-IR')}
                        </span>
                      </div>
                      {newsItem.tags && newsItem.tags.length > 0 && (
                        <div className="news-card-tags">
                          {newsItem.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="news-card-tag" title={tag}>{tag}</span>
                          ))}
                          {newsItem.tags.length > 3 && (
                            <span className="news-card-tag-more" title={`و ${newsItem.tags.length - 3} برچسب دیگر`}>
                              +{newsItem.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Footer decoration */}
        <div className="news-footer">
          <div className="news-footer-line"></div>
          <div className="news-footer-accent"></div>
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


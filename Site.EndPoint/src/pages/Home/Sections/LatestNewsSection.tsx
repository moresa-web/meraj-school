import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import { Link } from 'react-router-dom';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import ShareModal from '../../../components/ShareModal/ShareModal';
import { NewsSkeleton, SkeletonLoading } from '../../../components/SkeletonLoading';
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
}

interface NewsContent {
  title: string;
  description: string;
  news: NewsItem[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

  // تابع برای فرمت کردن تاریخ
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
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
                style={{ animationDelay: `${index * 200}ms` }}
                role="article"
                aria-label={`خبر: ${newsItem.title}`}
              >
                <div className="news-image-container">
                  <img
                    src={`${API_URL.replace('/api', '')}${newsItem.image}`}
                    alt={newsItem.title}
                    className="news-image"
                    loading="lazy"
                  />
                  <div className="news-image-overlay"></div>
                  <div className="news-category">
                    {newsItem.category}
                  </div>
                </div>
                
                <div className="news-content">
                  <div className="news-meta">
                    <div className="news-meta-left">
                      <div className="news-meta-item">
                        <svg className="news-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(newsItem.date)}</span>
                      </div>
                      {newsItem.author && (
                        <div className="news-meta-item">
                          <svg className="news-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{newsItem.author.fullName}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="news-meta-right">
                      <div className="news-stats">
                        <div className="news-stat">
                          <svg className="news-stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{newsItem.views}</span>
                        </div>
                        
                        <button
                          onClick={() => handleLike(newsItem._id)}
                          className={`news-like-button ${likedNews.has(newsItem._id) ? 'liked' : ''}`}
                          aria-label={likedNews.has(newsItem._id) ? 'حذف لایک' : 'لایک کردن'}
                        >
                          <svg className="news-like-icon" fill={likedNews.has(newsItem._id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{newsItem.likes}</span>
                        </button>
                        
                        <button
                          onClick={() => handleShare(newsItem._id)}
                          className="news-share-button"
                          aria-label="اشتراک‌گذاری"
                        >
                          <svg className="news-share-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="news-item-title">
                    {newsItem.title}
                  </h3>
                  
                  <p className="news-item-description">
                    {newsItem.description}
                  </p>
                  
                  <Link
                    to={`/news/${newsItem._id}`}
                    className="news-read-more"
                    aria-label={`خواندن کامل خبر: ${newsItem.title}`}
                  >
                    ادامه مطلب
                    <svg className="news-read-more-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </Link>
                </div>
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


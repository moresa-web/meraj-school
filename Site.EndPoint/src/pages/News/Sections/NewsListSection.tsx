import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, Share2, Calendar, User, Tag } from 'lucide-react';
import axios from 'axios';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import ShareModal from '../../../components/ShareModal/ShareModal';
import NoResults from '../../../components/NoResults/NoResults';
import { NewsSkeleton } from '../../../components/SkeletonLoading';
import './NewsListSection.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  date: string;
  image: string;
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

interface NewsListSectionProps {
  searchQuery: string;
  selectedCategory: string;
  selectedTag: string;
  sortBy: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const NewsListSection: React.FC<NewsListSectionProps> = ({
  searchQuery,
  selectedCategory,
  selectedTag,
  sortBy,
  currentPage,
  onPageChange
}) => {
  const { handleAxiosError } = useErrorHandler();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedNews, setLikedNews] = useState<Set<string>>(new Set());
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const itemsPerPage = 6;

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_URL}/api/news`, {
          params: {
            category: selectedCategory !== 'همه اخبار' ? selectedCategory : undefined,
            sortBy,
            search: searchQuery
          }
        });
        setNewsItems(response.data);

        // Check liked news
        try {
          const userIP = await axios.get(`${API_URL}/api/user/ip`);
          const liked = new Set<string>(
            response.data
              .filter((news: NewsItem) => news.likedBy.includes(userIP.data))
              .map((news: NewsItem) => news._id)
          );
          setLikedNews(liked);
        } catch (ipError) {
          console.log('Could not fetch user IP, skipping liked news check');
        }
        
      } catch (error) {
        handleAxiosError(error);
        setError('خطا در دریافت اخبار');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory, sortBy, searchQuery, handleAxiosError]);

  // Filter news based on search query and tags
  const filteredNews = newsItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === 'همه برچسب‌ها' || 
      (item.tags && item.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle like
  const handleLike = async (id: string) => {
    try {
      const newsItem = newsItems.find(item => item._id === id);
      if (!newsItem) return;

      const response = await axios.post(`${API_URL}/api/news/${newsItem.slug}/like`);
      setNewsItems(prevNews =>
        prevNews.map(news =>
          news._id === id ? response.data : news
        )
      );

      try {
        const userIP = await axios.get(`${API_URL}/api/user/ip`);
        setLikedNews(prev => {
          const newSet = new Set(prev);
          if (response.data.likedBy.includes(userIP.data)) {
            newSet.add(id);
          } else {
            newSet.delete(id);
          }
          return newSet;
        });
      } catch (ipError) {
        console.log('Could not fetch user IP, skipping liked news update');
      }
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleShare = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setShowShareModal(true);
  };

  if (loading) {
    return (
      <section className="news-list-section">
        <div className="news-list-container">
          <div className="news-list-header">
            <h2 className="news-list-title">آخرین اخبار</h2>
            <p className="news-list-subtitle">در حال بارگذاری...</p>
          </div>
          <NewsSkeleton count={6} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="news-list-section">
        <div className="news-list-container">
          <div className="news-list-error">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="news-list-section">
      <div className="news-list-container">
        <div className="news-list-header">
          <h2 className="news-list-title">آخرین اخبار</h2>
          <p className="news-list-subtitle">
            {filteredNews.length} خبر یافت شد
          </p>
        </div>

        {currentNews.length === 0 ? (
          <NoResults message="اخباری یافت نشد" />
        ) : (
          <>
            <div className="news-grid">
              {currentNews.map((newsItem, index) => (
                <article
                  key={newsItem._id}
                  className="news-card"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link to={`/news/${newsItem.slug}`} className="news-card-link">
                    <div className="news-card-image-container">
                      <div className="news-card-image-placeholder">
                        <div className="news-card-image-icon">
                          <Tag className="w-8 h-8" />
                        </div>
                        <div className="news-card-image-title">{newsItem.category}</div>
                        <div className="news-card-image-subtitle">خبر</div>
                      </div>
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
                              handleShare(newsItem);
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
                            {newsItem.date}
                          </span>
                          {newsItem.author && (
                            <span className="news-card-author">
                              <User className="w-4 h-4" />
                              {newsItem.author.fullName}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="news-card-description">{newsItem.description}</p>

                      <div className="news-card-footer">
                        <div className="news-card-stats">
                          <span className="news-card-views">
                            <Eye className="w-4 h-4" />
                            {newsItem.views}
                          </span>
                        </div>
                        {newsItem.tags && newsItem.tags.length > 0 && (
                          <div className="news-card-tags">
                            {newsItem.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="news-card-tag">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="news-pagination">
                <button
                  onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="news-pagination-button"
                >
                  قبلی
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`news-pagination-button ${currentPage === page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="news-pagination-button"
                >
                  بعدی
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && selectedNews && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          newsItem={selectedNews}
        />
      )}
    </section>
  );
};

export default NewsListSection; 
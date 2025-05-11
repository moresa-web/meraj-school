import React, { useState, useEffect } from 'react';
import './News.css';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import HeroSection from '../../components/HeroSection/HeroSection';
import axios from 'axios';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import ShareModal from '../../components/ShareModal/ShareModal';
import NoResults from '../../components/NoResults/NoResults';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  category: string;
  views: number;
  likes: number;
  likedBy: string[];
  tags?: string[];
}

const News: React.FC = () => {
  const navigate = useNavigate();
  const { handleAxiosError } = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'همه اخبار');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedNews, setLikedNews] = useState<Set<string>>(new Set());
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || 'همه برچسب‌ها');
  const itemsPerPage = 6;

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    updateSearchParams('category', value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    updateSearchParams('sort', value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateSearchParams('search', value);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTag(value);
    updateSearchParams('tag', value);
  };

  useEffect(() => {
    // Check if Web Share API is supported
    setIsWebShareSupported('share' in navigator);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag');
    if (tag) {
      setSelectedTag(tag);
    }
  }, []);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5000/api/news', {
          params: {
            category: selectedCategory !== 'همه اخبار' ? selectedCategory : undefined,
            sortBy,
            search: searchQuery
          }
        });
        setNewsItems(response.data);

        // دریافت IP کاربر و بررسی لایک‌ها
        const userIP = await axios.get('http://localhost:5000/api/user/ip');
        const liked = new Set<string>(
          response.data
            .filter((news: NewsItem) => news.likedBy.includes(userIP.data))
            .map((news: NewsItem) => news._id)
        );
        setLikedNews(liked);
      } catch (error) {
        handleAxiosError(error);
        setError('خطا در دریافت اخبار');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory, sortBy, searchQuery]);

  // استخراج حداکثر ۱۰ برچسب غیرتکراری، فقط اولین برچسب هر خبر
  const allTags = Array.from(
    new Set(
      newsItems
        .map(item => (item.tags && item.tags.length > 0 ? item.tags[0] : undefined))
        .filter((tag): tag is string => Boolean(tag))
    )
  ).slice(0, 10);

  // فیلتر اخبار بر اساس برچسب انتخابی
  const filteredNews = newsItems.filter(item =>
    selectedTag === 'همه برچسب‌ها' || (item.tags && item.tags.includes(selectedTag))
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle like
  const handleLike = async (id: string) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/news/${id}/like`);
      setNewsItems(prevNews => 
        prevNews.map(news => 
          news._id === id ? response.data : news
        )
      );

      // دریافت IP کاربر و به‌روزرسانی وضعیت لایک
      const userIP = await axios.get('http://localhost:5000/api/user/ip');
      setLikedNews(prev => {
        const newSet = new Set(prev);
        if (response.data.likedBy.includes(userIP.data)) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
        return newSet;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleShare = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setShowShareModal(true);
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
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        title="اخبار و رویدادها"
        description="آخرین اخبار و رویدادهای دبیرستان معراج را دنبال کنید"
        imageUrl="/images/news-hero.jpg"
      />

      {/* Search and Filter Section */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search Bar */}
          <div className="w-full mb-6 animate-fade-in-up animation-delay-300">
            <div className="relative group">
              <input
                type="text"
                placeholder="جستجو در اخبار..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:shadow-lg"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 mb-8">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="همه اخبار">همه اخبار</option>
              <option value="اخبار مدرسه">اخبار مدرسه</option>
              <option value="افتخارات">افتخارات</option>
              <option value="همایش‌ها">همایش‌ها</option>
              <option value="کلاس‌های تقویتی">کلاس‌های تقویتی</option>
            </select>
            {/* Tag Filter */}
            <select
              value={selectedTag}
              onChange={handleTagChange}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="همه برچسب‌ها">همه برچسب‌ها</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="newest">جدیدترین</option>
              <option value="mostViewed">پربازدیدترین</option>
              <option value="mostLiked">محبوب‌ترین</option>
            </select>
          </div>

          {/* News Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : currentNews.length === 0 ? (
            <NoResults />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentNews.map((newsItem, index) => (
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
                          onClick={() => handleShare(newsItem)}
                          className="text-gray-400 hover:text-emerald-400 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <Link to={`/news/${newsItem._id}`} className="block">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                        {newsItem.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {newsItem.description}
                      </p>
                      <div className="flex items-center text-emerald-600 font-medium group-hover:translate-x-2 transition-transform">
                        <span>ادامه مطلب</span>
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  قبلی
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg border ${
                    currentPage === page
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  بعدی
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        newsItem={selectedNews}
      />
    </div>
  );
};

export default News; 
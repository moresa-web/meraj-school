import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './News.css';
import axios from 'axios';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import ShareModal from '../../components/ShareModal/ShareModal';
import SEO from '../../components/SEO';
import { Helmet } from 'react-helmet-async';
import Breadcrumbs from '@/components/Breadcrumbs';
import LoadingState from '../../components/LoadingState';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getImageUrl } from '../../utils/format';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  User, 
  Tag, 
  Share2, 
  ArrowLeft,
  BookOpen,
  MessageCircle,
  TrendingUp,
  CalendarDays
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  date: string;
  image: string;
  category: string;
  views: number;
  likes: number;
  content: string;
  author?: {
    userId: string;
    fullName: string;
    email: string;
  };
  tags: string[];
  likedBy: string[];
  slug: string;
}

const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { handleAxiosError } = useErrorHandler();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/news/${slug}`);
        setNews(response.data);

        // دریافت IP کاربر و بررسی لایک
        const userIP = await axios.get(`${API_URL}/api/user/ip`);
        setIsLiked(response.data.likedBy.includes(userIP.data));
      } catch (error) {
        handleAxiosError(error);
        setError('خطا در دریافت خبر');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [slug, handleAxiosError]);

  const handleLike = async () => {
    try {
      if (!news) return;
      const response = await axios.post(`${API_URL}/api/news/${news.slug}/like`);
      setNews(response.data);
      setIsLiked(!isLiked);
      toast.success(isLiked ? 'پسند شما حذف شد' : 'خبر مورد پسند شما قرار گرفت');
    } catch (error) {
      handleAxiosError(error);
      toast.error('خطا در ثبت پسند');
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

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

  if (loading) {
    return <LoadingState />;
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">خطا در بارگذاری خبر</h1>
          <p className="text-gray-300 mb-6">{error || 'خبر مورد نظر یافت نشد'}</p>
          <Button
            onClick={() => navigate('/news')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            بازگشت به اخبار
          </Button>
        </div>
      </div>
    );
  }

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://merajfutureschool.ir';
  const pageUrl = `${siteUrl}/news/${news.slug}`;
  const ogImage = `${siteUrl}${news.image}`;

  // Enhanced structured data for news articles
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "headline": news.title,
    "image": [ogImage],
    "datePublished": new Date(news.createdAt).toISOString(),
    "dateModified": new Date(news.createdAt).toISOString(),
    "author": {
      "@type": "Person",
      "name": news.author?.fullName || 'دبیرستان معراج',
      "url": `${siteUrl}/teachers`
    },
    "publisher": {
      "@type": "Organization",
      "name": "دبیرستان پسرانه معراج",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/logo.png`,
        "width": 500,
        "height": 500
      },
      "url": siteUrl
    },
    "description": news.description,
    "articleSection": news.category,
    "keywords": news.tags.join(', '),
    "wordCount": news.content.length,
    "timeRequired": "PT3M",
    "inLanguage": "fa-IR",
    "isAccessibleForFree": true,
    "isPartOf": {
      "@type": "WebSite",
      "name": "دبیرستان پسرانه معراج",
      "url": siteUrl
    },
    "about": [
      {
        "@type": "Thing",
        "name": "آموزش",
        "description": "اخبار و اطلاعیه‌های آموزشی"
      },
      {
        "@type": "Thing", 
        "name": "مدرسه",
        "description": "اخبار مدرسه معراج"
      }
    ],
    "mentions": news.tags.map(tag => ({
      "@type": "Thing",
      "name": tag
    }))
  };

  return (
    <>
      <SEO
        title={`${news.title} | اخبار دبیرستان پسرانه معراج`}
        description={news.description}
        keywords={`${news.tags.join(', ')}, اخبار مدرسه, دبیرستان معراج, ${news.category}`}
        image={ogImage}
        url={`/news/${news.slug}`}
        type="article"
        publishedTime={new Date(news.createdAt).toISOString()}
        modifiedTime={new Date(news.createdAt).toISOString()}
        author={news.author?.fullName || 'دبیرستان معراج'}
        section={news.category}
        tags={news.tags}
      />
      
      <Helmet>
        {/* Additional article-specific meta tags */}
        <meta property="article:published_time" content={new Date(news.createdAt).toISOString()} />
        <meta property="article:modified_time" content={new Date(news.createdAt).toISOString()} />
        <meta property="article:author" content={news.author?.fullName || 'دبیرستان معراج'} />
        <meta property="article:section" content={news.category} />
        {news.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Enhanced structured data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-20">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs
            items={[
              { label: 'اخبار و اطلاعیه‌ها', path: '/news' },
              { label: news.title }
            ]}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* News Image and Title */}
              <Card className="bg-gray-800/50 border-gray-700">
                <div className="relative">
                  {news.image ? (
                    <img 
                      src={getImageUrl(news.image)}
                      alt={news.title}
                      className="w-full h-80 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center rounded-t-lg">
                      <BookOpen className="w-16 h-16 text-white/80" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {news.category}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {getTimeAgo(news.createdAt)}
                    </span>
                  </div>
                </div>
                <CardHeader className="bg-gray-800/30">
                  <CardTitle className="text-3xl font-bold text-white leading-tight">{news.title}</CardTitle>
                  <p className="text-gray-300 text-lg mt-4">{news.description}</p>
                </CardHeader>
              </Card>

              {/* Content */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    متن کامل خبر
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg max-w-none prose-invert">
                    <div className="text-gray-300 leading-relaxed whitespace-pre-line text-justify">
                      {news.content}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* News Statistics */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">آمار خبر</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{news.views.toLocaleString('fa-IR')}</div>
                      <div className="text-sm text-gray-400">بازدید</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{news.likes.toLocaleString('fa-IR')}</div>
                      <div className="text-sm text-gray-400">پسند</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <MessageCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{news.tags.length}</div>
                      <div className="text-sm text-gray-400">برچسب</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{news.category}</div>
                      <div className="text-sm text-gray-400">دسته‌بندی</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* News Information */}
              <Card className="bg-gray-800/50 border-gray-700 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">اطلاعات خبر</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {news.author && (
                    <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                      <User className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-400">نویسنده</div>
                        <div className="text-white font-medium">{news.author.fullName}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-400">تاریخ انتشار</div>
                      <div className="text-white font-medium">
                        {news.date ? formatDate(news.date) : formatDate(news.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-400">زمان انتشار</div>
                      <div className="text-white font-medium">
                        {new Date(news.createdAt).toLocaleTimeString('fa-IR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        <div className="text-xs text-gray-400 mt-1">
                          {getTimeAgo(news.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <Tag className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-400">دسته‌بندی</div>
                      <div className="text-white font-medium">{news.category}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">عملیات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleLike}
                    className={`w-full h-12 text-lg font-semibold transition-all duration-300 ${
                      isLiked
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ml-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'حذف پسند' : 'پسندیدن'}
                  </Button>
                  
                  <Button
                    onClick={handleShare}
                    className="w-full h-12 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300"
                  >
                    <Share2 className="w-5 h-5 ml-2" />
                    اشتراک‌گذاری
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/news')}
                    variant="outline"
                    className="w-full h-12 text-lg font-semibold border-gray-600 text-gray-300 hover:bg-gray-700 transition-all duration-300"
                  >
                    <ArrowLeft className="w-5 h-5 ml-2" />
                    بازگشت به اخبار
                  </Button>
                </CardContent>
              </Card>

              {/* Tags */}
              {news.tags.length > 0 && (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                      <Tag className="w-5 h-5 text-emerald-400" />
                      برچسب‌ها
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {news.tags.map((tag, index) => (
                        <Link
                          key={tag}
                          to={`/news?tag=${encodeURIComponent(tag)}`}
                          className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium hover:bg-emerald-100 transition-colors cursor-pointer"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Share Modal */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          newsItem={news}
        />
      </div>
    </>
  );
};

export default NewsDetail; 
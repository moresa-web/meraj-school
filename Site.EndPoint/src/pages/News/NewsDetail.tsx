import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './News.css';
import axios from 'axios';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import ShareModal from '../../components/ShareModal/ShareModal';
import SEO from '../../components/SEO';
import { Helmet } from 'react-helmet-async';

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
  author: string;
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
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">{error || 'خبر یافت نشد'}</h2>
          <button
            onClick={() => navigate('/news')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            بازگشت به لیست اخبار
          </button>
        </div>
      </div>
    );
  }

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://merajschool.ir';
  const pageUrl = `${siteUrl}/news/${news.slug}`;
  const ogImage = `${siteUrl}${news.image}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "headline": news.title,
    "image": [ogImage],
    "datePublished": new Date(news.createdAt).toISOString().split('T')[0],
    "author": {
      "@type": "Person",
      "name": news.author
    },
    "publisher": {
      "@type": "Organization",
      "name": import.meta.env.VITE_DEFAULT_TITLE || 'دبیرستان پسرانه معراج',
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "description": news.description,
    "articleSection": news.category,
    "keywords": news.tags.join(', ')
  };

  return (
    <>
      <SEO
        title={`${news.title} | دبیرستان پسرانه معراج`}
        description={news.description}
        keywords={news.tags.join(', ')}
        image={`${API_URL.replace('/api', '')}${news.image}`}
        url={`/news/${news.slug}`}
        type="article"
      />
      <Helmet>
        <title>{news.title} - دبیرستان پسرانه معراج</title>
        <meta name="description" content={news.description} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={news.title} />
        <meta name="twitter:description" content={news.description} />
        <meta name="twitter:image" content={ogImage} />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Parallax Effect */}
        <div className="relative h-[70vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform hover:scale-105 transition-transform duration-700"
            style={{
              backgroundImage: `url(${API_URL.replace('/api', '')}${news.image})`,
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
          </div>

          {/* Content Overlay */}
          <div className="relative h-full flex items-end">
            <div className="max-w-7xl mx-auto px-4 w-full pb-16">
              <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-medium">
                    {news.category}
                  </span>
                  <span className="text-white/80 text-sm">{news.date}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {news.title}
                </h1>
                <p className="text-white/90 text-lg mb-8 max-w-2xl">
                  {news.description}
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center text-white/80">
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{news.author}</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{news.views} بازدید</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8 md:p-12">
                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {news.content}
                  </p>
                </div>

                {/* Share and Tags Section */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800">برچسب‌ها</h3>
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      اشتراک‌گذاری
                    </button>
                  </div>

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
                </div>

                {/* Back Button */}
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => navigate('/news')}
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    بازگشت به لیست اخبار
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

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
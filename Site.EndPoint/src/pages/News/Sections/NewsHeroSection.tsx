import React from 'react';
import { Newspaper, Eye, Heart, Share2 } from 'lucide-react';
import './NewsHeroSection.css';

const NewsHeroSection: React.FC = () => {
  const content = {
    title: "اخبار و رویدادها",
    description: "آخرین اخبار، اطلاعیه‌ها و رویدادهای دبیرستان معراج را دنبال کنید",
    stats: {
      totalNews: "۲۵۰+",
      totalViews: "۱۵۰K+",
      totalLikes: "۱۲K+"
    }
  };

  return (
    <section className="news-hero-section">
      <div className="news-hero-container">
        <div className="news-hero-content">
          <div className="news-hero-icon">
            <Newspaper className="w-12 h-12" />
          </div>
          
          <h1 className="news-hero-title">{content.title}</h1>
          <p className="news-hero-description">{content.description}</p>
          
          <div className="news-hero-stats">
            <div className="news-hero-stat">
              <div className="news-hero-stat-icon">
                <Newspaper className="w-6 h-6" />
              </div>
              <div className="news-hero-stat-number">{content.stats.totalNews}</div>
              <div className="news-hero-stat-label">خبر منتشر شده</div>
            </div>

            <div className="news-hero-stat">
              <div className="news-hero-stat-icon">
                <Eye className="w-6 h-6" />
              </div>
              <div className="news-hero-stat-number">{content.stats.totalViews}</div>
              <div className="news-hero-stat-label">بازدید کل</div>
            </div>

            <div className="news-hero-stat">
              <div className="news-hero-stat-icon">
                <Heart className="w-6 h-6" />
              </div>
              <div className="news-hero-stat-number">{content.stats.totalLikes}</div>
              <div className="news-hero-stat-label">لایک دریافت شده</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsHeroSection; 
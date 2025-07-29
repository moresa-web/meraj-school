import React from 'react';
import { Link } from 'react-router-dom';
import { 
  School, 
  Trophy, 
  Users, 
  BookOpen, 
  Calendar, 
  MapPin,
  ArrowLeft
} from 'lucide-react';
import './NewsCategoriesSection.css';

const NewsCategoriesSection: React.FC = () => {
  const categories = [
    {
      icon: School,
      title: 'اخبار مدرسه',
      description: 'آخرین اخبار و اطلاعیه‌های رسمی مدرسه',
      count: 45,
      color: '#059669',
      slug: 'school-news'
    },
    {
      icon: Trophy,
      title: 'افتخارات',
      description: 'دستاوردها و موفقیت‌های دانش‌آموزان',
      count: 32,
      color: '#d97706',
      slug: 'achievements'
    },
    {
      icon: Users,
      title: 'همایش‌ها',
      description: 'برنامه‌های فرهنگی و آموزشی',
      count: 28,
      color: '#7c3aed',
      slug: 'conferences'
    },
    {
      icon: BookOpen,
      title: 'کلاس‌های تقویتی',
      description: 'اطلاعیه‌های مربوط به کلاس‌های فوق‌العاده',
      count: 19,
      color: '#dc2626',
      slug: 'enrichment-classes'
    },
    {
      icon: Calendar,
      title: 'مسابقات',
      description: 'مسابقات علمی، فرهنگی و ورزشی',
      count: 24,
      color: '#0891b2',
      slug: 'competitions'
    },
    {
      icon: MapPin,
      title: 'اردوها',
      description: 'برنامه‌های تفریحی و اردویی',
      count: 15,
      color: '#059669',
      slug: 'trips'
    }
  ];

  return (
    <section className="news-categories-section">
      <div className="news-categories-container">
        <div className="news-categories-header">
          <h2 className="news-categories-title">دسته‌بندی اخبار</h2>
          <p className="news-categories-subtitle">
            اخبار را بر اساس موضوع مورد نظر خود جستجو کنید
          </p>
        </div>

        <div className="news-categories-grid">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/news?category=${encodeURIComponent(category.title)}`}
              className="news-category-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                className="news-category-icon"
                style={{ backgroundColor: category.color }}
              >
                <category.icon className="w-8 h-8" />
              </div>
              
              <div className="news-category-content">
                <h3 className="news-category-title">{category.title}</h3>
                <p className="news-category-description">{category.description}</p>
                <div className="news-category-meta">
                  <span className="news-category-count">{category.count} خبر</span>
                  <ArrowLeft className="news-category-arrow" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="news-categories-footer">
          <div className="news-categories-stats">
            <div className="news-categories-stat">
              <span className="news-categories-stat-number">۱۶۳</span>
              <span className="news-categories-stat-label">کل اخبار</span>
            </div>
            <div className="news-categories-stat">
              <span className="news-categories-stat-number">۶</span>
              <span className="news-categories-stat-label">دسته‌بندی</span>
            </div>
            <div className="news-categories-stat">
              <span className="news-categories-stat-number">۲۴/۷</span>
              <span className="news-categories-stat-label">دسترسی</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsCategoriesSection; 
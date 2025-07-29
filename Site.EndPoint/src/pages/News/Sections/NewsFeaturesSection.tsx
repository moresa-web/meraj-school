import React from 'react';
import { Bell, TrendingUp, Users, Clock, Shield, Zap } from 'lucide-react';
import './NewsFeaturesSection.css';

const NewsFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Bell,
      title: 'اطلاع‌رسانی فوری',
      description: 'از آخرین اخبار و رویدادهای مدرسه به صورت لحظه‌ای مطلع شوید'
    },
    {
      icon: TrendingUp,
      title: 'محتوای به‌روز',
      description: 'دسترسی به جدیدترین اخبار و اطلاعیه‌های آموزشی و فرهنگی'
    },
    {
      icon: Users,
      title: 'تعامل اجتماعی',
      description: 'امکان لایک و اشتراک‌گذاری اخبار با سایر دانش‌آموزان'
    },
    {
      icon: Clock,
      title: 'دسترسی ۲۴/۷',
      description: 'دسترسی به اخبار در هر زمان و مکان از طریق وب‌سایت'
    },
    {
      icon: Shield,
      title: 'محتوای معتبر',
      description: 'تمام اخبار توسط تیم مدیریت مدرسه بررسی و تایید می‌شود'
    },
    {
      icon: Zap,
      title: 'جستجوی سریع',
      description: 'جستجو و فیلتر اخبار بر اساس دسته‌بندی و برچسب‌ها'
    }
  ];

  return (
    <section className="news-features-section">
      <div className="news-features-container">
        <div className="news-features-header">
          <h2 className="news-features-title">ویژگی‌های بخش اخبار</h2>
          <p className="news-features-subtitle">
            با استفاده از امکانات پیشرفته، همیشه از آخرین اخبار مدرسه مطلع باشید
          </p>
        </div>

        <div className="news-features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="news-feature-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="news-feature-icon">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="news-feature-title">{feature.title}</h3>
              <p className="news-feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="news-features-cta">
          <div className="news-features-cta-content">
            <h3 className="news-features-cta-title">همیشه به‌روز بمانید</h3>
            <p className="news-features-cta-description">
              با عضویت در خبرنامه، آخرین اخبار را مستقیماً در ایمیل خود دریافت کنید
            </p>
            <button className="news-features-cta-button">
              عضویت در خبرنامه
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsFeaturesSection; 
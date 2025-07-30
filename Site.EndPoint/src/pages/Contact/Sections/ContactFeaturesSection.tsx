import React from 'react';
import { Clock, Shield, Users, MessageCircle, Star, Award } from 'lucide-react';
import './ContactFeaturesSection.css';

const ContactFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: 'پاسخگویی سریع',
      description: 'تیم ما در کمتر از ۲۴ ساعت به تمام سوالات شما پاسخ می‌دهد',
      color: '#10b981'
    },
    {
      icon: Shield,
      title: 'امنیت اطلاعات',
      description: 'اطلاعات شما با بالاترین استانداردهای امنیتی محافظت می‌شود',
      color: '#3b82f6'
    },
    {
      icon: Users,
      title: 'پشتیبانی ۲۴/۷',
      description: 'در هر زمان از شبانه‌روز می‌توانید با ما در ارتباط باشید',
      color: '#8b5cf6'
    },
    {
      icon: MessageCircle,
      title: 'ارتباط چندگانه',
      description: 'از طریق تلفن، ایمیل، فرم آنلاین و شبکه‌های اجتماعی',
      color: '#f59e0b'
    },
    {
      icon: Star,
      title: 'رضایت بالا',
      description: 'رضایت ۹۸٪ از والدین و دانش‌آموزان از خدمات ما',
      color: '#ef4444'
    },
    {
      icon: Award,
      title: 'تجربه ۲۰ ساله',
      description: 'بیش از دو دهه تجربه در زمینه آموزش و پرورش',
      color: '#06b6d4'
    }
  ];

  return (
    <section className="contact-features-section">
      <div className="contact-features-container">
        <div className="contact-features-header">
          <h2 className="contact-features-title">چرا دبیرستان معراج؟</h2>
          <p className="contact-features-subtitle">
            ویژگی‌های منحصر به فرد که ما را از دیگران متمایز می‌کند
          </p>
        </div>

        <div className="contact-features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="contact-features-card"
              style={{ 
                animationDelay: `${index * 100}ms`,
                '--feature-color': feature.color
              } as React.CSSProperties}
            >
              <div className="contact-features-icon">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="contact-features-card-title">{feature.title}</h3>
              <p className="contact-features-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="contact-features-cta">
          <div className="contact-features-cta-content">
            <h3 className="contact-features-cta-title">آماده شروع هستید؟</h3>
            <p className="contact-features-cta-text">
              همین امروز با ما تماس بگیرید و از خدمات حرفه‌ای ما بهره‌مند شوید
            </p>
            <div className="contact-features-cta-stats">
              <div className="contact-features-stat">
                <div className="contact-features-stat-number">۵۰۰+</div>
                <div className="contact-features-stat-label">دانش‌آموز فعال</div>
              </div>
              <div className="contact-features-stat">
                <div className="contact-features-stat-number">۵۰+</div>
                <div className="contact-features-stat-label">معلم متخصص</div>
              </div>
              <div className="contact-features-stat">
                <div className="contact-features-stat-number">۲۰+</div>
                <div className="contact-features-stat-label">سال تجربه</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFeaturesSection; 
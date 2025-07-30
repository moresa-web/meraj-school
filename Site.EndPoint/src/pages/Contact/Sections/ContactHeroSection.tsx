import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import './ContactHeroSection.css';

const ContactHeroSection: React.FC = () => {
  const content = {
    title: "تماس با ما",
    description: "راه‌های ارتباطی با دبیرستان معراج - ما آماده پاسخگویی به سوالات شما هستیم",
    stats: {
      totalContacts: "۵۰۰+",
      responseTime: "۲۴ ساعت",
      satisfactionRate: "۹۸%"
    }
  };

  return (
    <section className="contact-hero-section">
      <div className="contact-hero-container">
        <div className="contact-hero-content">
          <div className="contact-hero-icon">
            <Phone className="w-12 h-12" />
          </div>
          
          <h1 className="contact-hero-title">{content.title}</h1>
          <p className="contact-hero-description">{content.description}</p>
          
          <div className="contact-hero-stats">
            <div className="contact-hero-stat">
              <div className="contact-hero-stat-icon">
                <Phone className="w-6 h-6" />
              </div>
              <div className="contact-hero-stat-number">{content.stats.totalContacts}</div>
              <div className="contact-hero-stat-label">تماس موفق</div>
            </div>

            <div className="contact-hero-stat">
              <div className="contact-hero-stat-icon">
                <Mail className="w-6 h-6" />
              </div>
              <div className="contact-hero-stat-number">{content.stats.responseTime}</div>
              <div className="contact-hero-stat-label">زمان پاسخ</div>
            </div>

            <div className="contact-hero-stat">
              <div className="contact-hero-stat-icon">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="contact-hero-stat-number">{content.stats.satisfactionRate}</div>
              <div className="contact-hero-stat-label">رضایت کاربران</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHeroSection; 
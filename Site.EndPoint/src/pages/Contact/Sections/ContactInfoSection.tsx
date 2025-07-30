import React from 'react';
import { MapPin, Phone, Mail, Clock, Users, Globe } from 'lucide-react';
import './ContactInfoSection.css';

const ContactInfoSection: React.FC = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'آدرس',
      value: 'مشهد، خیابان امام رضا، خیابان معراج، دبیرستان معراج',
      description: 'دفتر مرکزی دبیرستان'
    },
    {
      icon: Phone,
      title: 'تلفن',
      value: '(۰۵۱) ۳۸۹۳۲۰۳۰',
      description: 'شنبه تا چهارشنبه ۸ صبح تا ۴ عصر'
    },
    {
      icon: Mail,
      title: 'ایمیل',
      value: 'info@meraj-school.ir',
      description: 'پاسخگویی در کمتر از ۲۴ ساعت'
    },
    {
      icon: Clock,
      title: 'ساعات کاری',
      value: '۸:۰۰ - ۱۶:۰۰',
      description: 'شنبه تا چهارشنبه'
    },
    {
      icon: Users,
      title: 'پشتیبانی',
      value: '۲۴/۷',
      description: 'پشتیبانی آنلاین'
    },
    {
      icon: Globe,
      title: 'وب‌سایت',
      value: 'www.meraj-school.ir',
      description: 'اطلاعات بیشتر'
    }
  ];

  return (
    <section className="contact-info-section">
      <div className="contact-info-container">
        <div className="contact-info-header">
          <h2 className="contact-info-title">اطلاعات تماس</h2>
          <p className="contact-info-subtitle">
            راه‌های مختلف ارتباطی با دبیرستان معراج
          </p>
        </div>

        <div className="contact-info-grid">
          {contactInfo.map((info, index) => (
            <div 
              key={index} 
              className="contact-info-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="contact-info-icon">
                <info.icon className="w-6 h-6" />
              </div>
              <div className="contact-info-content">
                <h3 className="contact-info-card-title">{info.title}</h3>
                <p className="contact-info-value">{info.value}</p>
                <p className="contact-info-description">{info.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-info-cta">
          <div className="contact-info-cta-content">
            <h3 className="contact-info-cta-title">نیاز به راهنمایی دارید؟</h3>
            <p className="contact-info-cta-text">
              تیم پشتیبانی ما آماده پاسخگویی به سوالات شما در هر زمان از شبانه‌روز است.
            </p>
            <div className="contact-info-cta-buttons">
              <button className="contact-info-cta-button primary">
                <Phone className="w-4 h-4" />
                تماس فوری
              </button>
              <button className="contact-info-cta-button secondary">
                <Mail className="w-4 h-4" />
                ارسال ایمیل
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfoSection; 
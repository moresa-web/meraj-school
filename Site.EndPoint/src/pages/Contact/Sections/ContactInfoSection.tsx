import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { MapPin, Phone, Mail, Clock, Users, Globe } from 'lucide-react';
import EditableContent from '../../../components/EditableContent/EditableContent';
import { SkeletonLoading } from '../../../components/SkeletonLoading';
import './ContactInfoSection.css';

interface ContactInfoItem {
  icon: string;
  title: string;
  value: string;
  description: string;
}

interface ContactInfoContent {
  title: string;
  subtitle: string;
  contactInfo: ContactInfoItem[];
  ctaTitle: string;
  ctaText: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const defaultContent: ContactInfoContent = {
  title: 'اطلاعات تماس',
  subtitle: 'راه‌های مختلف ارتباطی با دبیرستان معراج',
  contactInfo: [
    {
      icon: 'MapPin',
      title: 'آدرس',
      value: 'مشهد، خیابان امام رضا، خیابان معراج، دبیرستان معراج',
      description: 'دفتر مرکزی دبیرستان'
    },
    {
      icon: 'Phone',
      title: 'تلفن',
      value: '(۰۵۱) ۳۸۹۳۲۰۳۰',
      description: 'شنبه تا چهارشنبه ۸ صبح تا ۴ عصر'
    },
    {
      icon: 'Mail',
      title: 'ایمیل',
      value: 'info@meraj-school.ir',
      description: 'پاسخگویی در کمتر از ۲۴ ساعت'
    },
    {
      icon: 'Clock',
      title: 'ساعات کاری',
      value: '۸:۰۰ - ۱۶:۰۰',
      description: 'شنبه تا چهارشنبه'
    },
    {
      icon: 'Users',
      title: 'پشتیبانی',
      value: '۲۴/۷',
      description: 'پشتیبانی آنلاین'
    },
    {
      icon: 'Globe',
      title: 'وب‌سایت',
      value: 'www.meraj-school.ir',
      description: 'اطلاعات بیشتر'
    }
  ],
  ctaTitle: 'نیاز به راهنمایی دارید؟',
  ctaText: 'تیم پشتیبانی ما آماده پاسخگویی به سوالات شما در هر زمان از شبانه‌روز است.'
};

const iconComponents: { [key: string]: React.ComponentType<any> } = {
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Globe
};

const ContactInfoSection: React.FC = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<ContactInfoContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setError(null);
        const response = await fetch(`${API_URL}/api/content/contact/info`);
        if (response.ok) {
          const data = await response.json();
          setContent({
            title: data.title || defaultContent.title,
            subtitle: data.subtitle || defaultContent.subtitle,
            contactInfo: data.contactInfo || defaultContent.contactInfo,
            ctaTitle: data.ctaTitle || defaultContent.ctaTitle,
            ctaText: data.ctaText || defaultContent.ctaText
          });
        } else {
          throw new Error('خطا در دریافت اطلاعات');
        }
      } catch (error) {
        console.error('Error fetching contact info content:', error);
        setError(error instanceof Error ? error.message : 'خطا در دریافت اطلاعات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async (field: keyof ContactInfoContent, newValue: any) => {
    try {
      const updatedContent = { ...content, [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/contact/info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedContent)
      });

      if (response.ok) {
        setContent(updatedContent);
      } else {
        throw new Error('خطا در به‌روزرسانی محتوا');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      alert('خطا در به‌روزرسانی محتوا');
    }
  };

  const handleContactInfoSave = async (index: number, field: keyof ContactInfoItem, newValue: string) => {
    try {
      const updatedContactInfo = [...content.contactInfo];
      updatedContactInfo[index] = { ...updatedContactInfo[index], [field]: newValue };
      
      const updatedContent = { ...content, contactInfo: updatedContactInfo };

      const response = await fetch(`${API_URL}/api/content/contact/info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedContent)
      });

      if (response.ok) {
        setContent(updatedContent);
      } else {
        throw new Error('خطا در به‌روزرسانی محتوا');
      }
    } catch (error) {
      console.error('Error updating contact info:', error);
      alert('خطا در به‌روزرسانی محتوا');
    }
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = iconComponents[iconName] || MapPin;
    return <IconComponent className="w-6 h-6" />;
  };

  if (isLoading) {
    return (
      <section className="contact-info-section loading" role="status" aria-live="polite">
        <div className="contact-info-container">
          <div className="contact-info-header">
            <SkeletonLoading type="title" height="48px" width="50%" />
            <SkeletonLoading type="text" lines={2} height="20px" />
          </div>
          <div className="contact-info-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="contact-info-card">
                <div className="contact-info-icon">
                  <SkeletonLoading type="avatar" width="24px" height="24px" />
                </div>
                <div className="contact-info-content">
                  <SkeletonLoading type="title" height="24px" width="80%" />
                  <SkeletonLoading type="text" width="100%" height="18px" />
                  <SkeletonLoading type="text" width="70%" height="16px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="contact-info-section error" role="alert">
        <div className="error-content">
          <h3>خطا در بارگذاری</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            تلاش مجدد
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-info-section">
      <div className="contact-info-container">
        <div className="contact-info-header">
          <h2 className="contact-info-title">
            <EditableContent
              type="text"
              value={content.title}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('title', newValue)}
            />
          </h2>
          <p className="contact-info-subtitle">
            <EditableContent
              type="text"
              value={content.subtitle}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('subtitle', newValue)}
            />
          </p>
        </div>

        <div className="contact-info-grid">
          {content.contactInfo.map((info, index) => (
            <div 
              key={index} 
              className="contact-info-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="contact-info-icon">
                {user?.role === 'admin' ? (
                  <select
                    value={info.icon}
                    onChange={(e) => handleContactInfoSave(index, 'icon', e.target.value)}
                    className="icon-selector"
                    aria-label="انتخاب آیکون"
                  >
                    <option value="MapPin">📍 آدرس</option>
                    <option value="Phone">📞 تلفن</option>
                    <option value="Mail">✉️ ایمیل</option>
                    <option value="Clock">🕐 ساعت</option>
                    <option value="Users">👥 پشتیبانی</option>
                    <option value="Globe">🌐 وب‌سایت</option>
                  </select>
                ) : (
                  renderIcon(info.icon)
                )}
              </div>
              <div className="contact-info-content">
                <h3 className="contact-info-card-title">
                  <EditableContent
                    type="text"
                    value={info.title}
                    isAdmin={user?.role === 'admin'}
                    onSave={(newValue) => handleContactInfoSave(index, 'title', newValue)}
                  />
                </h3>
                <p className="contact-info-value">
                  <EditableContent
                    type="text"
                    value={info.value}
                    isAdmin={user?.role === 'admin'}
                    onSave={(newValue) => handleContactInfoSave(index, 'value', newValue)}
                  />
                </p>
                <p className="contact-info-description">
                  <EditableContent
                    type="text"
                    value={info.description}
                    isAdmin={user?.role === 'admin'}
                    onSave={(newValue) => handleContactInfoSave(index, 'description', newValue)}
                  />
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-info-cta">
          <div className="contact-info-cta-content">
            <h3 className="contact-info-cta-title">
              <EditableContent
                type="text"
                value={content.ctaTitle}
                isAdmin={user?.role === 'admin'}
                onSave={(newValue) => handleSave('ctaTitle', newValue)}
              />
            </h3>
            <p className="contact-info-cta-text">
              <EditableContent
                type="text"
                value={content.ctaText}
                isAdmin={user?.role === 'admin'}
                onSave={(newValue) => handleSave('ctaText', newValue)}
              />
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
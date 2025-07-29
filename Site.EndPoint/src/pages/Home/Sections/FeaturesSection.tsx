import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import './FeaturesSection.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesContent {
  title: string;
  description: string;
  features: Feature[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// SVG Icons as components
const BookIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const BuildingIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const GraduationIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const AwardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const TargetIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const StarIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

// Icon mapping
const iconComponents: { [key: string]: React.ComponentType } = {
  'book': BookIcon,
  'building': BuildingIcon,
  'users': UsersIcon,
  'graduation': GraduationIcon,
  'award': AwardIcon,
  'target': TargetIcon,
  'heart': HeartIcon,
  'star': StarIcon,
};

const defaultFeatures: Feature[] = [
  {
    icon: 'graduation',
    title: 'آموزش با کیفیت',
    description: 'استفاده از روش‌های نوین آموزشی و اساتید مجرب برای یادگیری بهتر دانش‌آموزان'
  },
  {
    icon: 'building',
    title: 'امکانات مدرن',
    description: 'دسترسی به آزمایشگاه‌های مجهز، کتابخانه و سالن ورزشی استاندارد'
  },
  {
    icon: 'users',
    title: 'مشاوره تحصیلی',
    description: 'مشاوره تخصصی برای انتخاب رشته و برنامه‌ریزی تحصیلی دانش‌آموزان'
  }
];

const defaultContent: FeaturesContent = {
  title: 'ویژگی‌های برتر ما',
  description: 'ما با ارائه خدمات آموزشی با کیفیت و امکانات مدرن، بهترین محیط یادگیری را برای دانش‌آموزان فراهم می‌کنیم',
  features: defaultFeatures
};

export const FeaturesSection: React.FC = () => {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [content, setContent] = useState<FeaturesContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تابع برای رندر آیکون
  const renderIcon = (iconName: string) => {
    const IconComponent = iconComponents[iconName] || BookIcon;
    return <IconComponent />;
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setError(null);
        const response = await fetch(`${API_URL}/api/content/home/features`);
        if (response.ok) {
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            const updatedFeatures = data.features.map((feature: Feature, index: number) => ({
              ...defaultFeatures[index],
              title: feature.title,
              description: feature.description,
              icon: feature.icon || defaultFeatures[index]?.icon || 'book'
            }));
            setContent({
              title: data.title || defaultContent.title,
              description: data.description || defaultContent.description,
              features: updatedFeatures
            });
          }
        } else {
          throw new Error('خطا در دریافت اطلاعات');
        }
      } catch (error) {
        console.error('Error fetching features content:', error);
        setError(error instanceof Error ? error.message : 'خطا در دریافت اطلاعات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // استفاده از Intersection Observer برای تشخیص زمانی که کاربر به این بخش می‌رسد
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleSave = async (field: keyof FeaturesContent | 'feature', newValue: any, index?: number, featureField?: keyof Feature) => {
    try {
      let updatedContent = { ...content };

      if (field === 'feature' && typeof index === 'number' && featureField) {
        const updatedFeatures = [...content.features];
        updatedFeatures[index] = { ...updatedFeatures[index], [featureField]: newValue };
        updatedContent = { ...content, features: updatedFeatures };
      } else if (field === 'feature' && typeof index === 'number') {
        const updatedFeatures = [...content.features];
        updatedFeatures[index] = { ...updatedFeatures[index], ...newValue };
        updatedContent = { ...content, features: updatedFeatures };
      } else {
        updatedContent = { ...content, [field]: newValue };
      }

      const response = await fetch(`${API_URL}/api/content/home/features`, {
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
        throw new Error('خطا در به‌روزرسانی ویژگی‌ها');
      }
    } catch (error) {
      console.error('Error updating features:', error);
      alert('خطا در به‌روزرسانی ویژگی‌ها');
    }
  };

  if (isLoading) {
    return (
      <section className="features-section loading" role="status" aria-live="polite">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>در حال بارگذاری ویژگی‌ها...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="features-section error" role="alert">
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
    <section 
      ref={sectionRef} 
      className="features-section" 
      role="region" 
      aria-label="ویژگی‌های برتر"
    >
      {/* Animated background elements */}
      <div className="features-background">
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        <div className="floating-element element-3"></div>
      </div>

      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title animate-fade-in-up">
            <EditableContent
              type="text"
              value={content.title}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('title', newValue)}
            />
          </h2>
          <div className="features-description animate-fade-in-up animation-delay-200">
            <EditableContent
              type="text"
              value={content.description}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('description', newValue)}
            />
          </div>
        </div>

        <div className="features-grid">
          {content.features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              style={{ animationDelay: `${index * 200}ms` }}
              role="article"
              aria-label={`ویژگی: ${feature.title}`}
            >
              <div className="feature-icon">
                {user?.role === 'admin' ? (
                  <div className="admin-icon-editor">
                    <div className="current-icon">
                      {renderIcon(feature.icon)}
                    </div>
                    <select
                      value={feature.icon}
                      onChange={(e) => handleSave('feature', e.target.value, index, 'icon')}
                      className="icon-selector"
                      aria-label="انتخاب آیکون"
                    >
                      <option value="graduation">🎓 آموزش</option>
                      <option value="building">🏢 امکانات</option>
                      <option value="users">👥 مشاوره</option>
                      <option value="book">📚 کتاب</option>
                      <option value="award">🏅 جایزه</option>
                      <option value="target">🎯 هدف</option>
                      <option value="heart">❤️ علاقه</option>
                      <option value="star">⭐ ستاره</option>
                    </select>
                  </div>
                ) : (
                  <div className="icon-container">
                    {renderIcon(feature.icon)}
                  </div>
                )}
              </div>
              
              <h3 className="feature-title">
                <EditableContent
                  type="text"
                  value={feature.title}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleSave('feature', { title: newValue }, index)}
                />
              </h3>
              
              <div className="feature-description">
                <EditableContent
                  type="text"
                  value={feature.description}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleSave('feature', { description: newValue }, index)}
                />
              </div>

              {/* Decorative elements */}
              <div className="feature-decoration">
                <div className="decoration-line"></div>
                <div className="decoration-dot"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="features-footer">
          <div className="footer-line"></div>
          <div className="footer-accent"></div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;


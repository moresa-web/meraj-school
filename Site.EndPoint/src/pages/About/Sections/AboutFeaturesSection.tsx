import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import './AboutFeaturesSection.css';

interface AboutFeature {
  title: string;
  description: string;
  icon: string;
}

interface AboutFeaturesContent {
  title: string;
  description: string;
  features: AboutFeature[];
}

const defaultContent: AboutFeaturesContent = {
  title: 'امکانات و ویژگی‌های ما',
  description: 'ما با ارائه بهترین امکانات و خدمات، محیطی ایده‌آل برای یادگیری و رشد دانش‌آموزان فراهم کرده‌ایم',
  features: [
    {
      title: 'آموزش با کیفیت',
      description: 'استفاده از اساتید مجرب و روش‌های نوین آموزشی برای ارائه بهترین کیفیت یادگیری',
      icon: 'education'
    },
    {
      title: 'امکانات پیشرفته',
      description: 'آزمایشگاه‌های مجهز، کلاس‌های هوشمند و تکنولوژی‌های نوین آموزشی',
      icon: 'facilities'
    },
    {
      title: 'مشاوره تحصیلی',
      description: 'مشاوره تخصصی برای انتخاب رشته و برنامه‌ریزی تحصیلی توسط کارشناسان مجرب',
      icon: 'counseling'
    },
    {
      title: 'فعالیت‌های فوق برنامه',
      description: 'کلاس‌های تقویتی، کارگاه‌های مهارتی و فعالیت‌های ورزشی متنوع',
      icon: 'activities'
    },
    {
      title: 'پشتیبانی خانواده',
      description: 'ارتباط مستمر با والدین و ارائه گزارش‌های منظم از پیشرفت تحصیلی',
      icon: 'support'
    },
    {
      title: 'محیط امن و سالم',
      description: 'فراهم‌سازی محیطی امن، سالم و مناسب برای رشد جسمی و روحی دانش‌آموزان',
      icon: 'security'
    }
  ]
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Icon component
const FeatureIcon: React.FC<{ iconName: string; className?: string }> = ({ iconName, className = '' }) => {
  const iconMap: { [key: string]: JSX.Element } = {
    education: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    facilities: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <path d="M9 9h.01" />
        <path d="M9 13h.01" />
        <path d="M9 17h.01" />
      </svg>
    ),
    counseling: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    activities: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    support: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="m22 21-2-2" />
        <path d="M16 16l4 4 4-4" />
      </svg>
    ),
    security: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  };

  return iconMap[iconName] || iconMap.education;
};

export const AboutFeaturesSection: React.FC = () => {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [content, setContent] = useState<AboutFeaturesContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
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

  // Temporarily disable API calls to isolate the issue
  // const fetchContent = useCallback(async () => {
  //   try {
  //     setError(null);
  //     setIsLoading(true);
      
  //     const controller = new AbortController();
  //     const timeoutId = setTimeout(() => controller.abort(), 10000);

  //     const response = await fetch(`${API_URL}/api/content/about/features`, {
  //       signal: controller.signal
  //     });
      
  //     clearTimeout(timeoutId);

  //     if (response.ok) {
  //       const data = await response.json();
  //       setContent({
  //         title: data.title || defaultContent.title,
  //         description: data.description || defaultContent.description,
  //         features: data.features || defaultContent.features
  //       });
  //     } else {
  //       throw new Error(`خطا در دریافت ویژگی‌ها: ${response.status}`);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching about features content:', error);
  //     const errorMessage = error instanceof Error ? error.message : 'خطا در دریافت ویژگی‌ها';
  //     setError(errorMessage);
  //     setContent(defaultContent);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchContent();
  // }, [fetchContent]);

  // Save handlers
  const handleSave = useCallback(async (field: keyof AboutFeaturesContent, newValue: any) => {
    try {
      const updatedContent = { ...content, [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/about/features`, {
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
        throw new Error(`خطا در به‌روزرسانی ویژگی‌ها: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating about features content:', error);
      alert('خطا در به‌روزرسانی محتوا. لطفاً دوباره تلاش کنید.');
    }
  }, [content]);

  const handleFeatureSave = useCallback(async (index: number, field: keyof AboutFeature, newValue: string) => {
    try {
      const updatedFeatures = [...content.features];
      updatedFeatures[index] = { ...updatedFeatures[index], [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/about/features`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...content, features: updatedFeatures })
      });

      if (response.ok) {
        setContent({ ...content, features: updatedFeatures });
      } else {
        throw new Error(`خطا در به‌روزرسانی ویژگی‌ها: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating about features content:', error);
      alert('خطا در به‌روزرسانی محتوا. لطفاً دوباره تلاش کنید.');
    }
  }, [content]);

  // Loading state
  if (isLoading) {
    return (
      <section className="about-features-section loading" role="status" aria-live="polite">
        <div className="about-features-loading-content">
          <div className="about-features-loading-spinner"></div>
          <p>در حال بارگذاری ویژگی‌ها...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="about-features-section error" role="alert">
        <div className="about-features-error-content">
          <h3>خطا در بارگذاری</h3>
          <p>{error}</p>
          <button onClick={() => {}} className="about-features-retry-button">
            تلاش مجدد
          </button>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className={`about-features-section ${inView ? 'about-features-section--visible' : ''}`}
      role="region"
      aria-label="ویژگی‌های مدرسه"
      style={{
        backgroundColor: '#ffffff',
        padding: '6rem 0',
        color: '#1e293b',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="about-features-container">
        <div className="about-features-header">
          <h2 className="about-features-title animate-fade-in-up">
            {content.title}
          </h2>
          
          <p className="about-features-description animate-fade-in-up animation-delay-200">
            {content.description}
          </p>
        </div>

        <div className="about-features-grid">
          {content.features.map((feature, index) => (
            <div
              key={`${feature.title}-${index}`}
              className="about-feature-card animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="about-feature-icon">
                <FeatureIcon iconName={feature.icon} />
              </div>
              
              <h3 className="about-feature-title">
                {feature.title}
              </h3>
              
              <p className="about-feature-description">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="about-features-background">
        <div className="about-features-floating-element about-features-element-1"></div>
        <div className="about-features-floating-element about-features-element-2"></div>
        <div className="about-features-floating-element about-features-element-3"></div>
      </div>
    </section>
  );
};

export default AboutFeaturesSection;
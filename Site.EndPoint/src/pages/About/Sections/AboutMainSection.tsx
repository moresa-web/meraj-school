import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import './AboutMainSection.css';

interface AboutMainContent {
  title: string;
  description: string;
  image: string;
  stats: {
    students: string;
    teachers: string;
    years: string;
    satisfaction: string;
  };
}

const defaultContent: AboutMainContent = {
  title: 'دبیرستان معراج',
  description: 'دبیرستان معراج با بیش از 20 سال سابقه درخشان در زمینه آموزش و پرورش، همواره در تلاش بوده است تا با بهره‌گیری از اساتید مجرب و امکانات آموزشی پیشرفته، محیطی مناسب برای رشد و شکوفایی استعدادهای دانش‌آموزان فراهم کند.\n\nما معتقدیم که هر دانش‌آموز دارای استعدادهای منحصر به فردی است و وظیفه ما کشف و پرورش این استعدادهاست. با برنامه‌های آموزشی متنوع و کلاس‌های تقویتی، تلاش می‌کنیم تا دانش‌آموزان را برای موفقیت در آینده آماده کنیم.',
  image: '/uploads/1753700723217-756594018.png',
  stats: {
    students: '500+',
    teachers: '50+',
    years: '20+',
    satisfaction: '98%'
  }
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AboutMainSection: React.FC = () => {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [content, setContent] = useState<AboutMainContent>(defaultContent);
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

  // Fetch content
  const fetchContent = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_URL}/api/content/about/main`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setContent({
          title: data.title || defaultContent.title,
          description: data.description || defaultContent.description,
          image: data.image || defaultContent.image,
          stats: data.stats || defaultContent.stats
        });
      } else {
        throw new Error(`خطا در دریافت محتوای اصلی: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching about main content:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطا در دریافت محتوای اصلی';
      setError(errorMessage);
      setContent(defaultContent);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Save handler
  const handleSave = useCallback(async (field: keyof AboutMainContent, newValue: any) => {
    try {
      const updatedContent = { ...content, [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/about/main`, {
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
        throw new Error(`خطا در به‌روزرسانی محتوای اصلی: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating about main content:', error);
      alert('خطا در به‌روزرسانی محتوا. لطفاً دوباره تلاش کنید.');
    }
  }, [content]);

  // Loading state
  if (isLoading) {
    return (
      <section className="about-main-section loading" role="status" aria-live="polite">
        <div className="about-main-loading-content">
          <div className="about-main-loading-spinner"></div>
          <p>در حال بارگذاری محتوای اصلی...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="about-main-section error" role="alert">
        <div className="about-main-error-content">
          <h3>خطا در بارگذاری</h3>
          <p>{error}</p>
          <button onClick={fetchContent} className="about-main-retry-button">
            تلاش مجدد
          </button>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className={`about-main-section ${inView ? 'about-main-section--visible' : ''}`}
      role="region"
      aria-label="محتوای اصلی درباره ما"
    >
      <div className="about-main-container">
        <div className="about-main-content">
          <div className="about-main-text">
            <h2 className="about-main-title animate-fade-in-up">
              <EditableContent
                type="text"
                value={content.title}
                isAdmin={user?.role === 'admin'}
                onSave={(newValue) => handleSave('title', newValue)}
              />
            </h2>
            
            <div className="about-main-description animate-fade-in-up animation-delay-200">
              <EditableContent
                type="text"
                value={content.description}
                isAdmin={user?.role === 'admin'}
                onSave={(newValue) => handleSave('description', newValue)}
              />
            </div>

            {/* Stats */}
            <div className="about-main-stats animate-fade-in-up animation-delay-400">
              <div className="about-main-stat">
                <span className="about-main-stat-number">{content.stats.students}</span>
                <span className="about-main-stat-label">دانش‌آموز</span>
              </div>
              <div className="about-main-stat">
                <span className="about-main-stat-number">{content.stats.teachers}</span>
                <span className="about-main-stat-label">معلم</span>
              </div>
              <div className="about-main-stat">
                <span className="about-main-stat-number">{content.stats.years}</span>
                <span className="about-main-stat-label">سال تجربه</span>
              </div>
              <div className="about-main-stat">
                <span className="about-main-stat-number">{content.stats.satisfaction}</span>
                <span className="about-main-stat-label">رضایت</span>
              </div>
            </div>
          </div>

          <div className="about-main-image-container animate-fade-in-up animation-delay-300">
            <div className="about-main-image-wrapper">
              <EditableContent
                type="image"
                value={content.image}
                isAdmin={user?.role === 'admin'}
                onSave={(newValue) => handleSave('image', newValue)}
              />
              <div className="about-main-image-overlay"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="about-main-background">
        <div className="about-main-floating-element about-main-element-1"></div>
        <div className="about-main-floating-element about-main-element-2"></div>
        <div className="about-main-floating-element about-main-element-3"></div>
      </div>
    </section>
  );
};

export default AboutMainSection;
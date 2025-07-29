import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import { Building2, Users, Award } from 'lucide-react';
import './AboutHeroSection.css';

interface AboutHeroContent {
  title: string;
  description: string;
}

const defaultContent: AboutHeroContent = {
  title: 'درباره مدرسه معراج',
  description: 'دبیرستان معراج با بیش از 20 سال تجربه در آموزش و پرورش، متعهد به ارائه بهترین خدمات آموزشی و پرورشی به دانش‌آموزان است.'
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AboutHeroSection: React.FC = () => {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [content, setContent] = useState<AboutHeroContent>(defaultContent);
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

  //     const response = await fetch(`${API_URL}/api/content/about/hero`, {
  //       signal: controller.signal
  //     });
      
  //     clearTimeout(timeoutId);

  //     if (response.ok) {
  //       const data = await response.json();
  //       setContent({
  //         title: data.title || defaultContent.title,
  //         description: data.description || defaultContent.description
  //       });
  //     } else {
  //       throw new Error(`خطا در دریافت محتوای Hero: ${response.status}`);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching about hero content:', error);
  //     const errorMessage = error instanceof Error ? error.message : 'خطا در دریافت محتوای Hero';
  //     setError(errorMessage);
  //     setContent(defaultContent);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchContent();
  // }, [fetchContent]);

  // Save handler
  const handleSave = useCallback(async (field: keyof AboutHeroContent, newValue: string) => {
    try {
      const updatedContent = { ...content, [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/about/hero`, {
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
        throw new Error(`خطا در به‌روزرسانی محتوای Hero: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating about hero content:', error);
      alert('خطا در به‌روزرسانی محتوا. لطفاً دوباره تلاش کنید.');
    }
  }, [content]);

  // Loading state
  if (isLoading) {
    return (
      <section className="about-hero-section loading" role="status" aria-live="polite">
        <div className="about-hero-loading-content">
          <div className="about-hero-loading-spinner"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="about-hero-section error" role="alert">
        <div className="about-hero-error-content">
          <h3>خطا در بارگذاری</h3>
          <p>{error}</p>
          <button onClick={() => {}} className="about-hero-retry-button">
            تلاش مجدد
          </button>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className={`about-hero-section ${inView ? 'about-hero-section--visible' : ''}`}
      role="banner"
      aria-label="بخش اصلی درباره ما"
    >
      <div className="about-hero-container">
        <div className="about-hero-content">
          <div className="about-hero-icon">
            <Building2 size={48} />
          </div>
          
          <h1 className="about-hero-title">
            {content.title}
          </h1>
          
          <p className="about-hero-description">
            {content.description}
          </p>

          {/* Quick stats */}
          <div className="about-hero-stats">
            <div className="about-hero-stat">
              <div className="about-hero-stat-icon">
                <Users size={20} />
              </div>
              <span className="about-hero-stat-number">500+</span>
              <span className="about-hero-stat-label">دانش‌آموز</span>
            </div>
            <div className="about-hero-stat">
              <div className="about-hero-stat-icon">
                <Award size={20} />
              </div>
              <span className="about-hero-stat-number">20+</span>
              <span className="about-hero-stat-label">سال تجربه</span>
            </div>
            <div className="about-hero-stat">
              <div className="about-hero-stat-icon">
                <Award size={20} />
              </div>
              <span className="about-hero-stat-number">50+</span>
              <span className="about-hero-stat-label">جایزه</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
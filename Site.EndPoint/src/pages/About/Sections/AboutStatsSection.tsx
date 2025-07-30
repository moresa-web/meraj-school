import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import './AboutStatsSection.css';

interface AboutStat {
  number: string;
  label: string;
  description: string;
}

interface AboutStatsContent {
  stats: AboutStat[];
}

const defaultContent: AboutStatsContent = {
  stats: [
    {
      number: '500+',
      label: 'دانش‌آموز',
      description: 'دانش‌آموزان فعال در حال تحصیل'
    },
    {
      number: '50+',
      label: 'استاد',
      description: 'اساتید مجرب و متخصص'
    },
    {
      number: '20+',
      label: 'سال تجربه',
      description: 'سابقه درخشان در آموزش'
    },
    {
      number: '98%',
      label: 'رضایت',
      description: 'رضایت والدین و دانش‌آموزان'
    }
  ]
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AboutStatsSection: React.FC = () => {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [content, setContent] = useState<AboutStatsContent>(defaultContent);
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

      const response = await fetch(`${API_URL}/api/content/about/stats`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setContent({
          stats: data.stats || defaultContent.stats
        });
      } else {
        throw new Error(`خطا در دریافت آمار: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching about stats content:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطا در دریافت آمار';
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
  const handleSave = useCallback(async (field: keyof AboutStatsContent, newValue: any) => {
    try {
      const updatedContent = { ...content, [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/about/stats`, {
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
        throw new Error(`خطا در به‌روزرسانی آمار: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating about stats content:', error);
      alert('خطا در به‌روزرسانی محتوا. لطفاً دوباره تلاش کنید.');
    }
  }, [content]);

  // Feature save handler
  const handleStatSave = useCallback(async (index: number, field: keyof AboutStat, newValue: string) => {
    try {
      const updatedStats = [...content.stats];
      updatedStats[index] = { ...updatedStats[index], [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/about/stats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...content, stats: updatedStats })
      });

      if (response.ok) {
        setContent({ ...content, stats: updatedStats });
      } else {
        throw new Error(`خطا در به‌روزرسانی آمار: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating about stats content:', error);
      alert('خطا در به‌روزرسانی محتوا. لطفاً دوباره تلاش کنید.');
    }
  }, [content]);

  // Loading state
  if (isLoading) {
    return (
      <section className="about-stats-section loading" role="status" aria-live="polite">
        <div className="about-stats-loading-content">
          <div className="about-stats-loading-spinner"></div>
          <p>در حال بارگذاری آمار...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="about-stats-section error" role="alert">
        <div className="about-stats-error-content">
          <h3>خطا در بارگذاری</h3>
          <p>{error}</p>
          <button onClick={fetchContent} className="about-stats-retry-button">
            تلاش مجدد
          </button>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className={`about-stats-section ${inView ? 'about-stats-section--visible' : ''}`}
      role="region"
      aria-label="آمار مدرسه"
    >
      <div className="about-stats-container">
        <div className="about-stats-grid">
          {content.stats.map((stat, index) => (
            <div
              key={index}
              className="about-stat-item"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="about-stat-number">
                <EditableContent
                  type="text"
                  value={stat.number}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleStatSave(index, 'number', newValue)}
                />
              </div>
              <div className="about-stat-label">
                <EditableContent
                  type="text"
                  value={stat.label}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleStatSave(index, 'label', newValue)}
                />
              </div>
              <div className="about-stat-description">
                <EditableContent
                  type="text"
                  value={stat.description}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleStatSave(index, 'description', newValue)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="about-stats-background">
        <div className="about-stats-floating-element about-stats-element-1"></div>
        <div className="about-stats-floating-element about-stats-element-2"></div>
        <div className="about-stats-floating-element about-stats-element-3"></div>
        <div className="about-stats-floating-element about-stats-element-4"></div>
      </div>
    </section>
  );
};

export default AboutStatsSection;
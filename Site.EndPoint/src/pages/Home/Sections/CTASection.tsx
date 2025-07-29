import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import { Link } from 'react-router-dom';
import './CTASection.css';

interface CTAFeature {
  title: string;
  description: string;
  icon: string;
}

interface CTAContent {
  title: string;
  description: string;
  primaryButton: {
    text: string;
    link: string;
  };
  secondaryButton: {
    text: string;
    link: string;
  };
  features?: CTAFeature[];
}

const defaultContent: CTAContent = {
  title: 'آماده‌ای برای شروع؟',
  description: 'همین حالا به خانواده بزرگ مدرسه معراج بپیوندید و از امکانات آموزشی منحصر به فرد ما بهره‌مند شوید.',
  primaryButton: {
    text: 'ثبت‌نام کلاس‌های تقویتی',
    link: '/classes'
  },
  secondaryButton: {
    text: 'تماس با ما',
    link: '/contact'
  },
  features: [
    {
      title: 'کیفیت آموزشی بالا',
      description: 'با بهترین معلمان و روش‌های آموزشی روز دنیا',
      icon: 'graduation'
    },
    {
      title: 'امکانات پیشرفته',
      description: 'کلاس‌های مجهز و تکنولوژی‌های نوین آموزشی',
      icon: 'building'
    },
    {
      title: 'پشتیبانی 24/7',
      description: 'همیشه در کنار شما برای پاسخگویی به سوالات',
      icon: 'support'
    }
  ]
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Memoized icon component for better performance
const FeatureIcon: React.FC<{ iconName: string; className?: string }> = React.memo(({ iconName, className = '' }) => {
  const iconMap: { [key: string]: JSX.Element } = useMemo(() => ({
    graduation: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    building: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <path d="M9 9h.01" />
        <path d="M9 13h.01" />
        <path d="M9 17h.01" />
      </svg>
    ),
    support: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M13 8H7" />
        <path d="M17 12H7" />
      </svg>
    ),
    users: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="m22 21-2-2" />
        <path d="M16 16l4 4 4-4" />
      </svg>
    ),
    award: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    clock: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
    star: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ),
    shield: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  }), [className]);

  return iconMap[iconName] || iconMap.graduation;
});

FeatureIcon.displayName = 'FeatureIcon';

// Memoized feature component
const CTAFeatureCard: React.FC<{
  feature: CTAFeature;
  index: number;
  isAdmin: boolean;
  onSave: (field: 'title' | 'description', value: string) => Promise<void>;
}> = React.memo(({ feature, index, isAdmin, onSave }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div 
      className="cta-feature"
      style={{ 
        animationDelay: `${index * 200}ms`,
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)'
      }}
      role="article"
      aria-label={`ویژگی: ${feature.title}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
    >
      <div className="cta-feature-icon">
        <FeatureIcon iconName={feature.icon} />
      </div>
      <h3 className="cta-feature-title">
        <EditableContent
          type="text"
          value={feature.title}
          isAdmin={isAdmin}
          onSave={(newValue) => onSave('title', newValue)}
        />
      </h3>
      <p className="cta-feature-description">
        <EditableContent
          type="text"
          value={feature.description}
          isAdmin={isAdmin}
          onSave={(newValue) => onSave('description', newValue)}
        />
      </p>
    </div>
  );
});

CTAFeatureCard.displayName = 'CTAFeatureCard';

export const CTASection: React.FC = () => {
  // const { user } = useAuth(); // Temporarily disabled
  const user = { role: 'user' }; // Temporary mock
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [content, setContent] = useState<CTAContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(false); // Changed to false
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Intersection Observer for scroll animations
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

  // Fetch content with retry mechanism
  const fetchContent = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${API_URL}/api/content/home/cta`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setContent({
          title: data.title || defaultContent.title,
          description: data.description || defaultContent.description,
          primaryButton: {
            text: data.primaryButton?.text || defaultContent.primaryButton.text,
            link: data.primaryButton?.link || defaultContent.primaryButton.link
          },
          secondaryButton: {
            text: data.secondaryButton?.text || defaultContent.secondaryButton.text,
            link: data.secondaryButton?.link || defaultContent.secondaryButton.link
          },
          features: data.features || defaultContent.features
        });
        setRetryCount(0);
      } else {
        throw new Error(`خطا در دریافت محتوای CTA: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching CTA content:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطا در دریافت محتوای CTA';
      setError(errorMessage);
      setContent(defaultContent);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // fetchContent(); // Temporarily disabled for testing
  }, [fetchContent]);

  // Handle retry with exponential backoff
  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        fetchContent();
      }, Math.pow(2, retryCount) * 1000); // Exponential backoff: 1s, 2s, 4s
    } else {
      setError('تعداد تلاش‌های مجدد به پایان رسید. لطفاً صفحه را بارگذاری مجدد کنید.');
    }
  }, [retryCount, fetchContent]);

  // Optimized save handler with debouncing
  const handleSave = useCallback(async (field: keyof CTAContent, newValue: any) => {
    if (isSaving) return; // Prevent multiple simultaneous saves

    try {
      setIsSaving(true);
      const updatedContent = { ...content, [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/home/cta`, {
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
        throw new Error(`خطا در به‌روزرسانی محتوای CTA: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating CTA content:', error);
      alert('خطا در به‌روزرسانی محتوا. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSaving(false);
    }
  }, [content, isSaving]);

  // Memoized feature save handler
  const handleFeatureSave = useCallback(async (index: number, field: 'title' | 'description', value: string) => {
    const updatedFeatures = [...(content.features || [])];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    await handleSave('features', updatedFeatures);
  }, [content.features, handleSave]);

  // Loading state with skeleton
  if (isLoading) {
    return (
      <section className="cta-section loading" role="status" aria-live="polite">
        <div className="cta-loading-content">
          <div className="cta-loading-spinner"></div>
          <p>در حال بارگذاری محتوای CTA...</p>
          {retryCount > 0 && (
            <p className="cta-retry-info">تلاش {retryCount} از 3</p>
          )}
        </div>
      </section>
    );
  }

  // Error state with retry mechanism
  if (error) {
    return (
      <section className="cta-section error" role="alert">
        <div className="cta-error-content">
          <h3>خطا در بارگذاری</h3>
          <p>{error}</p>
          <div className="cta-error-actions">
            {retryCount < 3 && (
              <button 
                onClick={handleRetry} 
                className="cta-retry-button"
                disabled={isLoading}
              >
                {isLoading ? 'در حال تلاش...' : 'تلاش مجدد'}
              </button>
            )}
            <button 
              onClick={() => window.location.reload()} 
              className="cta-reload-button"
            >
              بارگذاری مجدد صفحه
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef} 
      className={`cta-section ${inView ? 'cta-section--visible' : ''}`}
      role="region" 
      aria-label="فراخوان به عمل"
      style={{ 
        backgroundColor: '#059669', 
        minHeight: '100vh', 
        padding: '2rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >

        {/* Enhanced animated background elements */}
      <div className="cta-background">
        <div className="cta-floating-element cta-element-1"></div>
        <div className="cta-floating-element cta-element-2"></div>
        <div className="cta-floating-element cta-element-3"></div>
        <div className="cta-floating-element cta-element-4"></div>
        <div className="cta-particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="cta-particle"
              style={{
                '--particle-delay': `${i * 0.5}s`,
                '--particle-duration': `${3 + Math.random() * 2}s`
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      <div className="cta-container" style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '2rem',
        position: 'relative',
        zIndex: 2
      }}>
        <div className="cta-content" style={{ 
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 className="cta-title animate-fade-in-up" style={{
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            color: 'white'
          }}>
            {content.title}
          </h2>
          
          <p className="cta-description animate-fade-in-up animation-delay-200" style={{
            fontSize: '1.25rem',
            lineHeight: '1.7',
            marginBottom: '2rem',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            {content.description}
          </p>

          <div className="cta-buttons animate-fade-in-up animation-delay-400" style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            <Link
              to={content.primaryButton.link}
              className="cta-primary-button"
              aria-label={`${content.primaryButton.text} - دکمه اصلی`}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                color: '#059669',
                border: 'none',
                padding: '1.25rem 2.5rem',
                borderRadius: '50px',
                fontSize: '1.125rem',
                fontWeight: '700',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}
            >
              {content.primaryButton.text}
              <svg className="cta-primary-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" style={{ width: '1.5rem', height: '1.5rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>

            <Link
              to={content.secondaryButton.link}
              className="cta-secondary-button"
              aria-label={`${content.secondaryButton.text} - دکمه فرعی`}
              style={{
                background: 'transparent',
                color: '#ffffff',
                border: '3px solid rgba(255, 255, 255, 0.8)',
                padding: '1.25rem 2.5rem',
                borderRadius: '50px',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              {content.secondaryButton.text}
              <svg className="cta-secondary-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" style={{ width: '1.5rem', height: '1.5rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
          </div>

          {/* Enhanced CTA Features */}
          {content.features && content.features.length > 0 && (
            <div className="cta-features animate-fade-in-up animation-delay-600" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              marginTop: '2rem',
              marginBottom: '2rem'
            }}>
              {content.features.map((feature, index) => (
                <div key={`${feature.title}-${index}`} className="cta-feature" style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '2rem',
                  borderRadius: '16px',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease'
                }}>
                  <div className="cta-feature-icon" style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    color: 'white'
                  }}>
                    <FeatureIcon iconName={feature.icon} />
                  </div>
                  <h3 className="cta-feature-title" style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    color: 'white'
                  }}>
                    {feature.title}
                  </h3>
                  <p className="cta-feature-description" style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Additional trust indicators */}
          <div className="cta-trust-indicators animate-fade-in-up animation-delay-800" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            <div className="cta-trust-item" style={{
              textAlign: 'center',
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <span className="cta-trust-number" style={{
                display: 'block',
                fontSize: '2.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '0.5rem'
              }}>500+</span>
              <span className="cta-trust-label" style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>دانش‌آموز فعال</span>
            </div>
            <div className="cta-trust-item" style={{
              textAlign: 'center',
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <span className="cta-trust-number" style={{
                display: 'block',
                fontSize: '2.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '0.5rem'
              }}>50+</span>
              <span className="cta-trust-label" style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>معلم متخصص</span>
            </div>
            <div className="cta-trust-item" style={{
              textAlign: 'center',
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <span className="cta-trust-number" style={{
                display: 'block',
                fontSize: '2.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '0.5rem'
              }}>98%</span>
              <span className="cta-trust-label" style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>رضایت والدین</span>
            </div>
          </div>
        </div>

        {/* Enhanced decorative elements */}
        <div className="cta-decoration">
          <div className="cta-decoration-line"></div>
          <div className="cta-decoration-dots">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="cta-decoration-dot" />
            ))}
          </div>
        </div>
      </div>

      {/* Accessibility skip link */}
      <a href="#main-content" className="cta-skip-link">
        پرش به محتوای اصلی
      </a>
    </section>
  );
};

export default CTASection;


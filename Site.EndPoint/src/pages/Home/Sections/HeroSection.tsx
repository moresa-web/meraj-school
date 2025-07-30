import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { SkeletonLoading } from '../../../components/SkeletonLoading';
import './HeroSection.css';

const EditableContent = React.lazy(() => import('../../../components/EditableContent/EditableContent'));

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface HeroContent {
  logo: string;
  title: string;
  description: string;
}

const HeroSection: React.FC = () => {
  const { user } = useAuth();
  const defaultContent: HeroContent = {
    logo: '/images/logo.png',
    title: 'دبیرستان معراج',
    description: import.meta.env.VITE_DEFAULT_DESCRIPTION || 'دبیرستان معراج - مرکز آموزش و پرورش با کیفیت و استانداردهای جهانی'
  };
  const [content, setContent] = useState<HeroContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/content/home/hero`);
        if (!response.ok) {
          throw new Error('خطا در دریافت اطلاعات');
        }
        const data = await response.json();
        console.log('Fetched hero content:', data);
        setContent(data);
      } catch (err) {
        console.error('Error fetching hero content:', err);
        setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async (field: keyof HeroContent, newValue: string) => {
    try {
      // If it's an image field, handle the upload first
      if (field === 'logo' && newValue.startsWith('data:')) {
        const formData = new FormData();
        formData.append('image', newValue);
        if (content.logo) {
          formData.append('oldImage', content.logo);
        }

        const uploadResponse = await fetch(`${API_URL}/api/content/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('خطا در آپلود تصویر');
        }

        const { url } = await uploadResponse.json();
        newValue = url;
      }

      const response = await fetch(`${API_URL}/api/content/home/hero`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ [field]: newValue })
      });

      if (!response.ok) throw new Error('خطا در ذخیره تغییرات');

      setContent(prev => prev ? { ...prev, [field]: newValue } : prev);
    } catch (err) {
      console.error(`Error saving ${field}:`, err);
      throw err;
    }
  };

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="hero-section loading" role="status" aria-live="polite">
        <div className="hero-content">
          <div className="hero-logo">
            <SkeletonLoading type="image" width="120px" height="120px" />
          </div>
          
          <div className="hero-title">
            <SkeletonLoading type="title" height="48px" width="60%" />
          </div>
          
          <div className="hero-description">
            <SkeletonLoading type="text" lines={3} height="20px" />
          </div>
          
          <div className="hero-actions">
            <SkeletonLoading type="button" width="160px" height="48px" />
            <SkeletonLoading type="button" width="140px" height="48px" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero-section error" role="alert">
        <div>
          <h2>خطا در بارگذاری</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="hero-cta-button primary-button"
            style={{ marginTop: '1rem' }}
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="hero-section error" role="alert">
        <div>
          <h2>محتوا یافت نشد</h2>
          <p>متأسفانه محتوای صفحه اصلی در دسترس نیست.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="hero-cta-button primary-button"
            style={{ marginTop: '1rem' }}
          >
            بارگذاری مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="hero-section" role="banner" aria-label="صفحه اصلی">
      <div className="hero-content">
        <div className="hero-logo" role="img" aria-label="لوگوی دبیرستان معراج">
          <Suspense fallback={
            <img 
              src={content.logo} 
              alt="لوگوی دبیرستان معراج" 
              className="w-full h-full object-contain"
              loading="lazy"
            />
          }>
            <EditableContent
              type="image"
              value={content.logo}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('logo', newValue)}
            />
          </Suspense>
        </div>
        
        <div className="hero-title">
          <Suspense fallback={
            <div className="editable-fallback text-fallback">
              <h1 className="hero-title-text">{content.title}</h1>
            </div>
          }>
            <EditableContent
              type="text"
              value={content.title}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('title', newValue)}
            />
          </Suspense>
        </div>
        
        <div className="hero-description">
          <Suspense fallback={
            <div className="editable-fallback text-fallback">
              <p className="hero-description-text">{content.description}</p>
            </div>
          }>
            <EditableContent
              type="text"
              value={content.description}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('description', newValue)}
            />
          </Suspense>
        </div>
        
        <div className="hero-cta">
          <Link 
            to="/contact" 
            className="hero-cta-button primary-button"
            aria-label="تماس با دبیرستان معراج"
          >
            تماس با ما
          </Link>
          <Link 
            to="/about" 
            className="hero-cta-button secondary-button"
            aria-label="درباره دبیرستان معراج"
          >
            درباره ما
          </Link>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <button 
        className="scroll-indicator" 
        onClick={scrollToNextSection}
        aria-label="اسکرول به بخش بعدی"
        title="اسکرول به بخش بعدی"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </button>
    </section>
  );
};

export default HeroSection;

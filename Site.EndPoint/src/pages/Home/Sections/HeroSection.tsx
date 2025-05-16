import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
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

  if (loading) {
    return <div className="hero-section loading">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="hero-section error">{error}</div>;
  }

  if (!content) {
    return <div className="hero-section error">محتوا یافت نشد</div>;
  }

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

      const updatedData = await response.json();
      setContent(prev => prev ? { ...prev, [field]: newValue } : prev);
    } catch (err) {
      console.error(`Error saving ${field}:`, err);
      throw err;
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-logo">
          <Suspense fallback={<img src={content.logo} alt="لوگو" className="w-full h-full object-contain" />}>
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
          <Link to="/contact" className="hero-cta-button primary-button">
            تماس با ما
          </Link>
          <Link to="/about" className="hero-cta-button secondary-button">
            درباره ما
          </Link>
        </div>
      </div>
    </section >
  );
};

export default HeroSection;

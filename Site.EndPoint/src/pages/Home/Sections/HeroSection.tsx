import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface HeroContent {
  logo: string;
  title: string;
  description: string;
}

const HeroSection: React.FC = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_URL}/content/home/hero`);
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
      const response = await fetch(`${API_URL}/content/home/hero`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ [field]: newValue })
      });
      
      if (!response.ok) throw new Error('خطا در ذخیره تغییرات');
      
      setContent(prev => prev ? { ...prev, [field]: newValue } : null);
    } catch (err) {
      console.error(`Error saving ${field}:`, err);
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-logo">
          <EditableContent
            type="image"
            value={content.logo}
            isAdmin={user?.role === 'admin'}
            onSave={(newValue) => handleSave('logo', newValue)}
          />
        </div>
        <div className="hero-title">
          <EditableContent
            type="text"
            value={content.title}
            isAdmin={user?.role === 'admin'}
            onSave={(newValue) => handleSave('title', newValue)}
          />
        </div>
        <div className="hero-description">
          <EditableContent
            type="text"
            value={content.description}
            isAdmin={user?.role === 'admin'}
            onSave={(newValue) => handleSave('description', newValue)}
          />
        </div>
        <div className="hero-cta">
          <Link to="/register" className="hero-cta-button primary-button">
            ثبت نام
          </Link>
          <Link to="/about" className="hero-cta-button secondary-button">
            درباره ما
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

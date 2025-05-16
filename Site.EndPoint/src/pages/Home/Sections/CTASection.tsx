import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import { Link } from 'react-router-dom';

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
}

const defaultContent: CTAContent = {
  title: 'آماده‌ای برای شروع؟',
  description: 'همین حالا به خانواده بزرگ مدرسه مرج بپیوندید و از امکانات آموزشی منحصر به فرد ما بهره‌مند شوید.',
  primaryButton: {
    text: 'ثبت‌نام کلاس‌های تقویتی',
    link: '/classes'
  },
  secondaryButton: {
    text: 'تماس با ما',
    link: '/contact'
  }
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const CTASection: React.FC = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<CTAContent>(defaultContent);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/content/home/cta`);
        if (response.ok) {
          const data = await response.json();
          // Ensure all required fields are present
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
            }
          });
        }
      } catch (error) {
        console.error('Error fetching CTA content:', error);
        // Keep using default content on error
        setContent(defaultContent);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async (field: keyof CTAContent, newValue: any) => {
    try {
      const updatedContent = { ...content, [field]: newValue };

      const response = await fetch(`${API_URL}/content/home/cta`, {
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
        throw new Error('Failed to update CTA content');
      }
    } catch (error) {
      console.error('Error updating CTA content:', error);
      alert('خطا در به‌روزرسانی محتوا');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          <EditableContent
            type="text"
            value={content.title}
            isAdmin={user?.role === 'admin'}
            onSave={(newValue) => handleSave('title', newValue)}
          />
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          <EditableContent
            type="text"
            value={content.description}
            isAdmin={user?.role === 'admin'}
            onSave={(newValue) => handleSave('description', newValue)}
          />
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            to={content.secondaryButton.link}
            className="group bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <span className="flex items-center">
              <EditableContent
                type="text"
                value={content.secondaryButton.text}
                isAdmin={user?.role === 'admin'}
                onSave={(newValue) => handleSave('secondaryButton', { ...content.secondaryButton, text: newValue })}
              />
              <svg className="w-5 h-5 mr-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          </Link>
          <Link
            to={content.primaryButton.link}
            className="group bg-emerald-500 text-white hover:bg-emerald-600 px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <span className="flex items-center">
              <EditableContent
                type="text"
                value={content.primaryButton.text}
                isAdmin={user?.role === 'admin'}
                onSave={(newValue) => handleSave('primaryButton', { ...content.primaryButton, text: newValue })}
              />
              <svg className="w-5 h-5 mr-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;


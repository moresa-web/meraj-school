import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';

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

const API_URL = process.env.REACT_APP_API_URL || 'http://mohammadrezasardashti.ir/api';

const defaultFeatures: Feature[] = [
  {
    icon: 'book',
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

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'book':
      return (
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'building':
      return (
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case 'users':
      return (
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    default:
      return null;
  }
};

export const FeaturesSection: React.FC = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<FeaturesContent>(defaultContent);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_URL}/content/home/features`);
        if (response.ok) {
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            const updatedFeatures = data.features.map((feature: Feature, index: number) => ({
              ...defaultFeatures[index],
              title: feature.title,
              description: feature.description
            }));
            setContent({
              title: data.title || defaultContent.title,
              description: data.description || defaultContent.description,
              features: updatedFeatures
            });
          }
        }
      } catch (error) {
        console.error('Error fetching features content:', error);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async (field: keyof FeaturesContent | 'feature', newValue: any, index?: number) => {
    try {
      let updatedContent = { ...content };

      if (field === 'feature' && typeof index === 'number') {
        const updatedFeatures = [...content.features];
        updatedFeatures[index] = { ...updatedFeatures[index], ...newValue };
        updatedContent = { ...content, features: updatedFeatures };
      } else {
        updatedContent = { ...content, [field]: newValue };
      }

      const response = await fetch(`${API_URL}/content/home/features`, {
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
        throw new Error('Failed to update features');
      }
    } catch (error) {
      console.error('Error updating features:', error);
      alert('خطا در به‌روزرسانی ویژگی‌ها');
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-emerald-600">
            <EditableContent
              type="text"
              value={content.title}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('title', newValue)}
            />
          </h2>
          <div className="text-gray-600 text-lg max-w-2xl mx-auto">
            <EditableContent
              type="text"
              value={content.description}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('description', newValue)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.features.map((feature, index) => (
            <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors duration-300">
                {getIcon(feature.icon)}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                <EditableContent
                  type="text"
                  value={feature.title}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleSave('feature', { title: newValue }, index)}
                />
              </h3>
              <div className="text-gray-600 leading-relaxed">
                <EditableContent
                  type="text"
                  value={feature.description}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleSave('feature', { description: newValue }, index)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;


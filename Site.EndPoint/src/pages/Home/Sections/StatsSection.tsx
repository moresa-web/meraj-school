import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import CountUp from 'react-countup';

interface StatItem {
  number: string;
  text: string;
}

interface StatsContent {
  stats: StatItem[];
  title: string;
  description: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const StatsSection: React.FC = () => {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [content, setContent] = useState<StatsContent>({
    stats: [
      { number: '۲۰+', text: 'سال تجربه آموزشی' },
      { number: '۵۰+', text: 'معلم مجرب' },
      { number: '۱۰۰۰+', text: 'دانش‌آموز موفق' },
      { number: '۹۵٪', text: 'قبولی در دانشگاه' }
    ],
    title: 'آمار',
    description: 'این بخش به آمارهای مربوط به مدرسه خود می‌پردازد.'
  });

  // تابع برای تبدیل اعداد فارسی به انگلیسی
  const persianToEnglish = (num: string) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = num;
    persianNumbers.forEach((p, i) => {
      result = result.replace(new RegExp(p, 'g'), englishNumbers[i]);
    });
    return result;
  };

  // تابع برای تبدیل اعداد انگلیسی به فارسی
  const englishToPersian = (num: string) => {
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    let result = num;
    englishNumbers.forEach((e, i) => {
      result = result.replace(new RegExp(e, 'g'), persianNumbers[i]);
    });
    return result;
  };

  // تابع برای استخراج عدد از رشته
  const extractNumber = (str: string) => {
    const englishStr = persianToEnglish(str);
    const numberStr = englishStr.replace(/[^0-9]/g, '');
    return numberStr ? parseInt(numberStr) : 0;
  };

  // تابع برای استخراج پسوند (مثل + یا ٪)
  const extractSuffix = (str: string) => {
    const englishStr = persianToEnglish(str);
    return englishStr.replace(/[0-9\s]/g, '');
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_URL}/content/home/stats`);
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        }
      } catch (error) {
        console.error('Error fetching stats content:', error);
      }
    };

    fetchContent();
  }, []);

  // استفاده از Intersection Observer برای تشخیص زمانی که کاربر به این بخش می‌رسد
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

  const handleSave = async (field: 'title' | 'description' | 'stats', value: string | StatItem[], index?: number, statField?: 'number' | 'text') => {
    try {
      let updatedContent = { ...content };

      if (field === 'stats' && typeof index === 'number' && statField) {
        const updatedStats = [...content.stats];
        updatedStats[index] = { ...updatedStats[index], [statField]: value as string };
        updatedContent.stats = updatedStats;
      } else {
        (updatedContent as any)[field] = value;
      }

      const response = await fetch(`${API_URL}/content/home/stats`, {
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
        throw new Error('Failed to update stats');
      }
    } catch (error) {
      console.error('Error updating stats:', error);
      alert('خطا در به‌روزرسانی آمار');
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-emerald-50 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100 rounded-full opacity-50 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-200 rounded-full opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-300 rounded-full opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fade-in-up">
          <EditableContent
            type="text"
            value={content.title}
            isAdmin={user?.role === 'admin'}
            onSave={(newValue) => handleSave('title', newValue)}
          />
        </h2>
        <div className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
          <EditableContent
            type="text"
            value={content.description}
            isAdmin={user?.role === 'admin'}
            onSave={(newValue) => handleSave('description', newValue)}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          {content.stats.map((stat, index) => {
            const number = extractNumber(stat.number);
            const suffix = extractSuffix(stat.number);

            return (
              <div
                key={index}
                className="text-center transform hover:scale-105 transition-all duration-500 animate-fade-in-up group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform scale-150"></div>
                  <div className="relative text-5xl font-bold text-emerald-600 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                    {user?.role === 'admin' ? (
                      <EditableContent
                        type="text"
                        value={stat.number}
                        isAdmin={true}
                        onSave={(newValue) => handleSave('stats', newValue, index, 'number')}
                      />
                    ) : inView ? (
                      <CountUp
                        start={0}
                        end={number}
                        duration={5}
                        useEasing={true}
                        enableScrollSpy={false}
                        easingFn={(t, b, c, d) => {
                          // تابع easing برای حرکت نرم‌تر
                          t /= d;
                          return c * t * t * t + b;
                        }}
                        separator=","
                        suffix={suffix}
                        formattingFn={(value) => englishToPersian(value.toString())}
                      />
                    ) : englishToPersian(number.toString()) + suffix}
                  </div>
                </div>
                <div className="text-gray-600 text-lg group-hover:text-gray-800 transition-colors duration-300">
                  <EditableContent
                    type="text"
                    value={stat.text}
                    isAdmin={user?.role === 'admin'}
                    onSave={(newValue) => handleSave('stats', newValue, index, 'text')}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
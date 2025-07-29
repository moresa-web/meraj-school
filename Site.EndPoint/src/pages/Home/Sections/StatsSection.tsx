import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import CountUp from 'react-countup';
import './StatsSection.css';

interface StatItem {
  number: string;
  text: string;
  icon?: string;
}

interface StatsContent {
  stats: StatItem[];
  title: string;
  description: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// SVG Icons as components
const GraduationIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const TeacherIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
    <path d="M12 11v4"/>
    <path d="M8 15h8"/>
  </svg>
);

const StudentIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const TrophyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 1.1.9 2 2 2s2-.9 2-2v-2.34"/>
    <path d="M12 2v8"/>
  </svg>
);

const BookIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const AwardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const TargetIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

// Icon mapping
const iconComponents: { [key: string]: React.ComponentType } = {
  'graduation': GraduationIcon,
  'teacher': TeacherIcon,
  'student': StudentIcon,
  'trophy': TrophyIcon,
  'book': BookIcon,
  'award': AwardIcon,
  'users': UsersIcon,
  'target': TargetIcon,
};

const defaultContent: StatsContent = {
  stats: [
    { 
      number: '۲۰+', 
      text: 'سال تجربه آموزشی',
      icon: 'graduation'
    },
    { 
      number: '۵۰+', 
      text: 'معلم مجرب',
      icon: 'teacher'
    },
    { 
      number: '۱۰۰۰+', 
      text: 'دانش‌آموز موفق',
      icon: 'student'
    },
    { 
      number: '۹۵٪', 
      text: 'قبولی در دانشگاه',
      icon: 'trophy'
    }
  ],
  title: 'آمار و دستاوردهای ما',
  description: 'در طول سال‌های فعالیت، افتخار خدمت به هزاران دانش‌آموز و خانواده‌های محترم را داشته‌ایم.'
};

export const StatsSection: React.FC = () => {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [content, setContent] = useState<StatsContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // تابع برای رندر آیکون
  const renderIcon = (iconName: string) => {
    const IconComponent = iconComponents[iconName] || GraduationIcon;
    return <IconComponent />;
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setError(null);
        const response = await fetch(`${API_URL}/api/content/home/stats`);
        if (response.ok) {
          const data = await response.json();
          if (JSON.stringify(data) !== JSON.stringify(defaultContent)) {
            setContent(data);
          }
        } else {
          throw new Error('خطا در دریافت اطلاعات');
        }
      } catch (error) {
        console.error('Error fetching stats content:', error);
        setError(error instanceof Error ? error.message : 'خطا در دریافت اطلاعات');
      } finally {
        setIsLoading(false);
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

  const handleSave = async (field: 'title' | 'description' | 'stats', value: string | StatItem[], index?: number, statField?: 'number' | 'text' | 'icon') => {
    try {
      let updatedContent = { ...content };

      if (field === 'stats' && typeof index === 'number' && statField) {
        const updatedStats = [...content.stats];
        updatedStats[index] = { ...updatedStats[index], [statField]: value as string };
        updatedContent.stats = updatedStats;
      } else {
        (updatedContent as any)[field] = value;
      }

      const response = await fetch(`${API_URL}/api/content/home/stats`, {
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
        throw new Error('خطا در به‌روزرسانی آمار');
      }
    } catch (error) {
      console.error('Error updating stats:', error);
      alert('خطا در به‌روزرسانی آمار');
    }
  };

  if (isLoading) {
    return (
      <section className="stats-section loading" role="status" aria-live="polite">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>در حال بارگذاری آمار...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="stats-section error" role="alert">
        <div className="error-content">
          <h3>خطا در بارگذاری</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            تلاش مجدد
          </button>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef} 
      className="stats-section" 
      role="region" 
      aria-label="آمار و دستاوردها"
    >
      {/* Animated background elements */}
      <div className="stats-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      <div className="stats-container">
        <div className="stats-header">
          <h2 className="stats-title animate-fade-in-up">
            <EditableContent
              type="text"
              value={content.title}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('title', newValue)}
            />
          </h2>
          <div className="stats-description animate-fade-in-up animation-delay-200">
            <EditableContent
              type="text"
              value={content.description}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('description', newValue)}
            />
          </div>
        </div>

        <div className="stats-grid">
          {content.stats.map((stat, index) => {
            const number = extractNumber(stat.number);
            const suffix = extractSuffix(stat.number);

            return (
              <div
                key={index}
                className="stat-card"
                style={{ animationDelay: `${index * 150}ms` }}
                role="article"
                aria-label={`${stat.text}: ${stat.number}`}
              >
                <div className="stat-icon">
                  {user?.role === 'admin' ? (
                    <div className="admin-icon-editor">
                      <div className="current-icon">
                        {renderIcon(stat.icon || 'graduation')}
                      </div>
                      <select
                        value={stat.icon || 'graduation'}
                        onChange={(e) => handleSave('stats', e.target.value, index, 'icon')}
                        className="icon-selector"
                        aria-label="انتخاب آیکون"
                      >
                        <option value="graduation">🎓 تجربه آموزشی</option>
                        <option value="teacher">👨‍🏫 معلم</option>
                        <option value="student">👥 دانش‌آموز</option>
                        <option value="trophy">🏆 دستاورد</option>
                        <option value="book">📚 کتاب</option>
                        <option value="award">🏅 جایزه</option>
                        <option value="users">👥 کاربران</option>
                        <option value="target">🎯 هدف</option>
                      </select>
                    </div>
                  ) : (
                    <div className="icon-svg">
                      {renderIcon(stat.icon || 'graduation')}
                    </div>
                  )}
                </div>
                
                <div className="stat-number">
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
                      duration={2.5}
                      useEasing={true}
                      enableScrollSpy={false}
                      easingFn={(t, b, c, d) => {
                        t /= d;
                        return c * t * t * t + b;
                      }}
                      separator=","
                      suffix={suffix}
                      formattingFn={(value) => englishToPersian(value.toString())}
                      preserveValue={false}
                      redraw={true}
                    />
                  ) : (
                    <span className="number-placeholder">
                      {englishToPersian(number.toString()) + suffix}
                    </span>
                  )}
                </div>
                
                <div className="stat-text">
                  <EditableContent
                    type="text"
                    value={stat.text}
                    isAdmin={user?.role === 'admin'}
                    onSave={(newValue) => handleSave('stats', newValue, index, 'text')}
                  />
                </div>

                {/* Decorative elements */}
                <div className="stat-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-dot"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom decoration */}
        <div className="stats-footer">
          <div className="footer-line"></div>
          <div className="footer-accent"></div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
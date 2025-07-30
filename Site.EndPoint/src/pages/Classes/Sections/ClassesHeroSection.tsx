import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { BookOpen, Users, Award, Clock } from 'lucide-react';
import EditableContent from '../../../components/EditableContent/EditableContent';
import { SkeletonLoading } from '../../../components/SkeletonLoading';
import './ClassesHeroSection.css';

interface ClassesHeroStats {
  totalClasses: number;
  activeStudents: number;
  successRate: number;
  totalHours: number;
}

interface ClassesHeroContent {
  title: string;
  description: string;
  stats: ClassesHeroStats;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const defaultContent: ClassesHeroContent = {
  title: 'کلاس‌های تقویتی',
  description: 'با بهترین اساتید و روش‌های نوین آموزشی، آینده تحصیلی فرزندتان را تضمین کنید',
  stats: {
    totalClasses: 15,
    activeStudents: 500,
    successRate: 95,
    totalHours: 480
  }
};

const ClassesHeroSection: React.FC = () => {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [content, setContent] = useState<ClassesHeroContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setError(null);
        const response = await fetch(`${API_URL}/api/content/classes/hero`);
        if (response.ok) {
          const data = await response.json();
          setContent({
            title: data.title || defaultContent.title,
            description: data.description || defaultContent.description,
            stats: {
              totalClasses: data.stats?.totalClasses || defaultContent.stats.totalClasses,
              activeStudents: data.stats?.activeStudents || defaultContent.stats.activeStudents,
              successRate: data.stats?.successRate || defaultContent.stats.successRate,
              totalHours: data.stats?.totalHours || defaultContent.stats.totalHours
            }
          });
        } else {
          throw new Error('خطا در دریافت اطلاعات');
        }
      } catch (error) {
        console.error('Error fetching classes hero content:', error);
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

  const handleSave = async (field: keyof ClassesHeroContent | 'stats', newValue: any, statField?: keyof ClassesHeroStats) => {
    try {
      let updatedContent = { ...content };

      if (field === 'stats' && statField) {
        updatedContent.stats = { ...updatedContent.stats, [statField]: newValue };
      } else {
        (updatedContent as any)[field] = newValue;
      }

      const response = await fetch(`${API_URL}/api/content/classes/hero`, {
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
        throw new Error('خطا در به‌روزرسانی محتوا');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      alert('خطا در به‌روزرسانی محتوا');
    }
  };

  if (isLoading) {
    return (
      <section className="classes-hero-section loading" role="status" aria-live="polite">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="classes-hero-icon mb-8">
              <SkeletonLoading type="avatar" width="64px" height="64px" />
            </div>
            
            <div className="mb-6">
              <SkeletonLoading type="title" height="48px" width="60%" />
            </div>
            
            <div className="mb-12">
              <SkeletonLoading type="text" lines={3} height="20px" />
            </div>
            
            <div className="classes-hero-stats">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="classes-hero-stat">
                  <div className="classes-hero-stat-icon">
                    <SkeletonLoading type="avatar" width="24px" height="24px" />
                  </div>
                  <div className="classes-hero-stat-number">
                    <SkeletonLoading type="title" height="32px" width="60px" />
                  </div>
                  <div className="classes-hero-stat-label">
                    <SkeletonLoading type="text" width="80px" height="16px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="classes-hero-section error" role="alert">
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
    <section ref={sectionRef} className="classes-hero-section">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Main Icon */}
          <div className="classes-hero-icon mb-8">
            <BookOpen className="w-16 h-16 text-emerald-400" />
          </div>

          {/* Title and Description */}
          <h1 className="classes-hero-title mb-6">
            <EditableContent
              type="text"
              value={content.title}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('title', newValue)}
            />
          </h1>
          <p className="classes-hero-description mb-12">
            <EditableContent
              type="text"
              value={content.description}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('description', newValue)}
            />
          </p>

          {/* Quick Stats */}
          <div className="classes-hero-stats">
            <div className="classes-hero-stat">
              <div className="classes-hero-stat-icon">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="classes-hero-stat-number">
                <EditableContent
                  type="text"
                  value={content.stats.totalClasses.toString()}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleSave('stats', parseInt(newValue) || 0, 'totalClasses')}
                />
              </div>
              <div className="classes-hero-stat-label">کلاس فعال</div>
            </div>

            <div className="classes-hero-stat">
              <div className="classes-hero-stat-icon">
                <Users className="w-6 h-6" />
              </div>
              <div className="classes-hero-stat-number">
                <EditableContent
                  type="text"
                  value={content.stats.activeStudents.toString()}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleSave('stats', parseInt(newValue) || 0, 'activeStudents')}
                />
              </div>
              <div className="classes-hero-stat-label">دانش‌آموز</div>
            </div>

            <div className="classes-hero-stat">
              <div className="classes-hero-stat-icon">
                <Award className="w-6 h-6" />
              </div>
              <div className="classes-hero-stat-number">
                <EditableContent
                  type="text"
                  value={content.stats.successRate.toString()}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleSave('stats', parseInt(newValue) || 0, 'successRate')}
                />
                %
              </div>
              <div className="classes-hero-stat-label">نرخ موفقیت</div>
            </div>

            <div className="classes-hero-stat">
              <div className="classes-hero-stat-icon">
                <Clock className="w-6 h-6" />
              </div>
              <div className="classes-hero-stat-number">
                <EditableContent
                  type="text"
                  value={content.stats.totalHours.toString()}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleSave('stats', parseInt(newValue) || 0, 'totalHours')}
                />
              </div>
              <div className="classes-hero-stat-label">ساعت آموزشی</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassesHeroSection;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import { 
  Building2, 
  Microscope, 
  Trophy, 
  Laptop, 
  PartyPopper,
  GraduationCap,
  Users,
  Award
} from 'lucide-react';
import './AboutTimelineSection.css';

interface TimelineEvent {
  year: string;
  event: string;
  description: string;
  icon: string;
  achievement: string;
}

interface AboutTimelineContent {
  title: string;
  description: string;
  timelineEvents: TimelineEvent[];
  stats: {
    years: string;
    students: string;
    awards: string;
  };
}

const defaultContent: AboutTimelineContent = {
  title: 'تاریخچه مدرسه معراج',
  description: 'مسیر 20 ساله موفقیت و پیشرفت دبیرستان معراج در خدمت به آموزش و پرورش نسل آینده',
  timelineEvents: [
    {
      year: '2003',
      event: 'تأسیس مدرسه معراج',
      description: 'دبیرستان معراج با هدف ارائه آموزش با کیفیت و پرورش استعدادهای دانش‌آموزان در منطقه تأسیس شد. شروع کار با 50 دانش‌آموز و 5 معلم.',
      icon: 'Building2',
      achievement: 'شروع فعالیت آموزشی'
    },
    {
      year: '2008',
      event: 'گسترش امکانات و تجهیزات',
      description: 'اضافه شدن آزمایشگاه‌های مجهز علوم، کامپیوتر و کلاس‌های هوشمند. راه‌اندازی کتابخانه تخصصی و سالن ورزشی.',
      icon: 'Microscope',
      achievement: 'تجهیزات پیشرفته'
    },
    {
      year: '2013',
      event: 'افتخارات ملی و بین‌المللی',
      description: 'کسب رتبه برتر در مسابقات علمی و المپیادهای دانش‌آموزی در سطح کشور. موفقیت در مسابقات بین‌المللی ریاضی و علوم.',
      icon: 'Trophy',
      achievement: 'موفقیت‌های علمی'
    },
    {
      year: '2018',
      event: 'توسعه تکنولوژی و دیجیتال',
      description: 'پیاده‌سازی سیستم مدیریت هوشمند مدرسه، کلاس‌های آنلاین و پلتفرم آموزشی. راه‌اندازی اپلیکیشن مدرسه.',
      icon: 'Laptop',
      achievement: 'تحول دیجیتال'
    },
    {
      year: '2023',
      event: 'جشن 20 سالگی و آینده‌نگری',
      description: 'جشن 20 سالگی مدرسه با حضور دانش‌آموزان، والدین و همکاران. برنامه‌ریزی برای توسعه بیشتر و پذیرش دانش‌آموزان جدید.',
      icon: 'PartyPopper',
      achievement: '20 سال تجربه'
    }
  ],
  stats: {
    years: '20+',
    students: '500+',
    awards: '50+'
  }
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Building2,
  Microscope,
  Trophy,
  Laptop,
  PartyPopper,
  GraduationCap,
  Users,
  Award
};

const AboutTimelineSection: React.FC = () => {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [content, setContent] = useState<AboutTimelineContent>(defaultContent);
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

      const response = await fetch(`${API_URL}/api/content/about/timeline`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setContent({
          title: data.title || defaultContent.title,
          description: data.description || defaultContent.description,
          timelineEvents: data.timelineEvents || defaultContent.timelineEvents,
          stats: data.stats || defaultContent.stats
        });
      } else {
        throw new Error(`خطا در دریافت تاریخچه: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching about timeline content:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطا در دریافت تاریخچه';
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
  const handleSave = useCallback(async (field: keyof AboutTimelineContent, newValue: any) => {
    try {
      const updatedContent = { ...content, [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/about/timeline`, {
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
        throw new Error(`خطا در به‌روزرسانی تاریخچه: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating about timeline content:', error);
      alert('خطا در به‌روزرسانی محتوا. لطفاً دوباره تلاش کنید.');
    }
  }, [content]);

  // Timeline event save handler
  const handleTimelineEventSave = useCallback(async (index: number, field: keyof TimelineEvent, newValue: string) => {
    try {
      const updatedTimelineEvents = [...content.timelineEvents];
      updatedTimelineEvents[index] = { ...updatedTimelineEvents[index], [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/about/timeline`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...content, timelineEvents: updatedTimelineEvents })
      });

      if (response.ok) {
        setContent({ ...content, timelineEvents: updatedTimelineEvents });
      } else {
        throw new Error(`خطا در به‌روزرسانی تاریخچه: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating about timeline content:', error);
      alert('خطا در به‌روزرسانی محتوا. لطفاً دوباره تلاش کنید.');
    }
  }, [content]);

  // Stats save handler
  const handleStatsSave = useCallback(async (field: keyof AboutTimelineContent['stats'], newValue: string) => {
    try {
      const updatedStats = { ...content.stats, [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/about/timeline`, {
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
        throw new Error(`خطا در به‌روزرسانی تاریخچه: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating about timeline content:', error);
      alert('خطا در به‌روزرسانی محتوا. لطفاً دوباره تلاش کنید.');
    }
  }, [content]);

  // Loading state
  if (isLoading) {
    return (
      <section className="about-timeline-section loading" role="status" aria-live="polite">
        <div className="about-timeline-loading-content">
          <div className="about-timeline-loading-spinner"></div>
          <p>در حال بارگذاری تاریخچه...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="about-timeline-section error" role="alert">
        <div className="about-timeline-error-content">
          <h3>خطا در بارگذاری</h3>
          <p>{error}</p>
          <button onClick={fetchContent} className="about-timeline-retry-button">
            تلاش مجدد
          </button>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className={`about-timeline-section ${inView ? 'about-timeline-section--visible' : ''}`}
      role="region"
      aria-label="تاریخچه مدرسه"
    >
      <div className="about-timeline-container">
        <div className="about-timeline-header">
          <h2 className="about-timeline-title">
            <EditableContent
              type="text"
              value={content.title}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('title', newValue)}
            />
          </h2>
          <p className="about-timeline-description">
            <EditableContent
              type="text"
              value={content.description}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('description', newValue)}
            />
          </p>
        </div>

        <div className="about-timeline">
          {content.timelineEvents.map((event, index) => {
            const IconComponent = iconMap[event.icon] || Building2;
            return (
              <div
                key={index}
                className="about-timeline-item"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="about-timeline-content">
                  <div className="about-timeline-icon">
                    <IconComponent size={32} />
                  </div>
                  <div className="about-timeline-year">
                    <EditableContent
                      type="text"
                      value={event.year}
                      isAdmin={user?.role === 'admin'}
                      onSave={(newValue) => handleTimelineEventSave(index, 'year', newValue)}
                    />
                  </div>
                  <h3 className="about-timeline-event">
                    <EditableContent
                      type="text"
                      value={event.event}
                      isAdmin={user?.role === 'admin'}
                      onSave={(newValue) => handleTimelineEventSave(index, 'event', newValue)}
                    />
                  </h3>
                  <p className="about-timeline-description">
                    <EditableContent
                      type="text"
                      value={event.description}
                      isAdmin={user?.role === 'admin'}
                      onSave={(newValue) => handleTimelineEventSave(index, 'description', newValue)}
                    />
                  </p>
                  <div className="about-timeline-achievement">
                    <span className="about-timeline-achievement-badge">
                      <EditableContent
                        type="text"
                        value={event.achievement}
                        isAdmin={user?.role === 'admin'}
                        onSave={(newValue) => handleTimelineEventSave(index, 'achievement', newValue)}
                      />
                    </span>
                  </div>
                </div>
                <div className="about-timeline-dot"></div>
              </div>
            );
          })}
        </div>

        <div className="about-timeline-footer">
          <div className="about-timeline-stats">
            <div className="about-timeline-stat">
              <div className="about-timeline-stat-icon">
                <GraduationCap size={24} />
              </div>
              <span className="about-timeline-stat-number">
                <EditableContent
                  type="text"
                  value={content.stats.years}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleStatsSave('years', newValue)}
                />
              </span>
              <span className="about-timeline-stat-label">سال تجربه</span>
            </div>
            <div className="about-timeline-stat">
              <div className="about-timeline-stat-icon">
                <Users size={24} />
              </div>
              <span className="about-timeline-stat-number">
                <EditableContent
                  type="text"
                  value={content.stats.students}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleStatsSave('students', newValue)}
                />
              </span>
              <span className="about-timeline-stat-label">دانش‌آموز موفق</span>
            </div>
            <div className="about-timeline-stat">
              <div className="about-timeline-stat-icon">
                <Award size={24} />
              </div>
              <span className="about-timeline-stat-number">
                <EditableContent
                  type="text"
                  value={content.stats.awards}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleStatsSave('awards', newValue)}
                />
              </span>
              <span className="about-timeline-stat-label">جایزه علمی</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="about-timeline-background">
        <div className="about-timeline-floating-element about-timeline-element-1"></div>
        <div className="about-timeline-floating-element about-timeline-element-2"></div>
        <div className="about-timeline-floating-element about-timeline-element-3"></div>
      </div>
    </section>
  );
};

export default AboutTimelineSection;
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import { 
  GraduationCap, 
  Users, 
  ClipboardList, 
  Monitor,
  BarChart3,
  Clock,
  Award,
  Shield,
  Star,
  BookOpen,
  Target,
  Zap,
  Brain,
  TrendingUp,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import './ClassesFeaturesSection.css';

interface ClassesFeature {
  title: string;
  description: string;
  icon: string;
}

interface ClassesFeaturesContent {
  title: string;
  subtitle: string;
  features: ClassesFeature[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const defaultContent: ClassesFeaturesContent = {
  title: 'مزایای کلاس‌های تقویتی',
  subtitle: 'چرا باید کلاس‌های تقویتی معراج را انتخاب کنید؟',
  features: [
    {
      title: 'اساتید مجرب و متخصص',
      description: 'با بیش از 20 سال تجربه در تدریس و آماده‌سازی دانش‌آموزان برای کنکور و امتحانات نهایی',
      icon: 'GraduationCap'
    },
    {
      title: 'کلاس‌های با ظرفیت محدود',
      description: 'حداکثر 15 دانش‌آموز در هر کلاس برای یادگیری بهتر و توجه شخصی بیشتر',
      icon: 'Users'
    },
    {
      title: 'مشاوره تحصیلی تخصصی',
      description: 'مشاوره تخصصی برای انتخاب رشته، برنامه‌ریزی تحصیلی و هدایت شغلی',
      icon: 'ClipboardList'
    },
    {
      title: 'امکانات مدرن و پیشرفته',
      description: 'کلاس‌های مجهز به تکنولوژی‌های نوین آموزشی و ابزارهای دیجیتال',
      icon: 'Monitor'
    },
    {
      title: 'گزارش‌های دقیق پیشرفت',
      description: 'گزارش‌های منظم و دقیق از پیشرفت تحصیلی دانش‌آموزان با نمودارهای تحلیلی',
      icon: 'BarChart3'
    },
    {
      title: 'پشتیبانی 24/7',
      description: 'پشتیبانی کامل در تمام ساعات شبانه‌روز برای پاسخگویی به سوالات دانش‌آموزان',
      icon: 'Clock'
    },
    {
      title: 'روش‌های نوین یادگیری',
      description: 'استفاده از روش‌های نوین یادگیری و تکنیک‌های مطالعه موثر',
      icon: 'Brain'
    },
    {
      title: 'آزمون‌های استاندارد',
      description: 'برگزاری آزمون‌های استاندارد و شبیه‌سازی کنکور برای آمادگی بهتر',
      icon: 'Target'
    }
  ]
};

// Icon mapping for features with better icons
const iconComponents: { [key: string]: React.ComponentType<any> } = {
  GraduationCap,
  Users,
  ClipboardList,
  Monitor,
  BarChart3,
  Clock,
  Award,
  Shield,
  Star,
  BookOpen,
  Target,
  Zap,
  Brain,
  TrendingUp,
  CheckCircle,
  Lightbulb
};

const ClassesFeaturesSection: React.FC = () => {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [content, setContent] = useState<ClassesFeaturesContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setError(null);
        const response = await fetch(`${API_URL}/api/content/classes/features`);
        if (response.ok) {
          const data = await response.json();
          setContent({
            title: data.title || defaultContent.title,
            subtitle: data.subtitle || defaultContent.subtitle,
            features: data.features || defaultContent.features
          });
        } else {
          throw new Error('خطا در دریافت اطلاعات');
        }
      } catch (error) {
        console.error('Error fetching classes features content:', error);
        setError(error instanceof Error ? error.message : 'خطا در دریافت اطلاعات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Intersection Observer for animations
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

  const handleSave = async (field: keyof ClassesFeaturesContent | 'feature', newValue: any, index?: number, featureField?: keyof ClassesFeature) => {
    try {
      let updatedContent = { ...content };

      if (field === 'feature' && typeof index === 'number' && featureField) {
        // Update specific feature field
        const updatedFeatures = [...content.features];
        updatedFeatures[index] = { ...updatedFeatures[index], [featureField]: newValue };
        updatedContent.features = updatedFeatures;
      } else {
        // Update main content field
        updatedContent = { ...content, [field]: newValue };
      }

      const response = await fetch(`${API_URL}/api/content/classes/features`, {
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
        throw new Error('خطا در به‌روزرسانی اطلاعات');
      }
    } catch (error) {
      console.error('Error updating classes features content:', error);
      alert('خطا در به‌روزرسانی محتوا. لطفاً دوباره تلاش کنید.');
    }
  };

  if (isLoading) {
    return (
      <section className="classes-features-section">
        <div className="classes-features-container">
          <div className="classes-features-loading">
            <div className="classes-features-loading-spinner"></div>
            <p>در حال بارگذاری مزایای کلاس‌ها...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="classes-features-section">
        <div className="classes-features-container">
          <div className="classes-features-error">
            <h3>خطا در بارگذاری</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="classes-features-retry-button">
              تلاش مجدد
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className={`classes-features-section ${inView ? 'classes-features-section--visible' : ''}`}
      role="region"
      aria-label="مزایای کلاس‌های تقویتی"
    >
      <div className="classes-features-container">
        <div className="classes-features-header">
          <div className="classes-features-badge">
            <Star className="w-5 h-5" />
            <span>مزایای ویژه</span>
          </div>
          <h2 className="classes-features-title">
            <EditableContent
              type="text"
              value={content.title}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('title', newValue)}
            />
          </h2>
          <p className="classes-features-subtitle">
            <EditableContent
              type="text"
              value={content.subtitle}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('subtitle', newValue)}
            />
          </p>
        </div>

        <div className="classes-features-grid">
          {content.features.map((feature, index) => {
            const IconComponent = iconComponents[feature.icon] || Star;
            return (
              <div
                key={index}
                className="classes-features-card"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="classes-features-card-header">
                  <div className="classes-features-icon">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="classes-features-card-number">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <h3 className="classes-features-card-title">
                  <EditableContent
                    type="text"
                    value={feature.title}
                    isAdmin={user?.role === 'admin'}
                    onSave={(newValue) => handleSave('feature', newValue, index, 'title')}
                  />
                </h3>
                <p className="classes-features-card-description">
                  <EditableContent
                    type="text"
                    value={feature.description}
                    isAdmin={user?.role === 'admin'}
                    onSave={(newValue) => handleSave('feature', newValue, index, 'description')}
                  />
                </p>
                <div className="classes-features-card-footer">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>مزیت کلیدی</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="classes-features-cta">
          <div className="classes-features-cta-content">
            <h3>آماده شروع یادگیری هستید؟</h3>
            <p>همین حالا در کلاس‌های تقویتی ما ثبت‌نام کنید و مسیر موفقیت را آغاز کنید</p>
            <button className="classes-features-cta-button">
              <span>ثبت‌نام در کلاس‌ها</span>
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced background decoration */}
      <div className="classes-features-background">
        <div className="classes-features-floating-element classes-features-element-1"></div>
        <div className="classes-features-floating-element classes-features-element-2"></div>
        <div className="classes-features-floating-element classes-features-element-3"></div>
        <div className="classes-features-floating-element classes-features-element-4"></div>
        <div className="classes-features-pattern"></div>
      </div>
    </section>
  );
};

export default ClassesFeaturesSection; 
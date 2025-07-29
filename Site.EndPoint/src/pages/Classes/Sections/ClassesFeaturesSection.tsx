import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, Users, Award, Clock, Target, TrendingUp, Shield, Zap } from 'lucide-react';
import './ClassesFeaturesSection.css';

interface ClassesFeaturesContent {
  title: string;
  subtitle: string;
  features: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
}

const defaultContent: ClassesFeaturesContent = {
  title: 'مزایای کلاس‌های تقویتی',
  subtitle: 'چرا باید کلاس‌های تقویتی ما را انتخاب کنید',
  features: [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'آموزش تخصصی',
      description: 'آموزش توسط اساتید مجرب و متخصص در هر زمینه با سال‌ها تجربه تدریس'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'کلاس‌های کم جمعیت',
      description: 'توجه ویژه به هر دانش‌آموز با تعداد محدود در هر کلاس برای یادگیری بهتر'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'مشاوره تحصیلی',
      description: 'مشاوره تخصصی برای انتخاب بهترین مسیر تحصیلی و برنامه‌ریزی آینده'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'انعطاف‌پذیری زمانی',
      description: 'برنامه‌های متنوع زمانی برای راحتی دانش‌آموزان و خانواده‌ها'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'هدف‌گذاری دقیق',
      description: 'برنامه‌ریزی شخصی‌سازی شده بر اساس نقاط قوت و ضعف هر دانش‌آموز'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'پیشرفت تضمینی',
      description: 'نظام ارزیابی مستمر و گزارش‌گیری منظم از پیشرفت تحصیلی'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'محیط امن',
      description: 'محیطی امن و دوستانه برای یادگیری و رشد شخصیتی دانش‌آموزان'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'تکنولوژی نوین',
      description: 'استفاده از جدیدترین تکنولوژی‌های آموزشی و ابزارهای دیجیتال'
    }
  ]
};

const ClassesFeaturesSection: React.FC = () => {
  const [content, setContent] = useState<ClassesFeaturesContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // API call would go here
      // const response = await axios.get(`${API_URL}/api/content/classes-features`);
      // setContent(response.data);
    } catch (err) {
      setError('خطا در دریافت محتوا');
      console.error('Error fetching classes features content:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <section className="classes-features-section">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-12"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-700 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="classes-features-section">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-400 mb-4">{error}</div>
            <button
              onClick={fetchContent}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="classes-features-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="classes-features-title">
            {content.title}
          </h2>
          <p className="classes-features-subtitle">
            {content.subtitle}
          </p>
        </div>

        <div className="classes-features-grid">
          {content.features.map((feature, index) => (
            <div
              key={feature.title}
              className="classes-feature-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="classes-feature-icon">
                {feature.icon}
              </div>
              <h3 className="classes-feature-title">
                {feature.title}
              </h3>
              <p className="classes-feature-description">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassesFeaturesSection; 
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { BookOpen, Users, Award, Clock } from 'lucide-react';
import './ClassesHeroSection.css';

interface ClassesHeroContent {
  title: string;
  description: string;
  stats: {
    totalClasses: number;
    activeStudents: number;
    successRate: number;
    totalHours: number;
  };
}

const defaultContent: ClassesHeroContent = {
  title: 'کلاس‌های تقویتی',
  description: 'با بهترین روش‌های نوین آموزشی، مسیر موفقیت تحصیلی خود را هموار کنید',
  stats: {
    totalClasses: 15,
    activeStudents: 320,
    successRate: 95,
    totalHours: 480
  }
};

const ClassesHeroSection: React.FC = () => {
  const [content, setContent] = useState<ClassesHeroContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { user } = useAuth();

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // API call would go here
      // const response = await axios.get(`${API_URL}/api/content/classes-hero`);
      // setContent(response.data);
    } catch (err) {
      setError('خطا در دریافت محتوا');
      console.error('Error fetching classes hero content:', err);
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
      <section className="classes-hero-section">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-8"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="classes-hero-section">
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
    <section ref={sectionRef} className="classes-hero-section">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Main Icon */}
          <div className="classes-hero-icon mb-8">
            <BookOpen className="w-16 h-16 text-emerald-400" />
          </div>

          {/* Title and Description */}
          <h1 className="classes-hero-title mb-6">
            {content.title}
          </h1>
          <p className="classes-hero-description mb-12">
            {content.description}
          </p>

          {/* Quick Stats */}
          <div className="classes-hero-stats">
            <div className="classes-hero-stat">
              <div className="classes-hero-stat-icon">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="classes-hero-stat-number">{content.stats.totalClasses}</div>
              <div className="classes-hero-stat-label">کلاس فعال</div>
            </div>

            <div className="classes-hero-stat">
              <div className="classes-hero-stat-icon">
                <Users className="w-6 h-6" />
              </div>
              <div className="classes-hero-stat-number">{content.stats.activeStudents}</div>
              <div className="classes-hero-stat-label">دانش‌آموز</div>
            </div>

            <div className="classes-hero-stat">
              <div className="classes-hero-stat-icon">
                <Award className="w-6 h-6" />
              </div>
              <div className="classes-hero-stat-number">{content.stats.successRate}%</div>
              <div className="classes-hero-stat-label">نرخ موفقیت</div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassesHeroSection;
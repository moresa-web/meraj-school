import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, Clock, Users, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import './ClassesScheduleSection.css';

interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  students: number;
  maxStudents: number;
  location: string;
  status: 'available' | 'full' | 'ongoing';
}

interface ClassesScheduleContent {
  title: string;
  subtitle: string;
  currentWeek: string;
  schedules: ScheduleItem[];
}

const defaultContent: ClassesScheduleContent = {
  title: 'برنامه کلاس‌ها',
  subtitle: 'برنامه هفتگی کلاس‌های تقویتی',
  currentWeek: 'هفته اول دی ماه ۱۴۰۲',
  schedules: [
    {
      id: '1',
      day: 'شنبه',
      time: '۱۶:۰۰ - ۱۸:۰۰',
      subject: 'ریاضی پیشرفته',
      teacher: 'دکتر احمدی',
      students: 12,
      maxStudents: 15,
      location: 'کلاس ۱۰۱',
      status: 'available'
    },
    {
      id: '2',
      day: 'یکشنبه',
      time: '۱۴:۰۰ - ۱۶:۰۰',
      subject: 'فیزیک کنکور',
      teacher: 'استاد محمدی',
      students: 15,
      maxStudents: 15,
      location: 'کلاس ۱۰۲',
      status: 'full'
    },
    {
      id: '3',
      day: 'دوشنبه',
      time: '۱۷:۰۰ - ۱۹:۰۰',
      subject: 'شیمی عمومی',
      teacher: 'دکتر رضایی',
      students: 8,
      maxStudents: 12,
      location: 'آزمایشگاه',
      status: 'available'
    },
    {
      id: '4',
      day: 'سه‌شنبه',
      time: '۱۵:۰۰ - ۱۷:۰۰',
      subject: 'زیست‌شناسی',
      teacher: 'استاد کریمی',
      students: 10,
      maxStudents: 12,
      location: 'کلاس ۱۰۳',
      status: 'available'
    },
    {
      id: '5',
      day: 'چهارشنبه',
      time: '۱۶:۰۰ - ۱۸:۰۰',
      subject: 'ادبیات فارسی',
      teacher: 'دکتر نوری',
      students: 14,
      maxStudents: 15,
      location: 'کلاس ۱۰۴',
      status: 'available'
    },
    {
      id: '6',
      day: 'پنج‌شنبه',
      time: '۱۴:۰۰ - ۱۶:۰۰',
      subject: 'زبان انگلیسی',
      teacher: 'استاد جعفری',
      students: 11,
      maxStudents: 12,
      location: 'کلاس ۱۰۵',
      status: 'available'
    }
  ]
};

const ClassesScheduleSection: React.FC = () => {
  const [content, setContent] = useState<ClassesScheduleContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // API call would go here
      // const response = await axios.get(`${API_URL}/api/content/classes-schedule`);
      // setContent(response.data);
    } catch (err) {
      setError('خطا در دریافت محتوا');
      console.error('Error fetching classes schedule content:', err);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-emerald-400';
      case 'full':
        return 'text-red-400';
      case 'ongoing':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'موجود';
      case 'full':
        return 'تکمیل';
      case 'ongoing':
        return 'در حال برگزاری';
      default:
        return 'نامشخص';
    }
  };

  const nextWeek = () => {
    setCurrentWeekIndex(prev => prev + 1);
  };

  const prevWeek = () => {
    setCurrentWeekIndex(prev => Math.max(0, prev - 1));
  };

  if (isLoading) {
    return (
      <section className="classes-schedule-section">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-12"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
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
      <section className="classes-schedule-section">
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
    <section ref={sectionRef} className="classes-schedule-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="classes-schedule-title">
            {content.title}
          </h2>
          <p className="classes-schedule-subtitle">
            {content.subtitle}
          </p>
        </div>

        {/* Week Navigation */}
        <div className="classes-schedule-navigation mb-8">
          <button
            onClick={prevWeek}
            disabled={currentWeekIndex === 0}
            className="classes-schedule-nav-button"
          >
            <ChevronRight className="w-5 h-5" />
            <span>هفته قبل</span>
          </button>
          
          <div className="classes-schedule-week-info">
            <Calendar className="w-5 h-5" />
            <span>{content.currentWeek}</span>
          </div>
          
          <button
            onClick={nextWeek}
            className="classes-schedule-nav-button"
          >
            <span>هفته بعد</span>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule Grid */}
        <div className="classes-schedule-grid">
          {content.schedules.map((schedule, index) => (
            <div
              key={schedule.id}
              className="classes-schedule-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="classes-schedule-header">
                <div className="classes-schedule-day">
                  {schedule.day}
                </div>
                <div className={`classes-schedule-status ${getStatusColor(schedule.status)}`}>
                  {getStatusText(schedule.status)}
                </div>
              </div>

              <div className="classes-schedule-content">
                <h3 className="classes-schedule-subject">
                  {schedule.subject}
                </h3>
                
                <div className="classes-schedule-details">
                  <div className="classes-schedule-detail">
                    <Clock className="w-4 h-4" />
                    <span>{schedule.time}</span>
                  </div>
                  
                  <div className="classes-schedule-detail">
                    <Users className="w-4 h-4" />
                    <span>{schedule.students}/{schedule.maxStudents} دانش‌آموز</span>
                  </div>
                  
                  <div className="classes-schedule-detail">
                    <MapPin className="w-4 h-4" />
                    <span>{schedule.location}</span>
                  </div>
                </div>

                <div className="classes-schedule-teacher">
                  <span>مدرس: {schedule.teacher}</span>
                </div>
              </div>

              <div className="classes-schedule-footer">
                <div className="classes-schedule-progress">
                  <div className="classes-schedule-progress-bar">
                    <div 
                      className="classes-schedule-progress-fill"
                      style={{ width: `${(schedule.students / schedule.maxStudents) * 100}%` }}
                    ></div>
                  </div>
                  <span className="classes-schedule-progress-text">
                    {Math.round((schedule.students / schedule.maxStudents) * 100)}% تکمیل
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassesScheduleSection; 
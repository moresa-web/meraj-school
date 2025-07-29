import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import './TestimonialsSection.css';

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialsContent {
  title: string;
  description: string;
  testimonials: Testimonial[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const TestimonialsSection: React.FC = () => {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [content, setContent] = useState<TestimonialsContent>({
    title: 'نظرات دانش‌آموزان و والدین',
    description: 'تجربیات و نظرات افرادی که با ما همکاری داشته‌اند',
    testimonials: [
      {
        name: 'علی محمدی',
        role: 'والد دانش‌آموز',
        text: 'با تشکر از کادر مجرب مدرسه معراج که با تلاش و پشتکار خود باعث پیشرفت تحصیلی فرزندم شدند. محیط آموزشی عالی و معلمان دلسوزی دارد.',
        rating: 5
      },
      {
        name: 'مریم احمدی',
        role: 'دانش‌آموز',
        text: 'فضای آموزشی مدرسه معراج بسیار عالی است و معلمان دلسوز و با تجربه‌ای دارد. برنامه‌های فوق‌العاده و امکانات خوبی دارد.',
        rating: 5
      },
      {
        name: 'رضا کریمی',
        role: 'والد دانش‌آموز',
        text: 'برنامه‌ریزی دقیق و مشاوره‌های تحصیلی مدرسه معراج کمک زیادی به آینده تحصیلی فرزندم کرد. از کادر آموزشی راضی هستم.',
        rating: 5
      }
    ]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setError(null);
        setIsLoading(true);
        
        const response = await fetch(`${API_URL}/api/content/home/testimonials`);
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        } else {
          throw new Error('خطا در دریافت نظرات');
        }
      } catch (error) {
        console.error('Error fetching testimonials content:', error);
        setError(error instanceof Error ? error.message : 'خطا در دریافت نظرات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async (field: keyof TestimonialsContent, newValue: any) => {
    try {
      const updatedContent = { ...content, [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/home/testimonials`, {
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
        throw new Error('خطا در به‌روزرسانی نظرات');
      }
    } catch (error) {
      console.error('Error updating testimonials:', error);
      alert('خطا در به‌روزرسانی نظرات');
    }
  };

  const handleTestimonialSave = async (index: number, field: 'name' | 'role' | 'text', newValue: string) => {
    try {
      const updatedTestimonials = [...content.testimonials];
      updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/home/testimonials`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...content, testimonials: updatedTestimonials })
      });

      if (response.ok) {
        setContent({ ...content, testimonials: updatedTestimonials });
      } else {
        throw new Error('خطا در به‌روزرسانی نظرات');
      }
    } catch (error) {
      console.error('Error updating testimonials:', error);
      alert('خطا در به‌روزرسانی نظرات');
    }
  };

  // تابع برای رندر ستاره‌های امتیاز
  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className="star-icon"
        fill={index < rating ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ));
  };

  // تابع برای تولید آواتار از حرف اول نام
  const generateAvatar = (name: string) => {
    return (
      <div className="author-avatar">
        <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-lg font-bold">
          {name.charAt(0)}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className="testimonials-section loading" role="status" aria-live="polite">
        <div className="testimonials-loading-content">
          <div className="testimonials-loading-spinner"></div>
          <p>در حال بارگذاری نظرات...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="testimonials-section error" role="alert">
        <div className="testimonials-error-content">
          <h3>خطا در بارگذاری</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="testimonials-retry-button"
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
      className="testimonials-section" 
      role="region" 
      aria-label="نظرات دانش‌آموزان و والدین"
    >
      {/* Animated background elements */}
      <div className="testimonials-background">
        <div className="testimonials-floating-element testimonials-element-1"></div>
        <div className="testimonials-floating-element testimonials-element-2"></div>
        <div className="testimonials-floating-element testimonials-element-3"></div>
      </div>

      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title animate-fade-in-up">
            <EditableContent
              type="text"
              value={content.title}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('title', newValue)}
            />
          </h2>
          <div className="testimonials-description animate-fade-in-up animation-delay-200">
            <EditableContent
              type="text"
              value={content.description}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('description', newValue)}
            />
          </div>
        </div>

        {content.testimonials.length === 0 ? (
          <div className="testimonials-empty-state" role="status">
            <svg className="testimonials-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="testimonials-empty-title">هیچ نظری یافت نشد</h3>
            <p className="testimonials-empty-description">در حال حاضر نظری برای نمایش وجود ندارد.</p>
          </div>
        ) : (
          <div className="testimonials-grid">
            {content.testimonials.map((testimonial, index) => (
              <article 
                key={index} 
                className="testimonial-card"
                style={{ animationDelay: `${index * 200}ms` }}
                role="article"
                aria-label={`نظر: ${testimonial.name}`}
              >
                {/* Quote icon */}
                <div className="testimonial-quote">
                  <div className="quote-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                </div>

                {/* Testimonial content */}
                <div className="testimonial-content">
                  <p className="testimonial-text">
                    <EditableContent
                      type="text"
                      value={testimonial.text}
                      isAdmin={user?.role === 'admin'}
                      onSave={(newValue) => handleTestimonialSave(index, 'text', newValue)}
                    />
                  </p>
                </div>

                {/* Rating stars */}
                <div className="testimonial-rating">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial author */}
                <div className="testimonial-author">
                  {testimonial.avatar ? (
                    <div className="author-avatar">
                      <img src={testimonial.avatar} alt={testimonial.name} />
                    </div>
                  ) : (
                    generateAvatar(testimonial.name)
                  )}
                  
                  <div className="author-info">
                    <h3 className="author-name">
                      <EditableContent
                        type="text"
                        value={testimonial.name}
                        isAdmin={user?.role === 'admin'}
                        onSave={(newValue) => handleTestimonialSave(index, 'name', newValue)}
                      />
                    </h3>
                    <p className="author-role">
                      <EditableContent
                        type="text"
                        value={testimonial.role}
                        isAdmin={user?.role === 'admin'}
                        onSave={(newValue) => handleTestimonialSave(index, 'role', newValue)}
                      />
                    </p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="testimonial-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-dot"></div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Footer decoration */}
        <div className="testimonials-footer">
          <div className="testimonials-footer-line"></div>
          <div className="testimonials-footer-accent"></div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;


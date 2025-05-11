import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';

interface Testimonial {
  name: string;
  role: string;
  text: string;
}

interface TestimonialsContent {
  title: string;
  description: string;
  testimonials: Testimonial[];
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const TestimonialsSection: React.FC = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<TestimonialsContent>({
    title: 'نظرات دانش‌آموزان و والدین',
    description: 'تجربیات و نظرات افرادی که با ما همکاری داشته‌اند',
    testimonials: [
      {
        name: 'علی محمدی',
        role: 'والد دانش‌آموز',
        text: 'با تشکر از کادر مجرب مدرسه مرج که با تلاش و پشتکار خود باعث پیشرفت تحصیلی فرزندم شدند.'
      },
      {
        name: 'مریم احمدی',
        role: 'دانش‌آموز',
        text: 'فضای آموزشی مدرسه مرج بسیار عالی است و معلمان دلسوز و با تجربه‌ای دارد.'
      },
      {
        name: 'رضا کریمی',
        role: 'والد دانش‌آموز',
        text: 'برنامه‌ریزی دقیق و مشاوره‌های تحصیلی مدرسه مرج کمک زیادی به آینده تحصیلی فرزندم کرد.'
      }
    ]
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_URL}/content/home/testimonials`);
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        }
      } catch (error) {
        console.error('Error fetching testimonials content:', error);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async (field: keyof TestimonialsContent, newValue: any) => {
    try {
      const updatedContent = { ...content, [field]: newValue };

      const response = await fetch(`${API_URL}/content/home/testimonials`, {
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
        throw new Error('Failed to update testimonials');
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

      const response = await fetch(`${API_URL}/content/home/testimonials`, {
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
        throw new Error('Failed to update testimonials');
      }
    } catch (error) {
      console.error('Error updating testimonials:', error);
      alert('خطا در به‌روزرسانی نظرات');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
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
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            <EditableContent
              type="text"
              value={content.description}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('description', newValue)}
            />
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.testimonials.map((testimonial, index) => (
            <div key={index} className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-emerald-500">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    <EditableContent
                      type="text"
                      value={testimonial.name}
                      isAdmin={user?.role === 'admin'}
                      onSave={(newValue) => handleTestimonialSave(index, 'name', newValue)}
                    />
                  </h3>
                  <p className="text-emerald-600">
                    <EditableContent
                      type="text"
                      value={testimonial.role}
                      isAdmin={user?.role === 'admin'}
                      onSave={(newValue) => handleTestimonialSave(index, 'role', newValue)}
                    />
                  </p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                <EditableContent
                  type="text"
                  value={testimonial.text}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleTestimonialSave(index, 'text', newValue)}
                />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;


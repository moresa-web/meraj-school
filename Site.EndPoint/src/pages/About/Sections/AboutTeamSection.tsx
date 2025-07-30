import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import EditableContent from '../../../components/EditableContent/EditableContent';
import { 
  GraduationCap, 
  BookOpen, 
  UserCheck, 
  Users,
  Crown,
  Award,
  Shield,
  Star
} from 'lucide-react';
import './AboutTeamSection.css';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

interface AboutTeamContent {
  title: string;
  description: string;
  teamMembers: TeamMember[];
}

const defaultContent: AboutTeamContent = {
  title: 'تیم مدیریتی',
  description: 'تیم متخصص و با تجربه ما متعهد به ارائه بهترین خدمات آموزشی و پرورشی به دانش‌آموزان است',
  teamMembers: [
    {
      name: 'دکتر احمد محمدی',
      role: 'مدیر مدرسه',
      bio: 'دکتر محمدی با بیش از 15 سال تجربه در مدیریت آموزشی، هدایت مدرسه معراج را بر عهده دارد.',
      avatar: 'Crown'
    },
    {
      name: 'خانم فاطمه احمدی',
      role: 'معاون آموزشی',
      bio: 'خانم احمدی متخصص در برنامه‌ریزی آموزشی و نظارت بر کیفیت تدریس است.',
      avatar: 'GraduationCap'
    },
    {
      name: 'استاد محمود کریمی',
      role: 'مشاور تحصیلی',
      bio: 'استاد کریمی با تخصص در روانشناسی تحصیلی، راهنمای دانش‌آموزان در مسیر موفقیت است.',
      avatar: 'UserCheck'
    },
    {
      name: 'خانم زهرا نوری',
      role: 'مسئول امور دانش‌آموزی',
      bio: 'خانم نوری مسئولیت نظارت بر امور دانش‌آموزی و ارتباط با والدین را بر عهده دارد.',
      avatar: 'Users'
    }
  ]
};

// Icon mapping for team members
const iconComponents: { [key: string]: React.ComponentType<any> } = {
  Crown,
  GraduationCap,
  UserCheck,
  Users,
  Award,
  Shield,
  Star,
  BookOpen
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AboutTeamSection: React.FC = () => {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [content, setContent] = useState<AboutTeamContent>(defaultContent);
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

      const response = await fetch(`${API_URL}/api/content/about/team`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setContent({
          title: data.title || defaultContent.title,
          description: data.description || defaultContent.description,
          teamMembers: data.teamMembers || defaultContent.teamMembers
        });
      } else {
        throw new Error(`خطا در دریافت تیم: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching about team content:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطا در دریافت تیم';
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
  const handleSave = useCallback(async (field: keyof AboutTeamContent, newValue: string) => {
    try {
      const updatedContent = { ...content, [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/about/team`, {
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
        throw new Error(`خطا در به‌روزرسانی تیم: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating about team content:', error);
      alert('خطا در به‌روزرسانی محتوا. لطفاً دوباره تلاش کنید.');
    }
  }, [content]);

  // Team member save handler
  const handleTeamMemberSave = useCallback(async (index: number, field: keyof TeamMember, newValue: string) => {
    try {
      const updatedTeamMembers = [...content.teamMembers];
      updatedTeamMembers[index] = { ...updatedTeamMembers[index], [field]: newValue };

      const response = await fetch(`${API_URL}/api/content/about/team`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...content, teamMembers: updatedTeamMembers })
      });

      if (response.ok) {
        setContent({ ...content, teamMembers: updatedTeamMembers });
      } else {
        throw new Error(`خطا در به‌روزرسانی تیم: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating about team content:', error);
      alert('خطا در به‌روزرسانی محتوا. لطفاً دوباره تلاش کنید.');
    }
  }, [content]);

  // Loading state
  if (isLoading) {
    return (
      <section className="about-team-section">
        <div className="about-team-container">
          <div className="about-team-loading">
            <div className="about-team-loading-spinner"></div>
            <p>در حال بارگذاری تیم مدیریتی...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className={`about-team-section ${inView ? 'about-team-section--visible' : ''}`}
      role="region"
      aria-label="تیم مدیریتی"
    >
      <div className="about-team-container">
        <div className="about-team-header">
          <h2 className="about-team-title">
            <EditableContent
              type="text"
              value={content.title}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('title', newValue)}
            />
          </h2>
          <p className="about-team-description">
            <EditableContent
              type="text"
              value={content.description}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('description', newValue)}
            />
          </p>
        </div>

        <div className="about-team-grid">
          {content.teamMembers.map((member, index) => {
            const IconComponent = iconComponents[member.avatar] || Users;
            return (
              <div
                key={index}
                className="about-team-member"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="about-team-avatar">
                  <IconComponent className="w-12 h-12" />
                </div>
                <h3 className="about-team-name">
                  <EditableContent
                    type="text"
                    value={member.name}
                    isAdmin={user?.role === 'admin'}
                    onSave={(newValue) => handleTeamMemberSave(index, 'name', newValue)}
                  />
                </h3>
                <p className="about-team-role">
                  <EditableContent
                    type="text"
                    value={member.role}
                    isAdmin={user?.role === 'admin'}
                    onSave={(newValue) => handleTeamMemberSave(index, 'role', newValue)}
                  />
                </p>
                <p className="about-team-bio">
                  <EditableContent
                    type="text"
                    value={member.bio}
                    isAdmin={user?.role === 'admin'}
                    onSave={(newValue) => handleTeamMemberSave(index, 'bio', newValue)}
                  />
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Background decoration */}
      <div className="about-team-background">
        <div className="about-team-floating-element about-team-element-1"></div>
        <div className="about-team-floating-element about-team-element-2"></div>
        <div className="about-team-floating-element about-team-element-3"></div>
      </div>
    </section>
  );
};

export default AboutTeamSection;
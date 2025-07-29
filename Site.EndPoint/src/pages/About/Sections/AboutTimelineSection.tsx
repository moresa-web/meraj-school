import React from 'react';
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

const AboutTimelineSection: React.FC = () => {
  const timelineEvents = [
    {
      year: '2003',
      event: 'تأسیس مدرسه معراج',
      description: 'دبیرستان معراج با هدف ارائه آموزش با کیفیت و پرورش استعدادهای دانش‌آموزان در منطقه تأسیس شد. شروع کار با 50 دانش‌آموز و 5 معلم.',
      icon: Building2,
      achievement: 'شروع فعالیت آموزشی'
    },
    {
      year: '2008',
      event: 'گسترش امکانات و تجهیزات',
      description: 'اضافه شدن آزمایشگاه‌های مجهز علوم، کامپیوتر و کلاس‌های هوشمند. راه‌اندازی کتابخانه تخصصی و سالن ورزشی.',
      icon: Microscope,
      achievement: 'تجهیزات پیشرفته'
    },
    {
      year: '2013',
      event: 'افتخارات ملی و بین‌المللی',
      description: 'کسب رتبه برتر در مسابقات علمی و المپیادهای دانش‌آموزی در سطح کشور. موفقیت در مسابقات بین‌المللی ریاضی و علوم.',
      icon: Trophy,
      achievement: 'موفقیت‌های علمی'
    },
    {
      year: '2018',
      event: 'توسعه تکنولوژی و دیجیتال',
      description: 'پیاده‌سازی سیستم مدیریت هوشمند مدرسه، کلاس‌های آنلاین و پلتفرم آموزشی. راه‌اندازی اپلیکیشن مدرسه.',
      icon: Laptop,
      achievement: 'تحول دیجیتال'
    },
    {
      year: '2023',
      event: 'جشن 20 سالگی و آینده‌نگری',
      description: 'جشن 20 سالگی مدرسه با حضور دانش‌آموزان، والدین و همکاران. برنامه‌ریزی برای توسعه بیشتر و پذیرش دانش‌آموزان جدید.',
      icon: PartyPopper,
      achievement: '20 سال تجربه'
    }
  ];

  return (
    <section className="about-timeline-section">
      <div className="about-timeline-container">
        <div className="about-timeline-header">
          <h2 className="about-timeline-title">تاریخچه مدرسه معراج</h2>
          <p className="about-timeline-description">
            مسیر 20 ساله موفقیت و پیشرفت دبیرستان معراج در خدمت به آموزش و پرورش نسل آینده
          </p>
        </div>

        <div className="about-timeline">
          {timelineEvents.map((event, index) => {
            const IconComponent = event.icon;
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
                  <div className="about-timeline-year">{event.year}</div>
                  <h3 className="about-timeline-event">{event.event}</h3>
                  <p className="about-timeline-description">{event.description}</p>
                  <div className="about-timeline-achievement">
                    <span className="about-timeline-achievement-badge">{event.achievement}</span>
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
              <span className="about-timeline-stat-number">20+</span>
              <span className="about-timeline-stat-label">سال تجربه</span>
            </div>
            <div className="about-timeline-stat">
              <div className="about-timeline-stat-icon">
                <Users size={24} />
              </div>
              <span className="about-timeline-stat-number">500+</span>
              <span className="about-timeline-stat-label">دانش‌آموز موفق</span>
            </div>
            <div className="about-timeline-stat">
              <div className="about-timeline-stat-icon">
                <Award size={24} />
              </div>
              <span className="about-timeline-stat-number">50+</span>
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
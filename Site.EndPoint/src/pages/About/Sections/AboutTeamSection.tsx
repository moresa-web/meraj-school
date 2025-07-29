import React from 'react';
import './AboutTeamSection.css';

const AboutTeamSection: React.FC = () => {
  const teamMembers = [
    {
      name: 'دکتر احمد محمدی',
      role: 'مدیر مدرسه',
      bio: 'دکتر محمدی با بیش از 15 سال تجربه در مدیریت آموزشی، هدایت مدرسه معراج را بر عهده دارد.',
      avatar: '👨‍🏫'
    },
    {
      name: 'خانم فاطمه احمدی',
      role: 'معاون آموزشی',
      bio: 'خانم احمدی متخصص در برنامه‌ریزی آموزشی و نظارت بر کیفیت تدریس است.',
      avatar: '👩‍🏫'
    },
    {
      name: 'استاد محمود کریمی',
      role: 'مشاور تحصیلی',
      bio: 'استاد کریمی با تخصص در روانشناسی تحصیلی، راهنمای دانش‌آموزان در مسیر موفقیت است.',
      avatar: '👨‍💼'
    },
    {
      name: 'خانم زهرا نوری',
      role: 'مسئول امور دانش‌آموزی',
      bio: 'خانم نوری مسئولیت نظارت بر امور دانش‌آموزی و ارتباط با والدین را بر عهده دارد.',
      avatar: '👩‍💼'
    }
  ];

  return (
    <section className="about-team-section">
      <div className="about-team-container">
        <div className="about-team-header">
          <h2 className="about-team-title">تیم مدیریتی</h2>
          <p className="about-team-description">
            تیم متخصص و با تجربه ما متعهد به ارائه بهترین خدمات آموزشی و پرورشی به دانش‌آموزان است
          </p>
        </div>

        <div className="about-team-grid">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="about-team-member"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="about-team-avatar">
                {member.avatar}
              </div>
              <h3 className="about-team-name">{member.name}</h3>
              <p className="about-team-role">{member.role}</p>
              <p className="about-team-bio">{member.bio}</p>
            </div>
          ))}
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
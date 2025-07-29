import React from 'react';
import './AboutStatsSection.css';

const AboutStatsSection: React.FC = () => {
  const stats = [
    {
      number: '500+',
      label: 'دانش‌آموز',
      description: 'دانش‌آموزان فعال در حال تحصیل'
    },
    {
      number: '50+',
      label: 'استاد',
      description: 'اساتید مجرب و متخصص'
    },
    {
      number: '20+',
      label: 'سال تجربه',
      description: 'سابقه درخشان در آموزش'
    },
    {
      number: '98%',
      label: 'رضایت',
      description: 'رضایت والدین و دانش‌آموزان'
    }
  ];

  return (
    <section className="about-stats-section">
      <div className="about-stats-container">
        <div className="about-stats-grid">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="about-stat-item"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="about-stat-number">{stat.number}</div>
              <div className="about-stat-label">{stat.label}</div>
              <div className="about-stat-description">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="about-stats-background">
        <div className="about-stats-floating-element about-stats-element-1"></div>
        <div className="about-stats-floating-element about-stats-element-2"></div>
        <div className="about-stats-floating-element about-stats-element-3"></div>
        <div className="about-stats-floating-element about-stats-element-4"></div>
      </div>
    </section>
  );
};

export default AboutStatsSection;
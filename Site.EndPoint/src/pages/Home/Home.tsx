import React from 'react';
import HeroSection from './Sections/HeroSection';
import StatsSection from './Sections/StatsSection';
import FeaturesSection from './Sections/FeaturesSection';
import LatestNewsSection from './Sections/LatestNewsSection';
import TestimonialsSection from './Sections/TestimonialsSection';
import CTASection from './Sections/CTASection';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <LatestNewsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default Home; 
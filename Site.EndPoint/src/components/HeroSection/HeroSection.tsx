import React, { ReactNode } from 'react';
import './HeroSection.css';

export interface HeroSectionProps {
  title: ReactNode;
  description: ReactNode;
  imageUrl?: string;
  backgroundImage?: string;
  overlayColor?: string;
  patternColor?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  imageUrl,
  backgroundImage,
  overlayColor = 'from-black/30',
  patternColor = 'white'
}) => {
  // Use imageUrl if provided, otherwise fall back to backgroundImage
  const imageSource = imageUrl || backgroundImage;

  return (
    <section className="relative pt-40 pb-24 bg-gradient-to-r from-emerald-600 to-teal-600 overflow-hidden">
      {/* Background Image */}
      {imageSource && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageSource})` }}
        />
      )}

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${overlayColor} to-transparent`}></div>

      {/* Animated Pattern */}
      <div className="absolute inset-0 pattern-dots" style={{ opacity: 0.1 }}></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 animate-fade-in-up">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-emerald-50 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
          {description}
        </p>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 rounded-full animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/10 rounded-full animate-pulse-slow animation-delay-1000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        <div className="floating-element element-3"></div>
        <div className="floating-element element-4"></div>
      </div>

      {/* Animated Border */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-border-flow"></div>
    </section>
  );
};

export default HeroSection; 
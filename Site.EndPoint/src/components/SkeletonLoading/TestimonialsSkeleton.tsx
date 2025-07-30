import React from 'react';
import SkeletonLoading from './SkeletonLoading';

interface TestimonialsSkeletonProps {
  count?: number;
  className?: string;
}

const TestimonialsSkeleton: React.FC<TestimonialsSkeletonProps> = ({ count = 3, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-shadow duration-300">
          {/* Quote Icon */}
          <div className="mb-4">
            <SkeletonLoading type="avatar" width="40px" height="40px" />
          </div>
          
          {/* Testimonial Text */}
          <div className="mb-6 space-y-3">
            <SkeletonLoading type="text" height="16px" />
            <SkeletonLoading type="text" height="16px" />
            <SkeletonLoading type="text" height="16px" width="80%" />
          </div>
          
          {/* Author Info */}
          <div className="flex items-center space-x-3">
            <SkeletonLoading type="avatar" width="50px" height="50px" />
            <div className="flex-1">
              <SkeletonLoading type="title" height="18px" width="70%" />
              <SkeletonLoading type="text" width="50px" height="14px" />
            </div>
          </div>
          
          {/* Rating */}
          <div className="mt-4 flex space-x-1">
            {Array.from({ length: 5 }).map((_, starIndex) => (
              <SkeletonLoading key={starIndex} type="avatar" width="16px" height="16px" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonialsSkeleton; 
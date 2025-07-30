import React from 'react';
import SkeletonLoading from './SkeletonLoading';

interface NewsSkeletonProps {
  count?: number;
  className?: string;
}

const NewsSkeleton: React.FC<NewsSkeletonProps> = ({ count = 3, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
          {/* News Image Skeleton */}
          <div className="relative">
            <SkeletonLoading type="image" height="200px" />
            <div className="absolute top-4 right-4">
              <SkeletonLoading type="button" width="80px" height="24px" />
            </div>
          </div>
          
          {/* News Content */}
          <div className="p-4">
            {/* Date */}
            <div className="mb-2">
              <SkeletonLoading type="text" width="100px" height="14px" />
            </div>
            
            {/* Title */}
            <div className="mb-3">
              <SkeletonLoading type="title" height="20px" width="90%" />
            </div>
            
            {/* Description */}
            <div className="mb-4 space-y-2">
              <SkeletonLoading type="text" height="16px" />
              <SkeletonLoading type="text" height="16px" width="80%" />
            </div>
            
            {/* Read More Button */}
            <div className="flex justify-between items-center">
              <SkeletonLoading type="button" width="100px" height="36px" />
              <SkeletonLoading type="avatar" width="32px" height="32px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsSkeleton; 
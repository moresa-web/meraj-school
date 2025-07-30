import React from 'react';
import SkeletonLoading from './SkeletonLoading';

interface ClassesSkeletonProps {
  count?: number;
  className?: string;
}

const ClassesSkeleton: React.FC<ClassesSkeletonProps> = ({ count = 6, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition-shadow duration-300">
          {/* Class Image Skeleton */}
          <div className="relative">
            <SkeletonLoading type="image" height="180px" />
            <div className="absolute top-4 left-4">
              <SkeletonLoading type="button" width="60px" height="24px" />
            </div>
            <div className="absolute top-4 right-4">
              <SkeletonLoading type="button" width="80px" height="24px" />
            </div>
          </div>
          
          {/* Class Content */}
          <div className="p-6">
            {/* Title */}
            <div className="mb-3">
              <SkeletonLoading type="title" height="24px" width="85%" />
            </div>
            
            {/* Description */}
            <div className="mb-4 space-y-2">
              <SkeletonLoading type="text" height="16px" />
              <SkeletonLoading type="text" height="16px" width="70%" />
            </div>
            
            {/* Class Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <SkeletonLoading type="avatar" width="16px" height="16px" />
                <SkeletonLoading type="text" width="60px" height="14px" />
              </div>
              <div className="flex items-center space-x-2">
                <SkeletonLoading type="avatar" width="16px" height="16px" />
                <SkeletonLoading type="text" width="50px" height="14px" />
              </div>
              <div className="flex items-center space-x-2">
                <SkeletonLoading type="avatar" width="16px" height="16px" />
                <SkeletonLoading type="text" width="80px" height="14px" />
              </div>
              <div className="flex items-center space-x-2">
                <SkeletonLoading type="avatar" width="16px" height="16px" />
                <SkeletonLoading type="text" width="70px" height="14px" />
              </div>
            </div>
            
            {/* Price and Button */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <SkeletonLoading type="text" width="60px" height="20px" />
                <SkeletonLoading type="text" width="40px" height="16px" />
              </div>
              <SkeletonLoading type="button" width="120px" height="40px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassesSkeleton; 
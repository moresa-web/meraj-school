import React from 'react';
import './SkeletonLoading.css';

interface SkeletonLoadingProps {
  type?: 'text' | 'title' | 'card' | 'list' | 'image' | 'button' | 'avatar' | 'table' | 'form';
  lines?: number;
  className?: string;
  height?: string;
  width?: string;
  rounded?: boolean;
  animated?: boolean;
}

const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  type = 'text',
  lines = 1,
  className = '',
  height,
  width,
  rounded = true,
  animated = true
}) => {
  const baseClass = `skeleton ${animated ? 'skeleton-animated' : ''} ${rounded ? 'skeleton-rounded' : ''} ${className}`;

  const renderSkeleton = () => {
    switch (type) {
      case 'title':
        return (
          <div className={`${baseClass} skeleton-title`} style={{ height: height || '2rem', width: width || '60%' }}></div>
        );
      
      case 'card':
        return (
          <div className="skeleton-card">
            <div className={`${baseClass} skeleton-card-image`} style={{ height: height || '200px' }}></div>
            <div className="skeleton-card-content">
              <div className={`${baseClass} skeleton-card-title`} style={{ height: '1.5rem', width: '80%' }}></div>
              <div className={`${baseClass} skeleton-card-text`} style={{ height: '1rem', width: '100%' }}></div>
              <div className={`${baseClass} skeleton-card-text`} style={{ height: '1rem', width: '60%' }}></div>
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="skeleton-list">
            {Array.from({ length: lines }).map((_, index) => (
              <div key={index} className="skeleton-list-item">
                <div className={`${baseClass} skeleton-list-avatar`} style={{ height: '40px', width: '40px' }}></div>
                <div className="skeleton-list-content">
                  <div className={`${baseClass} skeleton-list-title`} style={{ height: '1rem', width: '70%' }}></div>
                  <div className={`${baseClass} skeleton-list-text`} style={{ height: '0.8rem', width: '50%' }}></div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'image':
        return (
          <div className={`${baseClass} skeleton-image`} style={{ height: height || '200px', width: width || '100%' }}></div>
        );
      
      case 'button':
        return (
          <div className={`${baseClass} skeleton-button`} style={{ height: height || '2.5rem', width: width || '120px' }}></div>
        );
      
      case 'avatar':
        return (
          <div className={`${baseClass} skeleton-avatar`} style={{ height: height || '50px', width: width || '50px' }}></div>
        );
      
      case 'table':
        return (
          <div className="skeleton-table">
            <div className="skeleton-table-header">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={`${baseClass} skeleton-table-cell`} style={{ height: '2rem' }}></div>
              ))}
            </div>
            {Array.from({ length: lines }).map((_, rowIndex) => (
              <div key={rowIndex} className="skeleton-table-row">
                {Array.from({ length: 4 }).map((_, colIndex) => (
                  <div key={colIndex} className={`${baseClass} skeleton-table-cell`} style={{ height: '1.5rem' }}></div>
                ))}
              </div>
            ))}
          </div>
        );
      
      case 'form':
        return (
          <div className="skeleton-form">
            {Array.from({ length: lines }).map((_, index) => (
              <div key={index} className="skeleton-form-field">
                <div className={`${baseClass} skeleton-form-label`} style={{ height: '1rem', width: '30%' }}></div>
                <div className={`${baseClass} skeleton-form-input`} style={{ height: '2.5rem', width: '100%' }}></div>
              </div>
            ))}
          </div>
        );
      
      default: // text
        return (
          <div className="skeleton-text-container">
            {Array.from({ length: lines }).map((_, index) => (
              <div
                key={index}
                className={`${baseClass} skeleton-text`}
                style={{
                  height: height || '1rem',
                  width: index === lines - 1 ? width || '60%' : width || '100%'
                }}
              ></div>
            ))}
          </div>
        );
    }
  };

  return renderSkeleton();
};

export default SkeletonLoading; 
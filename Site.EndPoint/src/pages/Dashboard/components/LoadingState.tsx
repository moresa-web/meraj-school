import React from 'react';

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
}

const LoadingState: React.FC<LoadingStateProps> = ({ loading, error }) => {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return null;
};

export default LoadingState; 
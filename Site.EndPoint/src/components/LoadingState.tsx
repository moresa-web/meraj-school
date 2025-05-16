import React from 'react';

interface LoadingStateProps {
  message?: string;
  error?: string | null;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'در حال بارگذاری...', error = null }) => {
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingState; 
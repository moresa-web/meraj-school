import React from 'react';

const NoResults: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 min-h-[300px] animate-fade-in">
      <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{message || 'کلاسی یافت نشد'}</h3>
      <p className="text-gray-500">متأسفانه هیچ کلاسی با فیلترهای انتخاب‌شده یافت نشد.</p>
    </div>
  );
};

export default NoResults; 
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useNews } from '@/hooks/useNews';
import NewsForm from '@/components/news/NewsForm';
import { NewsFormData } from '@/types/news';
import { ArrowUturnLeftIcon, NewspaperIcon } from '@heroicons/react/24/outline';

export default function NewNewsPage() {
  const router = useRouter();
  const { createNews, loading, error } = useNews();

  const handleSubmit = async (data: NewsFormData) => {
    try {
      await createNews(data);
      router.push('/news');
    } catch (err) {
      console.error('Error creating news:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <NewspaperIcon className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 ml-2" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">افزودن خبر جدید</h1>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center px-3 py-2 text-sm text-emerald-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowUturnLeftIcon className="h-4 w-4 ml-1" />
          بازگشت به لیست اخبار
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-r-4 border-red-500 text-red-600 p-4 md:p-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="mr-3">
              <p className="text-sm md:text-base">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <NewsForm onSubmit={handleSubmit} isSubmitting={loading} />
      </div>
    </div>
  );
} 
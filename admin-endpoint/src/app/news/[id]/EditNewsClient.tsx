'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNews } from '@/hooks/useNews';
import NewsForm from '@/components/news/NewsForm';
import { News, NewsFormData } from '@/types/news';

interface EditNewsClientProps {
  id: string;
}

export default function EditNewsClient({ id }: EditNewsClientProps) {
  const router = useRouter();
  const { updateNews, fetchNews, loading, error } = useNews();
  const [news, setNews] = useState<News | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchNews();
        let newsItem = data.find((item: News) => item._id === id);
        if (!newsItem) {
          newsItem = data.find((item: News) => item.slug === id);
        }
        if (newsItem) {
          setNews(newsItem);
        } else {
          router.push('/news');
        }
      } catch (err) {
        console.error('Error loading news:', err);
      }
    };

    loadNews();
  }, [fetchNews, id, router]);

  const handleSubmit = async (data: NewsFormData) => {
    try {
      const identifier = news?.slug || id;
      await updateNews(identifier, data);
      router.push('/news');
    } catch (err) {
      console.error('Error updating news:', err);
    }
  };

  if (!news) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">ویرایش خبر</h1>
        <p className="mt-2 text-sm text-gray-600">
          ویرایش اطلاعات و محتوای خبر
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm md:text-base">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <NewsForm
          initialData={news}
          onSubmit={handleSubmit}
          isSubmitting={loading}
        />
      </div>
    </div>
  );
} 
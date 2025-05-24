'use client';

import React, { useEffect, useState } from 'react';
import { useNews } from '@/hooks/useNews';
import NewsList from '@/components/news/NewsList';
import Link from 'next/link';
import { News } from '@/types/news';

export default function NewsPage() {
  const { fetchNews, deleteNews, loading, error } = useNews();
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchNews();
        setNews(data);
      } catch (err) {
        console.error('Error loading news:', err);
      }
    };

    loadNews();
  }, [fetchNews]);

  const handleDelete = async (slug: string) => {
    if (window.confirm('آیا از حذف این خبر اطمینان دارید؟')) {
      try {
        await deleteNews(slug);
        setNews((prevNews) => prevNews.filter((item) => item.slug !== slug));
      } catch (err) {
        console.error('Error deleting news:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">مدیریت اخبار</h1>
          <p className="mt-2 text-sm text-gray-600">
            مدیریت و ویرایش اخبار سایت
          </p>
        </div>
        <Link
          href="/news/new"
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors w-full sm:w-auto justify-center"
        >
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          افزودن خبر جدید
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <NewsList news={news} loading={loading} onDelete={handleDelete} />
      </div>
    </div>
  );
} 
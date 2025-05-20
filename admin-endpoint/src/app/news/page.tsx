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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">مدیریت اخبار</h1>
        <Link
          href="/news/new"
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <NewsList news={news} loading={loading} onDelete={handleDelete} />
    </div>
  );
} 
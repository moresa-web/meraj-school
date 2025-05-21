'use client';

import React, { useState } from 'react';
import { News } from '@/types/news';
import Image from 'next/image';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface NewsListProps {
  news: News[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
}

const NewsList: React.FC<NewsListProps> = ({ news, loading, onDelete }) => {
  const [search, setSearch] = useState('');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="spinner"></div>
      </div>
    );
  }

  const searchValue = search.toLowerCase();
  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchValue) ||
    (item.category && item.category.toLowerCase().includes(searchValue)) ||
    (item.date && item.date.toLowerCase().includes(searchValue)) ||
    (item.description && item.description.toLowerCase().includes(searchValue)) ||
    (item.content && item.content.toLowerCase().includes(searchValue))
  );

  if (filteredNews.length === 0) {
    return (
      <div className="text-center py-12">
        <input
          type="text"
          placeholder="جستجو در اخبار..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-6 px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm bg-white text-gray-900 placeholder-gray-400 text-base"
        />
        <p className="text-gray-500 text-lg mb-4">هیچ خبری یافت نشد</p>
        <Link
          href="/news/new"
          className="btn-primary inline-flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          افزودن خبر جدید
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="جستجو در اخبار بر اساس عنوان، دسته‌بندی، تاریخ و ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm bg-white text-gray-900 placeholder-gray-400 text-base"
        />
        <svg className="-ml-10 w-5 h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((item) => (
        <div
          key={item._id}
          className="card group"
        >
          {item.image && (
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <Image
                src={`${API_URL}${item.image}`}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                quality={75}
                priority={false}
              />
            </div>
          )}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-success">{item.category}</span>
              <span className="text-sm text-gray-500">{item.date}</span>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {item.description || item.content}
            </p>
            <div className="flex justify-end gap-2">
              <Link
                href={`/news/${item._id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
                ویرایش
              </Link>
              <button
                onClick={() => onDelete(item.slug)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                حذف
              </button>
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default NewsList; 
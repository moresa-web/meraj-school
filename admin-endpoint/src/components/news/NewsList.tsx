'use client';

import React from 'react';
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
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
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
  );
};

export default NewsList; 
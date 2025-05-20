'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSEO } from '@/hooks/useSEO';
import { SEO } from '@/types/seo';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function SEOList() {
  const { seoList, loading, error, deleteSEO } = useSEO();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این تنظیمات SEO اطمینان دارید؟')) {
      try {
        setDeletingId(id);
        await deleteSEO(id);
      } catch (error) {
        console.error('Error deleting SEO:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        {error}
      </div>
    );
  }

  if (seoList.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">هیچ تنظیمات SEO یافت نشد</p>
        <Link
          href="/seo/new"
          className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          ایجاد تنظیمات جدید
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">تنظیمات SEO</h1>
        <Link
          href="/seo/new"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          ایجاد تنظیمات جدید
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {seoList.map((seo) => (
          <div
            key={seo._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {seo.schoolName}
                </h2>
                <p className="text-gray-600">{seo.title}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/seo/${seo._id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                  ویرایش
                </Link>
                <button
                  onClick={() => handleDelete(seo._id)}
                  disabled={deletingId === seo._id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4" />
                  حذف
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">توضیحات:</span>
                <p className="text-gray-900 line-clamp-2">{seo.description}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">کلمات کلیدی:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Array.isArray(seo.keywords) && seo.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              {seo.image && (
                <div>
                  <span className="text-sm text-gray-500">تصویر:</span>
                  <p className="text-gray-900 truncate">{seo.image}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-gray-500">آدرس سایت:</span>
                <p className="text-gray-900 truncate">{seo.siteUrl}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">شبکه‌های اجتماعی:</span>
                <div className="flex gap-2 mt-1">
                  {seo.socialMedia.instagram && (
                    <a
                      href={seo.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      اینستاگرام
                    </a>
                  )}
                  {seo.socialMedia.twitter && (
                    <a
                      href={`https://twitter.com/${seo.socialMedia.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      توییتر
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
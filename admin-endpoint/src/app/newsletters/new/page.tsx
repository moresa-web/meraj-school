'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNewsletter } from '@/hooks/useNewsletter';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NewNewsletterPage() {
  const router = useRouter();
  const { createNewsletter, loading, error } = useNewsletter();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
    sent: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createNewsletter(formData);
    if (success) {
      router.push('/newsletters');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">افزودن خبرنامه جدید</h1>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                عنوان خبرنامه
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="عنوان خبرنامه را وارد کنید"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                موضوع ایمیل
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="موضوع ایمیل را وارد کنید"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                محتوای خبرنامه
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="محتوای خبرنامه را وارد کنید"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`
                  px-6 py-2 rounded-md text-white font-medium
                  ${loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  }
                  transition-colors
                `}
              >
                {loading ? 'در حال ذخیره...' : 'ذخیره خبرنامه'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
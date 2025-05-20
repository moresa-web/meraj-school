'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSEO } from '@/hooks/useSEO';
import { SEO } from '@/types/seo';

interface SEOFormProps {
  seoId?: string;
  initialData?: Partial<SEO>;
}

export default function SEOForm({ seoId, initialData }: SEOFormProps) {
  const router = useRouter();
  const { createSEO, updateSEO } = useSEO();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    page: '',
    title: '',
    description: '',
    keywords: [] as string[],
    ogImage: '',
    ogTitle: '',
    ogDescription: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        page: initialData.page || '',
        title: initialData.title || '',
        description: initialData.description || '',
        keywords: initialData.keywords || [],
        ogImage: initialData.ogImage || '',
        ogTitle: initialData.ogTitle || '',
        ogDescription: initialData.ogDescription || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (seoId) {
        await updateSEO(seoId, formData);
      } else {
        await createSEO(formData);
      }
      router.push('/seo');
    } catch (err) {
      setError('خطا در ذخیره تنظیمات SEO');
      console.error('Error saving SEO:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        <div>
          <label htmlFor="page" className="block text-sm font-medium text-gray-700 mb-1">
            صفحه
          </label>
          <input
            type="text"
            id="page"
            value={formData.page}
            onChange={(e) => setFormData({ ...formData, page: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            عنوان
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            توضیحات
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
            کلمات کلیدی (با کاما جدا کنید)
          </label>
          <input
            type="text"
            id="keywords"
            value={formData.keywords.join(', ')}
            onChange={(e) =>
              setFormData({
                ...formData,
                keywords: e.target.value.split(',').map((s) => s.trim()),
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="ogImage" className="block text-sm font-medium text-gray-700 mb-1">
            تصویر Open Graph
          </label>
          <input
            type="text"
            id="ogImage"
            value={formData.ogImage}
            onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="آدرس تصویر"
          />
        </div>

        <div>
          <label htmlFor="ogTitle" className="block text-sm font-medium text-gray-700 mb-1">
            عنوان Open Graph
          </label>
          <input
            type="text"
            id="ogTitle"
            value={formData.ogTitle}
            onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="ogDescription" className="block text-sm font-medium text-gray-700 mb-1">
            توضیحات Open Graph
          </label>
          <textarea
            id="ogDescription"
            value={formData.ogDescription}
            onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'در حال ذخیره...' : seoId ? 'بروزرسانی' : 'ایجاد'}
        </button>
      </div>
    </form>
  );
} 
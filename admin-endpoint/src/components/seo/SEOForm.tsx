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
    title: '',
    description: '',
    keywords: [] as string[],
    image: '',
    siteUrl: '',
    schoolName: '',
    address: '',
    phone: '',
    email: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      telegram: '',
      linkedin: '',
    },
    ogImage: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        keywords: initialData.keywords || [],
        image: initialData.image || '',
        siteUrl: initialData.siteUrl || '',
        schoolName: initialData.schoolName || '',
        address: initialData.address || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        socialMedia: {
          instagram: initialData.socialMedia?.instagram || '',
          twitter: initialData.socialMedia?.twitter || '',
          telegram: initialData.socialMedia?.telegram || '',
          linkedin: initialData.socialMedia?.linkedin || '',
        },
        ogImage: initialData.ogImage || '',
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
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            تصویر اصلی
          </label>
          <input
            type="text"
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="آدرس تصویر"
          />
        </div>

        <div>
          <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700 mb-1">
            آدرس سایت
          </label>
          <input
            type="url"
            id="siteUrl"
            value={formData.siteUrl}
            onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="https://example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
            نام مدرسه
          </label>
          <input
            type="text"
            id="schoolName"
            value={formData.schoolName}
            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            آدرس
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            شماره تلفن
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            ایمیل
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">شبکه‌های اجتماعی</h3>
          
          <div>
            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
              اینستاگرام
            </label>
            <input
              type="url"
              id="instagram"
              value={formData.socialMedia.instagram}
              onChange={(e) => setFormData({
                ...formData,
                socialMedia: { ...formData.socialMedia, instagram: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://instagram.com/username"
            />
          </div>

          <div>
            <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
              توییتر
            </label>
            <input
              type="url"
              id="twitter"
              value={formData.socialMedia.twitter}
              onChange={(e) => setFormData({
                ...formData,
                socialMedia: { ...formData.socialMedia, twitter: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://twitter.com/username"
            />
          </div>

          <div>
            <label htmlFor="telegram" className="block text-sm font-medium text-gray-700 mb-1">
              تلگرام
            </label>
            <input
              type="url"
              id="telegram"
              value={formData.socialMedia.telegram}
              onChange={(e) => setFormData({
                ...formData,
                socialMedia: { ...formData.socialMedia, telegram: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://t.me/username"
            />
          </div>

          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
              لینکدین
            </label>
            <input
              type="url"
              id="linkedin"
              value={formData.socialMedia.linkedin}
              onChange={(e) => setFormData({
                ...formData,
                socialMedia: { ...formData.socialMedia, linkedin: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
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
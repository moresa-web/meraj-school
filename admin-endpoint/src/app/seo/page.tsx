'use client';

import { useState, useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { SEO } from '@/types/seo';
import { toast } from 'react-hot-toast';
import { PhotoIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { getImageUrl } from '@/utils/format';
import { cookies, headers } from 'next/headers';

interface SEOFormData {
  title: string;
  description: string;
  keywords: string[];
  image: string;
  siteUrl: string;
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    instagram?: string;
    twitter?: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// تنظیمات پیش‌فرض axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.baseURL = API_URL;
axios.defaults.timeout = 10000; // 10 seconds timeout

// تنظیم interceptor برای اضافه کردن توکن به همه درخواست‌ها
axios.interceptors.request.use(async (config) => {
  try {
    const response = await fetch('/api/auth/token');
    const data = await response.json();
    
    if (data.token) {
      config.headers.Authorization = `Bearer ${data.token}`;
    }

    console.log('Request config:', {
      ...config,
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization ? 'Bearer [HIDDEN]' : undefined
      }
    });
  } catch (error) {
    console.error('Error getting token:', error);
  }
  return config;
});

// تنظیم interceptor برای لاگ کردن پاسخ‌ها
axios.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    return Promise.reject(error);
  }
);

export default function SEOSettingsPage() {
  const { seoList, loading: seoLoading, error, updateSEO, createSEO } = useSEO();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SEOFormData>({
    title: '',
    description: '',
    keywords: [],
    image: '',
    siteUrl: '',
    schoolName: '',
    address: '',
    phone: '',
    email: '',
    socialMedia: {
      instagram: '',
      twitter: ''
    }
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  useEffect(() => {
    if (seoList.length > 0) {
      const data = seoList[0];
      setFormData({
        title: data.title || '',
        description: data.description || '',
        keywords: data.keywords || [],
        image: data.image || '',
        siteUrl: data.siteUrl || '',
        schoolName: data.schoolName || '',
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        socialMedia: {
          instagram: data.socialMedia?.instagram || '',
          twitter: data.socialMedia?.twitter || ''
        }
      });
      if (data.image) {
        setPreviewImage(data.image);
      }
    }
  }, [seoList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('socialMedia.')) {
      const [_, field] = name.split('.');
      setFormData((prev: SEOFormData) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [field]: value
        }
      }));
    } else {
      setFormData((prev: SEOFormData) => ({ ...prev, [name]: value }));
    }
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value.split(',').map((k: string) => k.trim()).filter(Boolean);
    setFormData((prev: SEOFormData) => ({ ...prev, keywords }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        const imageUrl = getImageUrl(response.data.url);
        setPreviewImage(imageUrl);
        setFormData((prev: SEOFormData) => ({ ...prev, image: response.data.url }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          headers: error.response?.headers,
        });
        toast.error(error.response?.data?.message || 'خطا در آپلود تصویر');
      } else {
        toast.error('خطا در آپلود تصویر');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const seoData = {
        ...formData,
        keywords: formData.keywords.map(k => k.trim()).filter(Boolean)
      };
      
      if (seoList[0]?._id) {
        await updateSEO(seoList[0]._id, seoData);
      } else {
        await createSEO(seoData);
      }
      toast.success('تنظیمات SEO با موفقیت به‌روزرسانی شد');
    } catch (error) {
      toast.error('خطا در به‌روزرسانی تنظیمات SEO');
    } finally {
      setSaving(false);
    }
  };

  if (seoLoading) {
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">تنظیمات SEO</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* اطلاعات اصلی */}
          <div className="space-y-6">
            <div>
              <label htmlFor="schoolName" className={labelClass}>
                نام مدرسه
              </label>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                value={formData.schoolName || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="title" className={labelClass}>
                عنوان سایت
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                توضیحات متا
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="keywords" className={labelClass}>
                کلمات کلیدی (با کاما جدا کنید)
              </label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={formData.keywords?.join(', ') || ''}
                onChange={handleKeywordsChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                required
              />
            </div>
          </div>

          {/* اطلاعات تماس و شبکه‌های اجتماعی */}
          <div className="space-y-6">
            <div>
              <label htmlFor="siteUrl" className={labelClass}>
                آدرس سایت
              </label>
              <input
                type="url"
                id="siteUrl"
                name="siteUrl"
                value={formData.siteUrl || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                required
              />
            </div>

            <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
              <label htmlFor="image" className={`${labelClass} flex items-center gap-2`}>
                <PhotoIcon className="w-5 h-5 text-gray-600" />
                تصویر پیش‌فرض
              </label>
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-emerald-500 transition-colors duration-200"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.add('border-emerald-500');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove('border-emerald-500');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove('border-emerald-500');
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) {
                    handleImageUpload(file);
                  } else {
                    toast.error('لطفاً فقط فایل تصویر آپلود کنید');
                  }
                }}
              >
                <div className="space-y-1 text-center">
                  {previewImage ? (
                    <div className="relative w-full h-48 mb-4">
                      <img
                        src={getImageUrl(previewImage)}
                        alt="تصویر پیش‌فرض"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setFormData((prev: SEOFormData) => ({ ...prev, image: '' }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="mt-4 flex text-sm text-gray-600">
                        <label
                          htmlFor="image"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                        >
                          <span>آپلود تصویر</span>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file);
                              }
                            }}
                            className="sr-only"
                          />
                        </label>
                        <p className="pr-1">یا فایل را اینجا رها کنید</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF تا 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="address" className={labelClass}>
                آدرس
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>
                شماره تماس
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                required
                placeholder="+98XXXXXXXXXX"
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                ایمیل
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                required
                placeholder="example@domain.com"
              />
            </div>

            <div>
              <label htmlFor="socialMedia.instagram" className={labelClass}>
                لینک اینستاگرام
              </label>
              <input
                type="url"
                id="socialMedia.instagram"
                name="socialMedia.instagram"
                value={formData.socialMedia?.instagram || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="https://instagram.com/username"
              />
            </div>

            <div>
              <label htmlFor="socialMedia.twitter" className={labelClass}>
                نام کاربری توییتر
              </label>
              <input
                type="text"
                id="socialMedia.twitter"
                name="socialMedia.twitter"
                value={formData.socialMedia?.twitter || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="@username"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
          </button>
        </div>
      </form>
    </div>
  );
} 
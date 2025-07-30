'use client';

import { useState, useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { SEO } from '@/types/seo';
import { toast } from 'react-hot-toast';
import { PhotoIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { getImageUrl } from '@/utils/format';

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
    telegram?: string;
    linkedin?: string;
  };
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  bingWebmasterTools?: string;
  yandexWebmaster?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultKeywords?: string[];
  ogImage?: string;
  twitterImage?: string;
  favicon?: string;
  themeColor?: string;
  backgroundColor?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  priceRange?: string;
  foundingDate?: string;
  numberOfStudents?: string;
  numberOfTeachers?: string;
  slogan?: string;
  awards?: string[];
  serviceTypes?: string[];
  curriculum?: string;
  educationalLevel?: string;
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
  } catch (error) {
    console.error('Error getting token:', error);
  }
  return config;
});

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
      twitter: '',
      telegram: '',
      linkedin: ''
    },
    googleAnalyticsId: '',
    googleTagManagerId: '',
    bingWebmasterTools: '',
    yandexWebmaster: '',
    defaultTitle: '',
    defaultDescription: '',
    defaultKeywords: [],
    ogImage: '',
    twitterImage: '',
    favicon: '',
    themeColor: '#059669',
    backgroundColor: '#f8fafc',
    latitude: 36.328956,
    longitude: 59.509741,
    openingHours: 'Mo-Fr 07:30-14:30',
    priceRange: '$$',
    foundingDate: '1390',
    numberOfStudents: '500+',
    numberOfTeachers: '30+',
    slogan: 'آموزش با کیفیت، آینده‌سازی موفق',
    awards: ['مدرسه برتر منطقه', 'مدرسه هوشمند نمونه', 'مدرسه سبز'],
    serviceTypes: ['آموزش دوره اول متوسطه', 'کلاس‌های تقویتی', 'فعالیت‌های فوق برنامه', 'مشاوره تحصیلی'],
    curriculum: 'دوره اول متوسطه',
    educationalLevel: 'دوره اول متوسطه'
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewOgImage, setPreviewOgImage] = useState<string | null>(null);
  const [previewTwitterImage, setPreviewTwitterImage] = useState<string | null>(null);
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
          twitter: data.socialMedia?.twitter || '',
          telegram: data.socialMedia?.telegram || '',
          linkedin: data.socialMedia?.linkedin || ''
        },
        googleAnalyticsId: data.googleAnalyticsId || '',
        googleTagManagerId: data.googleTagManagerId || '',
        bingWebmasterTools: data.bingWebmasterTools || '',
        yandexWebmaster: data.yandexWebmaster || '',
        defaultTitle: data.defaultTitle || '',
        defaultDescription: data.defaultDescription || '',
        defaultKeywords: data.defaultKeywords || [],
        ogImage: data.ogImage || '',
        twitterImage: data.twitterImage || '',
        favicon: data.favicon || '',
        themeColor: data.themeColor || '#059669',
        backgroundColor: data.backgroundColor || '#f8fafc',
        latitude: data.latitude || 36.328956,
        longitude: data.longitude || 59.509741,
        openingHours: data.openingHours || 'Mo-Fr 07:30-14:30',
        priceRange: data.priceRange || '$$',
        foundingDate: data.foundingDate || '1390',
        numberOfStudents: data.numberOfStudents || '500+',
        numberOfTeachers: data.numberOfTeachers || '30+',
        slogan: data.slogan || 'آموزش با کیفیت، آینده‌سازی موفق',
        awards: data.awards || ['مدرسه برتر منطقه', 'مدرسه هوشمند نمونه', 'مدرسه سبز'],
        serviceTypes: data.serviceTypes || ['آموزش دوره اول متوسطه', 'کلاس‌های تقویتی', 'فعالیت‌های فوق برنامه', 'مشاوره تحصیلی'],
        curriculum: data.curriculum || 'دوره اول متوسطه',
        educationalLevel: data.educationalLevel || 'دوره اول متوسطه'
      });
      if (data.image) setPreviewImage(data.image);
      if (data.ogImage) setPreviewOgImage(data.ogImage);
      if (data.twitterImage) setPreviewTwitterImage(data.twitterImage);
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
    } else if (name === 'latitude' || name === 'longitude') {
      setFormData((prev: SEOFormData) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev: SEOFormData) => ({ ...prev, [name]: value }));
    }
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value.split(',').map((k: string) => k.trim()).filter(Boolean);
    setFormData((prev: SEOFormData) => ({ ...prev, keywords }));
  };

  const handleDefaultKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value.split(',').map((k: string) => k.trim()).filter(Boolean);
    setFormData((prev: SEOFormData) => ({ ...prev, defaultKeywords: keywords }));
  };

  const handleAwardsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const awards = e.target.value.split(',').map((a: string) => a.trim()).filter(Boolean);
    setFormData((prev: SEOFormData) => ({ ...prev, awards }));
  };

  const handleServiceTypesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const serviceTypes = e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean);
    setFormData((prev: SEOFormData) => ({ ...prev, serviceTypes }));
  };

  const handleImageUpload = async (file: File, imageType: 'main' | 'og' | 'twitter') => {
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
        if (imageType === 'main') {
          setPreviewImage(imageUrl);
          setFormData((prev: SEOFormData) => ({ ...prev, image: response.data.url }));
        } else if (imageType === 'og') {
          setPreviewOgImage(imageUrl);
          setFormData((prev: SEOFormData) => ({ ...prev, ogImage: response.data.url }));
        } else if (imageType === 'twitter') {
          setPreviewTwitterImage(imageUrl);
          setFormData((prev: SEOFormData) => ({ ...prev, twitterImage: response.data.url }));
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('خطا در آپلود تصویر');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const seoData = {
        ...formData,
        keywords: formData.keywords.map(k => k.trim()).filter(Boolean),
        defaultKeywords: formData.defaultKeywords.map(k => k.trim()).filter(Boolean),
        awards: formData.awards.map(a => a.trim()).filter(Boolean),
        serviceTypes: formData.serviceTypes.map(s => s.trim()).filter(Boolean)
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">تنظیمات SEO</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* اطلاعات اصلی */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات اصلی</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="schoolName" className={labelClass}>
                نام مدرسه
              </label>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                value={formData.schoolName}
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
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="defaultTitle" className={labelClass}>
                عنوان پیش‌فرض
              </label>
              <input
                type="text"
                id="defaultTitle"
                name="defaultTitle"
                value={formData.defaultTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="عنوان پیش‌فرض برای صفحات"
              />
            </div>

            <div>
              <label htmlFor="siteUrl" className={labelClass}>
                آدرس سایت
              </label>
              <input
                type="url"
                id="siteUrl"
                name="siteUrl"
                value={formData.siteUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className={labelClass}>
                توضیحات متا
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="defaultDescription" className={labelClass}>
                توضیحات پیش‌فرض
              </label>
              <textarea
                id="defaultDescription"
                name="defaultDescription"
                value={formData.defaultDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="توضیحات پیش‌فرض برای صفحات"
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

            <div>
              <label htmlFor="defaultKeywords" className={labelClass}>
                کلمات کلیدی پیش‌فرض (با کاما جدا کنید)
              </label>
              <input
                type="text"
                id="defaultKeywords"
                name="defaultKeywords"
                value={formData.defaultKeywords?.join(', ') || ''}
                onChange={handleDefaultKeywordsChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="کلمات کلیدی پیش‌فرض"
              />
            </div>
          </div>
        </div>

        {/* تصاویر */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">تصاویر</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* تصویر اصلی */}
            <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <label className={`${labelClass} flex items-center gap-2`}>
                <PhotoIcon className="w-5 h-5 text-gray-600" />
                تصویر اصلی
              </label>
              <div className="mt-2">
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={getImageUrl(previewImage)}
                      alt="تصویر اصلی"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData((prev: SEOFormData) => ({ ...prev, image: '' }));
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'main');
                    }}
                    className="w-full"
                  />
                )}
              </div>
            </div>

            {/* تصویر Open Graph */}
            <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <label className={`${labelClass} flex items-center gap-2`}>
                <PhotoIcon className="w-5 h-5 text-gray-600" />
                تصویر Open Graph
              </label>
              <div className="mt-2">
                {previewOgImage ? (
                  <div className="relative">
                    <img
                      src={getImageUrl(previewOgImage)}
                      alt="تصویر Open Graph"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewOgImage(null);
                        setFormData((prev: SEOFormData) => ({ ...prev, ogImage: '' }));
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'og');
                    }}
                    className="w-full"
                  />
                )}
              </div>
            </div>

            {/* تصویر Twitter */}
            <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <label className={`${labelClass} flex items-center gap-2`}>
                <PhotoIcon className="w-5 h-5 text-gray-600" />
                تصویر Twitter
              </label>
              <div className="mt-2">
                {previewTwitterImage ? (
                  <div className="relative">
                    <img
                      src={getImageUrl(previewTwitterImage)}
                      alt="تصویر Twitter"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewTwitterImage(null);
                        setFormData((prev: SEOFormData) => ({ ...prev, twitterImage: '' }));
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'twitter');
                    }}
                    className="w-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* اطلاعات تماس و موقعیت */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات تماس و موقعیت</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="address" className={labelClass}>
                آدرس
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
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
                value={formData.phone}
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
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                required
                placeholder="example@domain.com"
              />
            </div>

            <div>
              <label htmlFor="openingHours" className={labelClass}>
                ساعات کاری
              </label>
              <input
                type="text"
                id="openingHours"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="Mo-Fr 07:30-14:30"
              />
            </div>

            <div>
              <label htmlFor="latitude" className={labelClass}>
                عرض جغرافیایی
              </label>
              <input
                type="number"
                step="any"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="36.328956"
              />
            </div>

            <div>
              <label htmlFor="longitude" className={labelClass}>
                طول جغرافیایی
              </label>
              <input
                type="number"
                step="any"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="59.509741"
              />
            </div>
          </div>
        </div>

        {/* شبکه‌های اجتماعی */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">شبکه‌های اجتماعی</h2>
          <div className="grid gap-6 md:grid-cols-2">
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

            <div>
              <label htmlFor="socialMedia.telegram" className={labelClass}>
                لینک تلگرام
              </label>
              <input
                type="url"
                id="socialMedia.telegram"
                name="socialMedia.telegram"
                value={formData.socialMedia?.telegram || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="https://t.me/username"
              />
            </div>

            <div>
              <label htmlFor="socialMedia.linkedin" className={labelClass}>
                لینک لینکدین
              </label>
              <input
                type="url"
                id="socialMedia.linkedin"
                name="socialMedia.linkedin"
                value={formData.socialMedia?.linkedin || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="https://linkedin.com/company/name"
              />
            </div>
          </div>
        </div>

        {/* اطلاعات مدرسه */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات مدرسه</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="curriculum" className={labelClass}>
                برنامه درسی
              </label>
              <input
                type="text"
                id="curriculum"
                name="curriculum"
                value={formData.curriculum}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="دوره اول متوسطه"
              />
            </div>

            <div>
              <label htmlFor="educationalLevel" className={labelClass}>
                سطح آموزشی
              </label>
              <input
                type="text"
                id="educationalLevel"
                name="educationalLevel"
                value={formData.educationalLevel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="دوره اول متوسطه"
              />
            </div>

            <div>
              <label htmlFor="foundingDate" className={labelClass}>
                سال تأسیس
              </label>
              <input
                type="text"
                id="foundingDate"
                name="foundingDate"
                value={formData.foundingDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="1390"
              />
            </div>

            <div>
              <label htmlFor="numberOfStudents" className={labelClass}>
                تعداد دانش‌آموزان
              </label>
              <input
                type="text"
                id="numberOfStudents"
                name="numberOfStudents"
                value={formData.numberOfStudents}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="500+"
              />
            </div>

            <div>
              <label htmlFor="numberOfTeachers" className={labelClass}>
                تعداد معلمان
              </label>
              <input
                type="text"
                id="numberOfTeachers"
                name="numberOfTeachers"
                value={formData.numberOfTeachers}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="30+"
              />
            </div>

            <div>
              <label htmlFor="slogan" className={labelClass}>
                شعار مدرسه
              </label>
              <input
                type="text"
                id="slogan"
                name="slogan"
                value={formData.slogan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="آموزش با کیفیت، آینده‌سازی موفق"
              />
            </div>

            <div>
              <label htmlFor="priceRange" className={labelClass}>
                محدوده قیمت
              </label>
              <input
                type="text"
                id="priceRange"
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="$$"
              />
            </div>

            <div>
              <label htmlFor="awards" className={labelClass}>
                جوایز و افتخارات (با کاما جدا کنید)
              </label>
              <input
                type="text"
                id="awards"
                name="awards"
                value={formData.awards?.join(', ') || ''}
                onChange={handleAwardsChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="مدرسه برتر منطقه, مدرسه هوشمند نمونه"
              />
            </div>

            <div>
              <label htmlFor="serviceTypes" className={labelClass}>
                انواع خدمات (با کاما جدا کنید)
              </label>
              <input
                type="text"
                id="serviceTypes"
                name="serviceTypes"
                value={formData.serviceTypes?.join(', ') || ''}
                onChange={handleServiceTypesChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="آموزش دوره اول متوسطه, کلاس‌های تقویتی"
              />
            </div>
          </div>
        </div>

        {/* تنظیمات فنی */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">تنظیمات فنی</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="googleAnalyticsId" className={labelClass}>
                شناسه Google Analytics
              </label>
              <input
                type="text"
                id="googleAnalyticsId"
                name="googleAnalyticsId"
                value={formData.googleAnalyticsId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="G-XXXXXXXXXX"
              />
            </div>

            <div>
              <label htmlFor="googleTagManagerId" className={labelClass}>
                شناسه Google Tag Manager
              </label>
              <input
                type="text"
                id="googleTagManagerId"
                name="googleTagManagerId"
                value={formData.googleTagManagerId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="GTM-XXXXXXX"
              />
            </div>

            <div>
              <label htmlFor="bingWebmasterTools" className={labelClass}>
                شناسه Bing Webmaster Tools
              </label>
              <input
                type="text"
                id="bingWebmasterTools"
                name="bingWebmasterTools"
                value={formData.bingWebmasterTools}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="XXXXXXXXXX"
              />
            </div>

            <div>
              <label htmlFor="yandexWebmaster" className={labelClass}>
                شناسه Yandex Webmaster
              </label>
              <input
                type="text"
                id="yandexWebmaster"
                name="yandexWebmaster"
                value={formData.yandexWebmaster}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="XXXXXXXXXX"
              />
            </div>

            <div>
              <label htmlFor="themeColor" className={labelClass}>
                رنگ تماس
              </label>
              <input
                type="color"
                id="themeColor"
                name="themeColor"
                value={formData.themeColor}
                onChange={handleChange}
                className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="backgroundColor" className={labelClass}>
                رنگ پس‌زمینه
              </label>
              <input
                type="color"
                id="backgroundColor"
                name="backgroundColor"
                value={formData.backgroundColor}
                onChange={handleChange}
                className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="favicon" className={labelClass}>
                آدرس Favicon
              </label>
              <input
                type="url"
                id="favicon"
                name="favicon"
                value={formData.favicon}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="https://example.com/favicon.ico"
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
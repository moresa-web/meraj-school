import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../../../constants';
import LoadingState from '../../../../../components/LoadingState';
import toast from 'react-hot-toast';

const BASE_URL = API_URL.replace('/api', '');

interface SiteInfo {
  title: string;
  description: string;
  keywords: string;
  image: string;
  siteUrl: string;
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    instagram: string;
    twitter: string;
  };
}

const SEO: React.FC = () => {
  const [formData, setFormData] = useState<SiteInfo>({
    title: '',
    description: '',
    keywords: '',
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSiteInfo();
  }, []);

  const fetchSiteInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/seo`);
      if (!response.ok) throw new Error('خطا در دریافت اطلاعات سایت');
      const data = await response.json();
      setFormData({
        ...data,
        socialMedia: {
          instagram: data.socialMedia?.instagram || '',
          twitter: data.socialMedia?.twitter || ''
        }
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات سایت');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('socialMedia.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [key]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const oldImage = formData.image;
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('توکن احراز هویت یافت نشد');
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadFormData
      });
      if (!response.ok) throw new Error('خطا در آپلود تصویر');
      const data = await response.json();
      const imageUrl = `${BASE_URL}${data.url}`;
      setFormData(prev => ({ ...prev, image: imageUrl }));
    } catch (error) {
      toast.error('خطا در آپلود تصویر');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/seo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('خطا در بروزرسانی اطلاعات سایت');
      toast.success('تغییرات با موفقیت اعمال شد!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بروزرسانی اطلاعات سایت');
      toast.error('خطا در بروزرسانی اطلاعات سایت');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="seo-settings">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت اطلاعات پایه سایت</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">عنوان سایت</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">کلمات کلیدی</label>
          <input type="text" name="keywords" value={formData.keywords} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">آدرس سایت</label>
          <input type="url" name="siteUrl" value={formData.siteUrl} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">نام مدرسه</label>
          <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">آدرس</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">اینستاگرام</label>
          <input type="text" name="socialMedia.instagram" value={formData.socialMedia.instagram} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">توییتر</label>
          <input type="text" name="socialMedia.twitter" value={formData.socialMedia.twitter} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">لوگو/تصویر سایت</label>
          <div className="image-upload">
            <input
              id="image"
              type="file"
              name="image"
              onChange={handleImageUpload}
              accept="image/*"
              className="image-upload-input"
            />
            <span className="image-upload-text">
              {formData.image ? 'تصویر انتخاب شده' : 'برای آپلود تصویر کلیک کنید'}
            </span>
          </div>
          {formData.image && (
            <div className="mt-2">
              <img
                src={formData.image}
                alt="لوگو"
                className="table-image"
                style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '200px' }}
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
          {isUploading && <span className="text-xs text-gray-500">در حال آپلود...</span>}
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="px-4 py-2 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50">
            {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SEO; 
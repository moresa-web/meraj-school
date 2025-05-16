import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../../constants';
import { News, NewsFormData } from '../types';
import slugify from 'slugify';

// ایجاد یک نمونه axios با اینترسپتور برای افزودن توکن
const api = axios.create({
  baseURL: API_URL,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/news', {
        params: {
          showAll: 'true' // برای داشبورد ادمین، همه اخبار (منتشر شده و منتشر نشده) را نمایش می‌دهیم
        }
      });
      console.log('Fetched news:', response.data); // برای دیباگ
      setNews(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در دریافت اخبار');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const addNews = async (formData: NewsFormData) => {
    try {
      setSaving(true);
      const formDataToSend = new FormData();
      
      // اضافه کردن slug به فرم
      const slug = formData.slug || slugify(formData.title, {
        lower: true,
        strict: true,
        locale: 'fa'
      });
      formDataToSend.append('slug', slug);
      
      // اضافه کردن سایر فیلدها
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags') {
          // Ensure tags array is properly encoded for Arabic text
          try {
            const tagsStr = JSON.stringify(value);
            formDataToSend.append(key, tagsStr);
          } catch (err) {
            console.error('Error stringifying tags:', err);
            // Fallback to empty array if JSON stringify fails
            formDataToSend.append(key, '[]');
          }
        } else if (key === 'image' && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });
      
      const response = await api.post('/api/news', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setNews(prev => [...prev, response.data]);
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در افزودن خبر');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateNews = async (id: string, formData: NewsFormData) => {
    try {
      setSaving(true);
      const formDataToSend = new FormData();
      
      // اضافه کردن slug به فرم
      const slug = formData.slug || slugify(formData.title, {
        lower: true,
        strict: true,
        locale: 'fa'
      });
      formDataToSend.append('slug', slug);
      
      // اضافه کردن سایر فیلدها
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags') {
          // Ensure tags array is properly encoded for Arabic text
          try {
            const tagsStr = JSON.stringify(value);
            formDataToSend.append(key, tagsStr);
          } catch (err) {
            console.error('Error stringifying tags:', err);
            // Fallback to empty array if JSON stringify fails
            formDataToSend.append(key, '[]');
          }
        } else if (key === 'image' && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });
      
      const newsItem = news.find(item => item._id === id);
      if (!newsItem) {
        throw new Error('News not found');
      }
      
      const response = await api.put(`/api/news/${newsItem.slug}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setNews(prev => prev.map(item => item._id === id ? response.data : item));
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در بروزرسانی خبر');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteNews = async (id: string) => {
    try {
      const newsItem = news.find(item => item._id === id);
      if (!newsItem) {
        throw new Error('خبر پیدا نشد');
      }
      await api.delete(`/api/news/${newsItem.slug}`);
      setNews(prev => prev.filter(item => item._id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در حذف خبر');
    }
  };

  return {
    news,
    loading,
    error,
    saving,
    addNews,
    updateNews,
    deleteNews,
    refreshNews: fetchNews
  };
}; 
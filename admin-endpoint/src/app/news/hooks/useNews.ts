import { useState, useEffect } from 'react';
import axios from 'axios';
import { News, NewsFormData } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});
api.interceptors.request.use((config: any) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
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
        params: { showAll: 'true' }
      });
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
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags') {
          try {
            const tagsStr = JSON.stringify(value);
            formDataToSend.append(key, tagsStr);
          } catch {
            formDataToSend.append(key, '[]');
          }
        } else if (key === 'image' && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });
      const response = await api.post('/api/news', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags') {
          try {
            const tagsStr = JSON.stringify(value);
            formDataToSend.append(key, tagsStr);
          } catch {
            formDataToSend.append(key, '[]');
          }
        } else if (key === 'image' && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });
      const newsItem = news.find(item => item._id === id);
      if (!newsItem) throw new Error('News not found');
      const response = await api.put(`/api/news/${newsItem.slug}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
      if (!newsItem) throw new Error('خبر پیدا نشد');
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
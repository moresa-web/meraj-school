import { useState, useEffect } from 'react';
import { News, NewsFormData } from '../types';
import { API_URL } from '../constants';

export const useNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/news`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'خطا در دریافت اخبار');
      }
      const data = await response.json();
      setNews(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
    } finally {
      setLoading(false);
    }
  };

  const addNews = async (formData: NewsFormData): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);
      
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'tags') {
            data.append(key, JSON.stringify(value));
          } else if (key === 'isPublished') {
            data.append(key, String(value));
          } else if (key === 'image' && value instanceof File) {
            data.append(key, value);
          } else if (key !== 'image') {
            data.append(key, value);
          }
        }
      });

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('توکن احراز هویت یافت نشد');
      }

      const response = await fetch(`${API_URL}/news`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'خطا در افزودن خبر');
      }

      await fetchNews();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateNews = async (id: string, formData: NewsFormData): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);
      
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'tags') {
            data.append(key, JSON.stringify(value));
          } else if (key === 'isPublished') {
            data.append(key, String(value));
          } else if (key === 'image' && value instanceof File) {
            data.append(key, value);
          } else if (key !== 'image') {
            data.append(key, value);
          }
        }
      });

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('توکن احراز هویت یافت نشد');
      }

      const response = await fetch(`${API_URL}/news/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'خطا در بروزرسانی خبر');
      }

      await fetchNews();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteNews = async (id: string): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('توکن احراز هویت یافت نشد');
      }

      const response = await fetch(`${API_URL}/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'خطا در حذف خبر');
      }

      setNews(prevNews => prevNews.filter(item => item._id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    error,
    saving,
    addNews,
    updateNews,
    deleteNews
  };
}; 
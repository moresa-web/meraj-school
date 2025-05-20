'use client';

import { useState, useCallback } from 'react';
import { News, NewsFormData } from '@/types/news';
import axios from 'axios';

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

export const useNews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/news');
      console.log('News response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching news:', err);
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          headers: err.response?.headers,
        });
      }
      setError('خطا در دریافت اخبار');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNews = useCallback(async (data: NewsFormData) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'tags' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      console.log('FormData contents:', Object.fromEntries(formData));

      const response = await axios.post('/api/news', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Create news response:', response);
      return response.data;
    } catch (err) {
      console.error('Error creating news:', err);
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          headers: err.response?.headers,
        });
      }
      setError('خطا در ایجاد خبر');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNews = useCallback(async (id: string, data: NewsFormData) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      
      // اضافه کردن فیلدها به FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'tags' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (key === 'image' && value instanceof File) {
            formData.append(key, value);
          } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            formData.append(key, String(value));
          }
        }
      });

      console.log('FormData contents:', Object.fromEntries(formData));

      const response = await axios.put(`/api/news/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // اگر پاسخ موفقیت‌آمیز بود، حتی اگر success: false بود، باز هم داده‌ها را برگردان
      console.log('Update news response:', response.data);
      return response.data;
      
    } catch (err) {
      console.error('Error updating news:', err);
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          headers: err.response?.headers,
        });
        const errorMessage = err.response?.data?.message || 'خطا در به‌روزرسانی خبر';
        setError(errorMessage);
        throw new Error(errorMessage);
      } else {
        const errorMessage = 'خطا در به‌روزرسانی خبر';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNews = useCallback(async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Deleting news with slug:', slug);
      const response = await axios.delete(`/api/news/${slug}`);
      console.log('Delete news response:', response);
      return response.data;
    } catch (err) {
      console.error('Error deleting news:', err);
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          headers: err.response?.headers,
        });
      }
      setError('خطا در حذف خبر');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchNews,
    createNews,
    updateNews,
    deleteNews,
  };
}; 
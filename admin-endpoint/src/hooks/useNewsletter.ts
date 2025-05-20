import { useState, useEffect } from 'react';
import axios from 'axios';
import { Newsletter } from '@/types/newsletter';

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

export function useNewsletter() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/newsletter');
      console.log('Newsletters response:', response.data);
      if (response.data.success) {
        setNewsletters(response.data.data);
      } else {
        setError(response.data.message || 'خطا در دریافت اطلاعات خبرنامه‌ها');
      }
    } catch (err) {
      console.error('Error fetching newsletters:', err);
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          headers: err.response?.headers,
        });
        if (err.response?.status === 401) {
          setError('لطفا ابتدا وارد سیستم شوید');
        } else if (err.response?.status === 404) {
          setError('API خبرنامه‌ها در دسترس نیست. لطفاً از اجرای سرور اطمینان حاصل کنید.');
        } else {
          setError('خطا در دریافت اطلاعات خبرنامه‌ها');
        }
      } else {
        setError('خطای ناشناخته در دریافت اطلاعات خبرنامه‌ها');
      }
    } finally {
      setLoading(false);
    }
  };

  const createNewsletter = async (newsletterData: Omit<Newsletter, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const response = await axios.post('/api/newsletter', newsletterData);
      console.log('Create newsletter response:', response.data);
      if (response.data.success) {
        setNewsletters(prev => [...prev, response.data.data]);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'خطا در ایجاد خبرنامه جدید');
      }
    } catch (err) {
      console.error('Error creating newsletter:', err);
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          headers: err.response?.headers,
        });
        if (err.response?.status === 401) {
          setError('لطفا ابتدا وارد سیستم شوید');
        } else if (err.response?.status === 404) {
          setError('API خبرنامه‌ها در دسترس نیست. لطفاً از اجرای سرور اطمینان حاصل کنید.');
        } else {
          setError('خطا در ایجاد خبرنامه جدید');
        }
      } else {
        setError('خطای ناشناخته در ایجاد خبرنامه');
      }
      throw err;
    }
  };

  const updateNewsletter = async (id: string, newsletterData: Partial<Newsletter>) => {
    try {
      setError(null);
      const response = await axios.put(`/api/newsletter/${id}`, newsletterData);
      console.log('Update newsletter response:', response.data);
      if (response.data.success) {
        setNewsletters(prev => prev.map(n => n._id === id ? response.data.data : n));
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'خطا در به‌روزرسانی خبرنامه');
      }
    } catch (err) {
      console.error('Error updating newsletter:', err);
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          headers: err.response?.headers,
        });
        if (err.response?.status === 401) {
          setError('لطفا ابتدا وارد سیستم شوید');
        } else if (err.response?.status === 404) {
          setError('API خبرنامه‌ها در دسترس نیست. لطفاً از اجرای سرور اطمینان حاصل کنید.');
        } else {
          setError('خطا در به‌روزرسانی خبرنامه');
        }
      } else {
        setError('خطای ناشناخته در به‌روزرسانی خبرنامه');
      }
      throw err;
    }
  };

  const deleteNewsletter = async (id: string) => {
    try {
      setError(null);
      const response = await axios.delete(`/api/newsletter/${id}`);
      console.log('Delete newsletter response:', response.data);
      if (response.data.success) {
        setNewsletters(prev => prev.filter(n => n._id !== id));
      } else {
        throw new Error(response.data.message || 'خطا در حذف خبرنامه');
      }
    } catch (err) {
      console.error('Error deleting newsletter:', err);
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          headers: err.response?.headers,
        });
        if (err.response?.status === 401) {
          setError('لطفا ابتدا وارد سیستم شوید');
        } else if (err.response?.status === 404) {
          setError('API خبرنامه‌ها در دسترس نیست. لطفاً از اجرای سرور اطمینان حاصل کنید.');
        } else {
          setError('خطا در حذف خبرنامه');
        }
      } else {
        setError('خطای ناشناخته در حذف خبرنامه');
      }
      throw err;
    }
  };

  const sendNewsletter = async (id: string) => {
    try {
      setError(null);
      const response = await axios.post(`/api/newsletter/${id}/send`);
      console.log('Send newsletter response:', response.data);
      if (response.data.success) {
        setNewsletters(prev => prev.map(n => 
          n._id === id ? { ...n, sent: true, sentAt: new Date().toISOString() } : n
        ));
      } else {
        throw new Error(response.data.message || 'خطا در ارسال خبرنامه');
      }
    } catch (err) {
      console.error('Error sending newsletter:', err);
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          headers: err.response?.headers,
        });
        if (err.response?.status === 401) {
          setError('لطفا ابتدا وارد سیستم شوید');
        } else if (err.response?.status === 404) {
          setError('API خبرنامه‌ها در دسترس نیست. لطفاً از اجرای سرور اطمینان حاصل کنید.');
        } else {
          setError('خطا در ارسال خبرنامه');
        }
      } else {
        setError('خطای ناشناخته در ارسال خبرنامه');
      }
      throw err;
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  return {
    newsletters,
    loading,
    error,
    fetchNewsletters,
    createNewsletter,
    updateNewsletter,
    deleteNewsletter,
    sendNewsletter
  };
} 
import { useState, useEffect } from 'react';
import { SEO } from '@/types/seo';
import api from '@/services/api';

export const useSEO = () => {
  const [seoList, setSEOList] = useState<SEO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSEOList = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/seo');
      console.log('SEO Response:', response.data);
      const seoData = response.data;
      setSEOList(Array.isArray(seoData) ? seoData : [seoData]);
      setError(null);
    } catch (err) {
      setError('خطا در دریافت اطلاعات تنظیمات SEO');
      console.error('Error fetching SEO settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSEO = async (seoData: Omit<SEO, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.post('/api/seo', seoData);
      setSEOList(prevList => [...prevList, response.data]);
      return response.data;
    } catch (err) {
      setError('خطا در ایجاد تنظیمات SEO');
      console.error('Error creating SEO settings:', err);
      throw err;
    }
  };

  const updateSEO = async (id: string, seoData: Partial<SEO>) => {
    try {
      const response = await api.put('/api/seo', { ...seoData, _id: id });
      setSEOList(prevList => prevList.map(s => s._id === id ? response.data : s));
      return response.data;
    } catch (err) {
      setError('خطا در بروزرسانی تنظیمات SEO');
      console.error('Error updating SEO settings:', err);
      throw err;
    }
  };

  const deleteSEO = async (id: string) => {
    try {
      await api.delete(`/api/seo/${id}`);
      setSEOList(prevList => prevList.filter(s => s._id !== id));
    } catch (err) {
      setError('خطا در حذف تنظیمات SEO');
      console.error('Error deleting SEO settings:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSEOList();
  }, []);

  return {
    seoList,
    loading,
    error,
    fetchSEOList,
    createSEO,
    updateSEO,
    deleteSEO,
  };
}; 
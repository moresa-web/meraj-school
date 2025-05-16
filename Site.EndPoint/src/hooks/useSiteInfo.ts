import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

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

export const useSiteInfo = () => {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchSiteInfo();
  }, []);

  const fetchSiteInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/seo`);
      if (!response.ok) {
        throw new Error('خطا در دریافت اطلاعات سایت');
      }
      const data = await response.json();
      setSiteInfo(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات سایت');
      toast.error('خطا در دریافت اطلاعات سایت');
    } finally {
      setLoading(false);
    }
  };

  const updateSiteInfo = async (data: SiteInfo) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('توکن احراز هویت یافت نشد');
      }

      console.log('Sending to server:', data);

      const response = await fetch(`${API_URL}/seo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'خطا در بروزرسانی اطلاعات سایت');
      }

      const updatedData = await response.json();
      console.log('Received from server:', updatedData);

      if (!updatedData) {
        throw new Error('داده‌ای از سرور دریافت نشد');
      }

      setSiteInfo(updatedData);
      setError(null);
      return updatedData;
    } catch (err) {
      console.error('Error in updateSiteInfo:', err);
      const errorMessage = err instanceof Error ? err.message : 'خطا در بروزرسانی اطلاعات سایت';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    siteInfo,
    loading,
    error,
    updateSiteInfo,
    fetchSiteInfo
  };
}; 
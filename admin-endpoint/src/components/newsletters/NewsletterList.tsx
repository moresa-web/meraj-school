'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNewsletter } from '@/hooks/useNewsletter';
import { Newsletter } from '@/types/newsletter';
import { PencilIcon, TrashIcon, PaperAirplaneIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'sonner';

interface Subscriber {
  _id: string;
  email: string;
  active: boolean;
  subscribedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function NewsletterList() {
  const { newsletters, loading, error, deleteNewsletter, sendNewsletter } = useNewsletter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [subscribersError, setSubscribersError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    try {
      setLoadingSubscribers(true);
      setSubscribersError(null);
      const response = await axios.get('/api/newsletter/subscribers?all=true');
      console.log('Subscribers response:', response.data);
      if (response.data.success) {
        setSubscribers(response.data.data);
      } else {
        setSubscribersError(response.data.message || 'خطا در دریافت لیست مشترکین');
      }
    } catch (error: any) {
      console.error('Error fetching subscribers:', error);
      setSubscribersError(error.response?.data?.message || 'خطا در دریافت لیست مشترکین');
    } finally {
      setLoadingSubscribers(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'نامشخص';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'نامشخص';
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این خبرنامه اطمینان دارید؟')) {
      try {
        setDeletingId(id);
        await deleteNewsletter(id);
      } catch (error) {
        console.error('Error deleting newsletter:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (window.confirm('آیا از حذف این مشترک اطمینان دارید؟')) {
      try {
        setDeletingId(id);
        const response = await axios.delete(`/api/newsletter/subscribers/${id}`);
        if (response.data.success) {
          setSubscribers(prev => prev.filter(sub => sub._id !== id));
          toast.success('مشترک با موفقیت حذف شد');
        } else {
          toast.error(response.data.message || 'خطا در حذف مشترک');
        }
      } catch (error: any) {
        console.error('Error deleting subscriber:', error);
        toast.error(error.response?.data?.message || 'خطا در حذف مشترک');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSend = async (id: string) => {
    if (window.confirm('آیا از ارسال این خبرنامه اطمینان دارید؟')) {
      try {
        setSendingId(id);
        await sendNewsletter(id);
      } catch (error) {
        console.error('Error sending newsletter:', error);
      } finally {
        setSendingId(null);
      }
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      toast.error('ایمیل را وارد کنید');
      return;
    }
    setAdding(true);
    try {
      const response = await axios.post('/api/newsletter/subscribe', {
        email: newEmail.trim(),
      });
      if (response.data.success) {
        await fetchSubscribers();
        setNewEmail('');
        toast.success('مشترک جدید با موفقیت اضافه شد');
      } else {
        toast.error(response.data.message || 'خطا در افزودن مشترک');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در افزودن مشترک');
    } finally {
      setAdding(false);
    }
  };

  const handleActivateSubscriber = async (id: string) => {
    if (window.confirm('آیا از فعال کردن این مشترک اطمینان دارید؟')) {
      try {
        setDeactivatingId(id);
        const response = await axios.patch(`/api/newsletter/subscribers/${id}/activate`);
        if (response.data.success) {
          await fetchSubscribers();
          toast.success('مشترک با موفقیت فعال شد');
        } else {
          toast.error(response.data.message || 'خطا در فعال‌سازی مشترک');
        }
      } catch (error: any) {
        console.error('Error activating subscriber:', error);
        toast.error(error.response?.data?.message || 'خطا در فعال‌سازی مشترک');
      } finally {
        setDeactivatingId(null);
      }
    }
  };

  const handleDeactivateSubscriber = async (id: string) => {
    if (window.confirm('آیا از غیرفعال کردن این مشترک اطمینان دارید؟')) {
      try {
        setDeactivatingId(id);
        const response = await axios.patch(`/api/newsletter/subscribers/${id}/deactivate`);
        if (response.data.success) {
          setSubscribers(prev => prev.filter(sub => sub._id !== id));
          toast.success('مشترک با موفقیت غیرفعال شد');
        } else {
          toast.error(response.data.message || 'خطا در غیرفعال‌سازی مشترک');
        }
      } catch (error: any) {
        console.error('Error deactivating subscriber:', error);
        toast.error(error.response?.data?.message || 'خطا در غیرفعال‌سازی مشترک');
      } finally {
        setDeactivatingId(null);
      }
    }
  };

  if (loading) {
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">خبرنامه‌ها</h1>
      </div>

      {/* بخش مشترکین */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">مشترکین خبرنامه</h2>
        {/* فرم افزودن مشترک */}
        <form onSubmit={handleAddSubscriber} className="flex gap-2 mb-6">
          <input
            type="email"
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="ایمیل مشترک جدید..."
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            disabled={adding}
            required
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors disabled:opacity-50"
            disabled={adding}
          >
            {adding ? 'در حال افزودن...' : 'افزودن'}
          </button>
        </form>
        {loadingSubscribers ? (
          <div className="flex justify-center items-center min-h-[100px]">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
          </div>
        ) : subscribersError ? (
          <div className="text-red-600 text-center p-4">{subscribersError}</div>
        ) : subscribers.length === 0 ? (
          <p className="text-gray-500 text-center">هیچ مشترکی یافت نشد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ایمیل</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ عضویت</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subscriber.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscriber.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.active ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(subscriber.subscribedAt || subscriber.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDeleteSubscriber(subscriber._id)}
                        disabled={deletingId === subscriber._id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 ml-2"
                        title="حذف"
                      >
                        {deletingId === subscriber._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <TrashIcon className="h-5 w-5" />
                        )}
                      </button>
                      {subscriber.active ? (
                        <button
                          onClick={() => handleDeactivateSubscriber(subscriber._id)}
                          disabled={deactivatingId === subscriber._id}
                          className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 ml-2"
                          title="غیرفعال‌سازی"
                        >
                          {deactivatingId === subscriber._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                          ) : (
                            <XCircleIcon className="h-5 w-5" />
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivateSubscriber(subscriber._id)}
                          disabled={deactivatingId === subscriber._id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50 ml-2"
                          title="فعال‌سازی"
                        >
                          {deactivatingId === subscriber._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <CheckCircleIcon className="h-5 w-5" />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../../../services/api';
import { Download } from 'lucide-react';

interface ISubscriber {
  _id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const NewsletterSubscribers: React.FC = () => {
  const { t } = useTranslation();
  const [subscribers, setSubscribers] = useState<ISubscriber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/newsletter/subscribers');
        setSubscribers(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching subscribers:', err);
        setError(t('dashboard.newsletter.fetchError'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscribers();
  }, [t]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleExportCSV = () => {
    // ساخت متن CSV
    const csvContent = [
      // هدرها
      'ایمیل,تاریخ عضویت,وضعیت',
      // داده‌ها
      ...subscribers.map(sub => 
        `${sub.email},${new Date(sub.subscribedAt).toLocaleDateString('fa-IR')},${sub.active ? 'فعال' : 'غیرفعال'}`
      )
    ].join('\n');
    
    // ایجاد یک بلاب برای دانلود
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // ایجاد لینک دانلود و کلیک روی آن
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('dashboard.newsletter.subscribers')}</h2>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <Download size={16} />
          {t('dashboard.newsletter.exportCSV')}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('dashboard.newsletter.email')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('dashboard.newsletter.date')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('dashboard.newsletter.status')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  {t('dashboard.newsletter.noSubscribers')}
                </td>
              </tr>
            ) : (
              subscribers.map((subscriber) => (
                <tr key={subscriber._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(subscriber.subscribedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      subscriber.active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {subscriber.active ? t('dashboard.newsletter.active') : t('dashboard.newsletter.inactive')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsletterSubscribers; 
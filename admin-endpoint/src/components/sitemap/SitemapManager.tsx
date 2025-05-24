'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface SitemapStatus {
    type: string;
    lastUpdated: string;
    urlCount: number;
    size: number;
}

const SitemapManager = () => {
    const [status, setStatus] = useState<SitemapStatus[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStatus = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/sitemap/status');
            setStatus(response.data);
        } catch (error) {
            toast.error('خطا در دریافت وضعیت sitemap');
            console.error('Error fetching sitemap status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            await axios.post('/api/sitemap/refresh');
            toast.success('Sitemap با موفقیت به‌روزرسانی شد');
            await fetchStatus();
        } catch (error) {
            toast.error('خطا در به‌روزرسانی sitemap');
            console.error('Error refreshing sitemap:', error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('fa-IR');
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
                <h5 className="text-lg font-semibold">مدیریت Sitemap</h5>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="bg-white text-primary px-4 py-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {refreshing ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            در حال به‌روزرسانی...
                        </>
                    ) : (
                        'به‌روزرسانی Sitemap'
                    )}
                </button>
            </div>
            <div className="p-4">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">آخرین به‌روزرسانی</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تعداد URL</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حجم</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {status.map((item) => (
                                    <tr key={item.type}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.type === 'main' ? 'اصلی' : 'اخبار'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(item.lastUpdated)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.urlCount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatSize(item.size)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <a
                                                href={`/sitemap/${item.type === 'main' ? '' : 'news.xml'}`}
                                                target="_blank"
                                                className="text-primary hover:text-primary-dark"
                                            >
                                                مشاهده
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h6 className="text-blue-800 font-semibold mb-2">راهنمای Sitemap</h6>
                    <ul className="text-blue-700 space-y-1">
                        <li>Sitemap اصلی شامل صفحات ثابت سایت است</li>
                        <li>Sitemap اخبار شامل تمام اخبار منتشر شده است</li>
                        <li>به‌روزرسانی خودکار هر 24 ساعت انجام می‌شود</li>
                        <li>می‌توانید به صورت دستی نیز sitemap را به‌روزرسانی کنید</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SitemapManager; 
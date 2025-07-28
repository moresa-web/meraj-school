'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { format } from 'date-fns-jalali';

interface SitemapStatus {
    main: {
        urlCount: number;
        fileSize: number;
        lastUpdated: string;
        type: string;
    };
    news: {
        urlCount: number;
        fileSize: number;
        lastUpdated: string;
        type: string;
    };
    classes: {
        urlCount: number;
        fileSize: number;
        lastUpdated: string;
        type: string;
    };
    index: {
        urlCount: number;
        fileSize: number;
        lastUpdated: string;
        type: string;
    };
}

interface SitemapUrl {
    url: string;
    changefreq: string;
    priority: number;
    lastmod?: string;
}

export default function SitemapPage() {
    const [status, setStatus] = useState<SitemapStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [mainUrls, setMainUrls] = useState<SitemapUrl[]>([]);
    const [editingUrl, setEditingUrl] = useState<SitemapUrl | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const fetchStatus = async () => {
        try {
            console.log('Fetching sitemap status...');
            const response = await axios.get(`${API_URL}/api/sitemap/status`);
            console.log('Status response:', response.data);
            setStatus(response.data);
        } catch (error) {
            console.error('Error fetching status:', error);
            toast.error('خطا در دریافت وضعیت sitemap');
        }
    };

    const fetchMainUrls = async () => {
        try {
            console.log('Fetching main URLs...');
            const response = await axios.get(`${API_URL}/api/sitemap/main-urls`);
            console.log('Main URLs response:', response.data);
            setMainUrls(response.data.urls || []);
        } catch (error) {
            console.error('Error fetching main URLs:', error);
            toast.error('خطا در دریافت لینک‌های sitemap اصلی');
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/sitemap/refresh/main`);
            await fetchStatus();
            await fetchMainUrls();
            toast.success('Sitemap با موفقیت به‌روزرسانی شد');
        } catch (error) {
            console.error('Error refreshing sitemap:', error);
            toast.error('خطا در به‌روزرسانی sitemap');
        } finally {
            setLoading(false);
        }
    };

    const handleEditUrl = (url: SitemapUrl) => {
        setEditingUrl(url);
    };

    const handleSaveUrl = async () => {
        if (!editingUrl) return;

        try {
            await axios.put(`${API_URL}/api/sitemap/main-urls`, editingUrl);
            await fetchMainUrls();
            setEditingUrl(null);
            toast.success('لینک با موفقیت به‌روزرسانی شد');
        } catch (error) {
            console.error('Error updating URL:', error);
            toast.error('خطا در به‌روزرسانی لینک');
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'نامشخص';
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy ساعت HH:mm');
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    useEffect(() => {
        fetchStatus();
        fetchMainUrls();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">مدیریت Sitemap</h1>
                    <p className="text-gray-600 mt-2">مدیریت و به‌روزرسانی فایل‌های sitemap سایت</p>
                </div>
                <Button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-lg"
                >
                    {loading ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی Sitemap'}
                </Button>
            </div>

            {/* وضعیت Sitemap‌ها */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="bg-blue-50 border-b">
                        <CardTitle className="text-blue-900">Sitemap اصلی</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {status?.main ? (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">تعداد URL:</span>
                                    <span className="font-semibold">{status.main.urlCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">حجم فایل:</span>
                                    <span className="font-semibold">{formatFileSize(status.main.fileSize)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">آخرین به‌روزرسانی:</span>
                                    <span className="font-semibold text-sm">{formatDate(status.main.lastUpdated)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="bg-green-50 border-b">
                        <CardTitle className="text-green-900">Sitemap اخبار</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {status?.news ? (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">تعداد URL:</span>
                                    <span className="font-semibold">{status.news.urlCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">حجم فایل:</span>
                                    <span className="font-semibold">{formatFileSize(status.news.fileSize)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">آخرین به‌روزرسانی:</span>
                                    <span className="font-semibold text-sm">{formatDate(status.news.lastUpdated)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="bg-purple-50 border-b">
                        <CardTitle className="text-purple-900">Sitemap کلاس‌ها</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {status?.classes ? (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">تعداد URL:</span>
                                    <span className="font-semibold">{status.classes.urlCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">حجم فایل:</span>
                                    <span className="font-semibold">{formatFileSize(status.classes.fileSize)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">آخرین به‌روزرسانی:</span>
                                    <span className="font-semibold text-sm">{formatDate(status.classes.lastUpdated)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-gray-900">مدیریت لینک‌های Sitemap اصلی</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-6">
                        {mainUrls.map((url, index) => (
                            <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
                                {editingUrl?.url === url.url ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                آدرس
                                            </label>
                                            <input
                                                type="text"
                                                value={editingUrl.url}
                                                onChange={(e) => setEditingUrl({ ...editingUrl, url: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                تغییرات
                                            </label>
                                            <select
                                                value={editingUrl.changefreq}
                                                onChange={(e) => setEditingUrl({ ...editingUrl, changefreq: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            >
                                                <option value="always">همیشه</option>
                                                <option value="hourly">ساعتی</option>
                                                <option value="daily">روزانه</option>
                                                <option value="weekly">هفتگی</option>
                                                <option value="monthly">ماهانه</option>
                                                <option value="yearly">سالانه</option>
                                                <option value="never">هرگز</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                اولویت
                                            </label>
                                            <select
                                                value={editingUrl.priority.toString()}
                                                onChange={(e) => setEditingUrl({ ...editingUrl, priority: parseFloat(e.target.value) })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            >
                                                <option value="1.0">1.0 - بالاترین</option>
                                                <option value="0.9">0.9</option>
                                                <option value="0.8">0.8</option>
                                                <option value="0.7">0.7</option>
                                                <option value="0.6">0.6</option>
                                                <option value="0.5">0.5</option>
                                                <option value="0.4">0.4</option>
                                                <option value="0.3">0.3</option>
                                                <option value="0.2">0.2</option>
                                                <option value="0.1">0.1 - پایین‌ترین</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button 
                                                onClick={handleSaveUrl} 
                                                className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2"
                                            >
                                                ذخیره
                                            </Button>
                                            <Button 
                                                onClick={() => setEditingUrl(null)} 
                                                variant="outline"
                                                className="px-6 py-2"
                                            >
                                                انصراف
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-4 space-x-reverse">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900">{url.url}</h3>
                                                    <div className="flex items-center space-x-4 space-x-reverse mt-2 text-sm text-gray-500">
                                                        <span>تغییر: {url.changefreq}</span>
                                                        <span>اولویت: {url.priority}</span>
                                                        {url.lastmod && <span>آخرین تغییر: {formatDate(url.lastmod)}</span>}
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => handleEditUrl(url)}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    ویرایش
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 
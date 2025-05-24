'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { format } from 'date-fns-jalali';

interface SitemapStatus {
    mainSitemap: {
        urlCount: number;
        fileSize: string;
        lastUpdated: string;
    };
    newsSitemap: {
        urlCount: number;
        fileSize: string;
        lastUpdated: string;
    };
    classesSitemap: {
        urlCount: number;
        fileSize: string;
        lastUpdated: string;
    };
}

interface SitemapUrl {
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: number;
}

export default function SitemapPage() {
    const [status, setStatus] = useState<SitemapStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [mainUrls, setMainUrls] = useState<SitemapUrl[]>([]);
    const [editingUrl, setEditingUrl] = useState<SitemapUrl | null>(null);

    const fetchStatus = async () => {
        try {
            const response = await axios.get('/api/sitemap/status');
            setStatus(response.data);
        } catch (error) {
            toast.error('خطا در دریافت وضعیت sitemap');
        }
    };

    const fetchMainUrls = async () => {
        try {
            const response = await axios.get('/api/sitemap/main-urls');
            setMainUrls(response.data);
        } catch (error) {
            toast.error('خطا در دریافت لینک‌های sitemap اصلی');
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            await axios.post('/api/sitemap/refresh');
            await fetchStatus();
            await fetchMainUrls();
            toast.success('Sitemap با موفقیت به‌روزرسانی شد');
        } catch (error) {
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
            await axios.put('/api/sitemap/main-urls', editingUrl);
            await fetchMainUrls();
            setEditingUrl(null);
            toast.success('لینک با موفقیت به‌روزرسانی شد');
        } catch (error) {
            toast.error('خطا در به‌روزرسانی لینک');
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'نامشخص';
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy ساعت HH:mm');
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="bg-emerald-50 border-b">
                        <CardTitle className="text-emerald-700">Sitemap اصلی</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {status ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">تعداد URL:</span>
                                    <span className="font-semibold">{status.mainSitemap.urlCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">حجم فایل:</span>
                                    <span className="font-semibold">{status.mainSitemap.fileSize}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">آخرین به‌روزرسانی:</span>
                                    <span className="font-semibold">{formatDate(status.mainSitemap.lastUpdated)}</span>
                                </div>
                                <a
                                    href="https://mohammadrezasardashti.ir/sitemap.xml"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    مشاهده فایل XML
                                </a>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="bg-blue-50 border-b">
                        <CardTitle className="text-blue-700">Sitemap اخبار</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {status ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">تعداد URL:</span>
                                    <span className="font-semibold">{status.newsSitemap.urlCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">حجم فایل:</span>
                                    <span className="font-semibold">{status.newsSitemap.fileSize}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">آخرین به‌روزرسانی:</span>
                                    <span className="font-semibold">{formatDate(status.newsSitemap.lastUpdated)}</span>
                                </div>
                                <a
                                    href="https://mohammadrezasardashti.ir/news-sitemap.xml"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    مشاهده فایل XML
                                </a>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="bg-purple-50 border-b">
                        <CardTitle className="text-purple-700">Sitemap کلاس‌ها</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {status ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">تعداد URL:</span>
                                    <span className="font-semibold">{status.classesSitemap.urlCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">حجم فایل:</span>
                                    <span className="font-semibold">{status.classesSitemap.fileSize}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">آخرین به‌روزرسانی:</span>
                                    <span className="font-semibold">{formatDate(status.classesSitemap.lastUpdated)}</span>
                                </div>
                                <a
                                    href="https://mohammadrezasardashti.ir/classes-sitemap.xml"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center mt-4 text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    مشاهده فایل XML
                                </a>
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
                                {editingUrl?.loc === url.loc ? (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                آدرس
                                            </label>
                                            <input
                                                type="text"
                                                value={editingUrl.loc}
                                                onChange={(e) => setEditingUrl({ ...editingUrl, loc: e.target.value })}
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
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-lg font-semibold text-gray-900">{url.loc}</p>
                                            <Button 
                                                onClick={() => handleEditUrl(url)} 
                                                variant="outline"
                                                className="text-emerald-600 hover:text-emerald-700 border-emerald-200 hover:border-emerald-300"
                                            >
                                                ویرایش
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-gray-600">تغییرات:</span>
                                                <span className="mr-2 font-medium">{url.changefreq}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">اولویت:</span>
                                                <span className="mr-2 font-medium">{url.priority}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">آخرین به‌روزرسانی:</span>
                                            <span className="mr-2 font-medium">{formatDate(url.lastmod)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-gray-900">راهنمای Sitemap</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-emerald-50 rounded-lg">
                            <h3 className="font-semibold text-emerald-700 mb-2">Sitemap اصلی</h3>
                            <p className="text-gray-600">
                                این sitemap شامل تمام صفحات اصلی سایت است و به صورت خودکار به‌روزرسانی می‌شود.
                            </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-blue-700 mb-2">Sitemap اخبار</h3>
                            <p className="text-gray-600">
                                این sitemap شامل تمام صفحات اخبار سایت است و با انتشار یا ویرایش اخبار جدید به‌روزرسانی می‌شود.
                            </p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <h3 className="font-semibold text-purple-700 mb-2">Sitemap کلاس‌ها</h3>
                            <p className="text-gray-600">
                                این sitemap شامل تمام صفحات کلاس‌های سایت است و با اضافه یا ویرایش کلاس‌ها به‌روزرسانی می‌شود.
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-2">به‌روزرسانی خودکار</h3>
                            <p className="text-gray-600">
                                Sitemap‌ها به صورت خودکار در زمان‌های مشخص به‌روزرسانی می‌شوند. همچنین می‌توانید به صورت دستی آن‌ها را به‌روزرسانی کنید.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 
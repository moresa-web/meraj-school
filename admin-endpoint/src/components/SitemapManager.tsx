import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, Spinner } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';
import { faSync, faFileAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

interface SitemapStatus {
    urlCount: number;
    fileSize: number;
    lastUpdated: string;
    type: 'main' | 'news' | 'classes' | 'index';
}

interface SitemapStatuses {
    main: SitemapStatus;
    news: SitemapStatus;
    classes: SitemapStatus;
    index: SitemapStatus;
}

const SitemapManager: React.FC = () => {
    const [statuses, setStatuses] = useState<SitemapStatuses | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState<string | null>(null);

    const fetchStatuses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/api/sitemap/status');
            setStatuses(response.data);
        } catch (error) {
            setError('خطا در دریافت وضعیت sitemap‌ها');
            console.error('Error fetching sitemap statuses:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshSitemap = async (type: string) => {
        try {
            setRefreshing(type);
            setError(null);
            await axios.post(`/api/sitemap/refresh/${type}`);
            await fetchStatuses();
        } catch (error: any) {
            if (error.response?.status === 429) {
                setError(`لطفاً ${error.response.data.remainingTime} ثانیه دیگر دوباره تلاش کنید`);
            } else {
                setError('خطا در به‌روزرسانی sitemap');
            }
            console.error('Error refreshing sitemap:', error);
        } finally {
            setRefreshing(null);
        }
    };

    useEffect(() => {
        fetchStatuses();
    }, []);

    const formatFileSize = (bytes: number): string => {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 B';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    const getSitemapTitle = (type: string): string => {
        switch (type) {
            case 'main':
                return 'Sitemap اصلی';
            case 'news':
                return 'Sitemap اخبار';
            case 'classes':
                return 'Sitemap کلاس‌ها';
            case 'index':
                return 'Sitemap Index';
            default:
                return type;
        }
    };

    const getSitemapDescription = (type: string): string => {
        switch (type) {
            case 'main':
                return 'این sitemap شامل تمام صفحات اصلی سایت است و به صورت خودکار به‌روزرسانی می‌شود.';
            case 'news':
                return 'این sitemap شامل تمام صفحات اخبار سایت است و با انتشار یا ویرایش اخبار جدید به‌روزرسانی می‌شود.';
            case 'classes':
                return 'این sitemap شامل تمام صفحات کلاس‌های سایت است و با اضافه یا ویرایش کلاس‌ها به‌روزرسانی می‌شود.';
            case 'index':
                return 'این فایل شامل لیست تمام sitemap‌های سایت است و به صورت خودکار به‌روزرسانی می‌شود.';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">در حال بارگذاری...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h2 className="mb-4">مدیریت Sitemap</h2>

            {error && (
                <Alert variant="danger" className="mb-4">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                    {error}
                </Alert>
            )}

            <div className="row">
                {statuses && Object.entries(statuses).map(([type, status]) => (
                    <div key={type} className="col-md-6 col-lg-3 mb-4">
                        <Card>
                            <Card.Header>
                                <h5 className="mb-0">{getSitemapTitle(type)}</h5>
                            </Card.Header>
                            <Card.Body>
                                <p className="text-muted">{getSitemapDescription(type)}</p>
                                <div className="mb-3">
                                    <strong>تعداد URL:</strong> {status.urlCount}
                                </div>
                                <div className="mb-3">
                                    <strong>حجم فایل:</strong> {formatFileSize(status.fileSize)}
                                </div>
                                <div className="mb-3">
                                    <strong>آخرین به‌روزرسانی:</strong>{' '}
                                    {formatDistanceToNow(new Date(status.lastUpdated), { addSuffix: true })}
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={() => refreshSitemap(type)}
                                    disabled={refreshing === type}
                                >
                                    {refreshing === type ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            در حال به‌روزرسانی...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faSync} className="me-2" />
                                            به‌روزرسانی
                                        </>
                                    )}
                                </Button>
                            </Card.Body>
                            <Card.Footer>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    href={`/sitemap/${type}.xml`}
                                    target="_blank"
                                >
                                    <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                                    مشاهده فایل XML
                                </Button>
                            </Card.Footer>
                        </Card>
                    </div>
                ))}
            </div>

            <Card className="mt-4">
                <Card.Header>
                    <h5 className="mb-0">راهنمای Sitemap</h5>
                </Card.Header>
                <Card.Body>
                    <h6>Sitemap اصلی</h6>
                    <p>این sitemap شامل تمام صفحات اصلی سایت است و به صورت خودکار به‌روزرسانی می‌شود.</p>

                    <h6>Sitemap اخبار</h6>
                    <p>این sitemap شامل تمام صفحات اخبار سایت است و با انتشار یا ویرایش اخبار جدید به‌روزرسانی می‌شود.</p>

                    <h6>Sitemap کلاس‌ها</h6>
                    <p>این sitemap شامل تمام صفحات کلاس‌های سایت است و با اضافه یا ویرایش کلاس‌ها به‌روزرسانی می‌شود.</p>

                    <h6>Sitemap Index</h6>
                    <p>این فایل شامل لیست تمام sitemap‌های سایت است و به صورت خودکار به‌روزرسانی می‌شود.</p>

                    <h6>به‌روزرسانی خودکار</h6>
                    <p>
                        Sitemap‌ها به صورت خودکار در زمان‌های مشخص به‌روزرسانی می‌شوند. همچنین می‌توانید به صورت دستی آن‌ها را به‌روزرسانی کنید.
                    </p>
                </Card.Body>
            </Card>
        </div>
    );
};

export default SitemapManager; 
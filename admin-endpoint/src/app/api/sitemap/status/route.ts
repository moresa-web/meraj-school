import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        // مسیر به پوشه public در Site.EndPoint
        const publicDir = path.join(process.cwd(), '..', 'Site.EndPoint', 'public');
        console.log('Public directory:', publicDir);
        
        // خواندن اطلاعات sitemap اصلی
        const mainSitemapPath = path.join(publicDir, 'sitemap.xml');
        const mainSitemapStats = fs.existsSync(mainSitemapPath) ? fs.statSync(mainSitemapPath) : null;
        console.log('Main sitemap path:', mainSitemapPath);
        console.log('Main sitemap exists:', !!mainSitemapStats);
        
        // خواندن اطلاعات sitemap اخبار
        const newsSitemapPath = path.join(publicDir, 'news-sitemap.xml');
        const newsSitemapStats = fs.existsSync(newsSitemapPath) ? fs.statSync(newsSitemapPath) : null;
        console.log('News sitemap path:', newsSitemapPath);
        console.log('News sitemap exists:', !!newsSitemapStats);
        
        // خواندن اطلاعات sitemap کلاس‌ها
        const classesSitemapPath = path.join(publicDir, 'classes-sitemap.xml');
        const classesSitemapStats = fs.existsSync(classesSitemapPath) ? fs.statSync(classesSitemapPath) : null;
        console.log('Classes sitemap path:', classesSitemapPath);
        console.log('Classes sitemap exists:', !!classesSitemapStats);

        // خواندن محتوای فایل‌ها برای شمارش URLها
        const mainSitemapContent = mainSitemapStats ? fs.readFileSync(mainSitemapPath, 'utf-8') : '';
        const newsSitemapContent = newsSitemapStats ? fs.readFileSync(newsSitemapPath, 'utf-8') : '';
        const classesSitemapContent = classesSitemapStats ? fs.readFileSync(classesSitemapPath, 'utf-8') : '';

        // شمارش URLها با استفاده از regex
        const urlCount = (content: string) => {
            const matches = content.match(/<url>/g);
            return matches ? matches.length : 0;
        };

        // تبدیل حجم فایل به فرمت خوانا
        const formatFileSize = (bytes: number) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        return NextResponse.json({
            mainSitemap: {
                urlCount: urlCount(mainSitemapContent),
                fileSize: mainSitemapStats ? formatFileSize(mainSitemapStats.size) : '0 Bytes',
                lastUpdated: mainSitemapStats ? mainSitemapStats.mtime.toISOString() : null
            },
            newsSitemap: {
                urlCount: urlCount(newsSitemapContent),
                fileSize: newsSitemapStats ? formatFileSize(newsSitemapStats.size) : '0 Bytes',
                lastUpdated: newsSitemapStats ? newsSitemapStats.mtime.toISOString() : null
            },
            classesSitemap: {
                urlCount: urlCount(classesSitemapContent),
                fileSize: classesSitemapStats ? formatFileSize(classesSitemapStats.size) : '0 Bytes',
                lastUpdated: classesSitemapStats ? classesSitemapStats.mtime.toISOString() : null
            }
        });
    } catch (error) {
        console.error('Error getting sitemap status:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت وضعیت sitemap' },
            { status: 500 }
        );
    }
} 
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

// مسیر به فایل sitemap اصلی
const sitemapPath = path.join(process.cwd(), '..', 'Site.EndPoint', 'public', 'sitemap.xml');

// خواندن و پارس کردن فایل sitemap
function readSitemap() {
    const xmlData = fs.readFileSync(sitemapPath, 'utf-8');
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_'
    });
    return parser.parse(xmlData);
}

// ذخیره تغییرات در فایل sitemap
function saveSitemap(data: any) {
    const builder = new XMLBuilder({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        format: true
    });
    const xmlContent = builder.build(data);
    fs.writeFileSync(sitemapPath, xmlContent);
}

// دریافت لینک‌های sitemap اصلی
export async function GET() {
    try {
        const sitemap = readSitemap();
        const urls = sitemap.urlset.url.map((url: any) => ({
            loc: url.loc,
            lastmod: url.lastmod,
            changefreq: url.changefreq,
            priority: parseFloat(url.priority)
        }));

        return NextResponse.json(urls);
    } catch (error) {
        console.error('Error reading sitemap:', error);
        return NextResponse.json(
            { error: 'خطا در خواندن sitemap' },
            { status: 500 }
        );
    }
}

// به‌روزرسانی یک لینک در sitemap اصلی
export async function PUT(request: Request) {
    try {
        const updatedUrl = await request.json();
        const sitemap = readSitemap();

        // پیدا کردن و به‌روزرسانی لینک
        const urlIndex = sitemap.urlset.url.findIndex((url: any) => url.loc === updatedUrl.loc);
        if (urlIndex === -1) {
            return NextResponse.json(
                { error: 'لینک مورد نظر یافت نشد' },
                { status: 404 }
            );
        }

        sitemap.urlset.url[urlIndex] = {
            loc: updatedUrl.loc,
            lastmod: new Date().toISOString(),
            changefreq: updatedUrl.changefreq,
            priority: updatedUrl.priority.toString()
        };

        // ذخیره تغییرات
        saveSitemap(sitemap);

        return NextResponse.json({ message: 'لینک با موفقیت به‌روزرسانی شد' });
    } catch (error) {
        console.error('Error updating sitemap:', error);
        return NextResponse.json(
            { error: 'خطا در به‌روزرسانی sitemap' },
            { status: 500 }
        );
    }
} 
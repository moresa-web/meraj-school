import { Request, Response } from 'express';
import { Class } from '../models/Class';
import { INews } from '../models/News';
import SEO from '../models/SEO';

export const generateSitemap = async (req: Request, res: Response) => {
  try {
    const seo = await SEO.findOne();
    const baseUrl = seo?.siteUrl || 'https://mohammadrezasardashti.ir';
    
    // دریافت تمام کلاس‌ها و اخبار
    const classes = await Class.find({ status: 'active' }).lean();
    const news = await (await import('../models/News')).default.find({ status: 'published' }).lean();

    // ایجاد XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // صفحه اصلی
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}</loc>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    // صفحات ثابت
    const staticPages = [
      { path: '/about', priority: '0.8' },
      { path: '/contact', priority: '0.8' },
      { path: '/classes', priority: '0.9' },
      { path: '/news', priority: '0.9' }
    ];

    staticPages.forEach(page => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // صفحات کلاس‌ها
    classes.forEach((classItem: any) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/classes/${classItem.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(classItem.updatedAt).toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    // صفحات اخبار
    news.forEach((newsItem: any) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/news/${newsItem.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(newsItem.updatedAt).toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += '</urlset>';

    // تنظیم هدرهای مناسب
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ message: 'خطا در تولید sitemap' });
  }
}; 
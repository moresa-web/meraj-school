import { Request, Response } from 'express';
import { Class } from '../models/Class';
import { INews } from '../models/News';
import SEO from '../models/SEO';
import SitemapUrl from '../models/SitemapUrl';
import { SitemapService } from '../services/sitemapService';
import { logger } from '../utils/logger';
import { SitemapType } from '../types/sitemap';

export class SitemapController {
    private sitemapService: SitemapService;
    private readonly UPDATE_COOLDOWN = 5 * 60 * 1000; // 5 minutes
    private lastUpdate: Record<SitemapType, number | undefined> = {
        main: undefined,
        news: undefined,
        classes: undefined,
        index: undefined
    };

    constructor() {
        this.sitemapService = new SitemapService();
    }

    // تولید sitemap اصلی
    public generateMainSitemap = async (req: Request, res: Response) => {
  try {
    const seo = await SEO.findOne();
    const baseUrl = seo?.siteUrl || 'https://merajfutureschool.ir';
    
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
                { path: '/news', priority: '0.9' },
                { path: '/register', priority: '0.7' },
                { path: '/login', priority: '0.7' }
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
            logger.error('Error generating main sitemap:', error);
            res.status(500).json({ message: 'خطا در تولید sitemap اصلی' });
        }
    };

    // تولید sitemap اخبار
    public generateNewsSitemap = async (req: Request, res: Response) => {
        try {
            const seo = await SEO.findOne();
            const baseUrl = seo?.siteUrl || 'https://merajfutureschool.ir';
            const news = await (await import('../models/News')).default.find({ status: 'published' }).lean();

            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

            news.forEach((newsItem: any) => {
                xml += `  <url>\n`;
                xml += `    <loc>${baseUrl}/news/${newsItem.slug}</loc>\n`;
                xml += `    <news:news>\n`;
                xml += `      <news:publication>\n`;
                xml += `        <news:name>مدرسه معراج</news:name>\n`;
                xml += `        <news:language>fa</news:language>\n`;
                xml += `      </news:publication>\n`;
                xml += `      <news:publication_date>${new Date(newsItem.publishDate || newsItem.updatedAt).toISOString()}</news:publication_date>\n`;
                xml += `      <news:title>${newsItem.title}</news:title>\n`;
                xml += `    </news:news>\n`;
                xml += `    <lastmod>${new Date(newsItem.updatedAt).toISOString()}</lastmod>\n`;
                xml += `  </url>\n`;
            });

            xml += '</urlset>';

            res.header('Content-Type', 'application/xml');
            res.send(xml);
        } catch (error) {
            logger.error('Error generating news sitemap:', error);
            res.status(500).json({ message: 'خطا در تولید sitemap اخبار' });
  }
    };

    // تولید sitemap کلاس‌ها
    public generateClassesSitemap = async (req: Request, res: Response) => {
        try {
            const seo = await SEO.findOne();
            const baseUrl = seo?.siteUrl || 'https://merajfutureschool.ir';
            const classes = await Class.find({ status: 'active' }).lean();

            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

            // صفحه اصلی کلاس‌ها
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/classes</loc>\n`;
            xml += `    <changefreq>daily</changefreq>\n`;
            xml += `    <priority>0.9</priority>\n`;
            xml += `  </url>\n`;

            // صفحات کلاس‌ها
            classes.forEach((classItem: any) => {
                xml += `  <url>\n`;
                xml += `    <loc>${baseUrl}/classes/${classItem.slug}</loc>\n`;
                xml += `    <lastmod>${new Date(classItem.updatedAt).toISOString()}</lastmod>\n`;
                xml += `    <changefreq>weekly</changefreq>\n`;
                xml += `    <priority>0.8</priority>\n`;
                xml += `  </url>\n`;
            });

            xml += '</urlset>';

            res.header('Content-Type', 'application/xml');
            res.send(xml);
        } catch (error) {
            logger.error('Error generating classes sitemap:', error);
            res.status(500).json({ message: 'خطا در تولید sitemap کلاس‌ها' });
        }
    };

    // تولید sitemap index
    public generateSitemapIndex = async (req: Request, res: Response) => {
        try {
            const seo = await SEO.findOne();
            const baseUrl = seo?.siteUrl || 'https://merajfutureschool.ir';

            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

            // اضافه کردن همه sitemap‌ها
            const sitemaps = [
                { loc: '/sitemap.xml', lastmod: new Date().toISOString() },
                { loc: '/news-sitemap.xml', lastmod: new Date().toISOString() },
                { loc: '/classes-sitemap.xml', lastmod: new Date().toISOString() }
            ];

            sitemaps.forEach(sitemap => {
                xml += `  <sitemap>\n`;
                xml += `    <loc>${baseUrl}${sitemap.loc}</loc>\n`;
                xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
                xml += `  </sitemap>\n`;
            });

            xml += '</sitemapindex>';

            res.header('Content-Type', 'application/xml');
            res.send(xml);
        } catch (error) {
            logger.error('Error generating sitemap index:', error);
            res.status(500).json({ message: 'خطا در تولید sitemap index' });
        }
    };

    // به‌روزرسانی sitemap
    public refreshSitemap = async (req: Request, res: Response) => {
        try {
            const type = req.params.type as SitemapType;
            const now = Date.now();

            // بررسی زمان آخرین به‌روزرسانی
            if (this.lastUpdate[type] && now - this.lastUpdate[type]! < this.UPDATE_COOLDOWN) {
                const remainingTime = Math.ceil((this.UPDATE_COOLDOWN - (now - this.lastUpdate[type]!)) / 1000);
                return res.status(429).json({
                    message: `لطفاً ${remainingTime} ثانیه دیگر دوباره تلاش کنید`,
                    remainingTime
                });
            }

            // به‌روزرسانی sitemap
            await this.sitemapService.refreshSitemap(type);
            this.lastUpdate[type] = now;

            // دریافت وضعیت جدید
            const status = await this.sitemapService.getSitemapStatus(type);

            res.json({
                message: 'Sitemap با موفقیت به‌روزرسانی شد',
                status
            });
        } catch (error) {
            logger.error('Error refreshing sitemap:', error);
            res.status(500).json({ message: 'خطا در به‌روزرسانی sitemap' });
        }
    };

    // دریافت وضعیت sitemap
    public getSitemapStatus = async (req: Request, res: Response) => {
        try {
            const type = req.params.type as SitemapType;
            const status = await this.sitemapService.getSitemapStatus(type);
            res.json(status);
        } catch (error) {
            logger.error('Error getting sitemap status:', error);
            res.status(500).json({ message: 'خطا در دریافت وضعیت sitemap' });
        }
    };

    // دریافت همه وضعیت‌ها
    public getAllSitemapStatus = async (req: Request, res: Response) => {
        try {
            const statuses = await Promise.all([
                this.sitemapService.getSitemapStatus('main'),
                this.sitemapService.getSitemapStatus('news'),
                this.sitemapService.getSitemapStatus('classes'),
                this.sitemapService.getSitemapStatus('index')
            ]);

            res.json({
                main: statuses[0],
                news: statuses[1],
                classes: statuses[2],
                index: statuses[3]
            });
        } catch (error) {
            logger.error('Error getting all sitemap statuses:', error);
            res.status(500).json({ message: 'خطا در دریافت وضعیت sitemap‌ها' });
        }
    };

    // دریافت URLهای sitemap
    public getSitemapUrls = async (req: Request, res: Response) => {
        try {
            const seo = await SEO.findOne();
            const baseUrl = seo?.siteUrl || 'https://merajfutureschool.ir';
            
            // دریافت تمام کلاس‌ها و اخبار
            const classes = await Class.find({ isActive: true }).lean();
            const news = await (await import('../models/News')).default.find({ status: 'published' }).lean();

            console.log('Found classes:', classes.length);
            console.log('Found news:', news.length);

            // دریافت تنظیمات ذخیره شده URLها
            const savedUrls = await SitemapUrl.find().lean();
            const urlConfigs = new Map(savedUrls.map(url => [url.url, url]));

            // ایجاد لیست URLها با تنظیمات ذخیره شده
            const urls = [
                // صفحه اصلی
                this.getUrlWithConfig('/', 'daily', 1.0, urlConfigs),
                
                // صفحات ثابت
                this.getUrlWithConfig('/about', 'weekly', 0.8, urlConfigs),
                this.getUrlWithConfig('/contact', 'weekly', 0.8, urlConfigs),
                this.getUrlWithConfig('/register', 'monthly', 0.7, urlConfigs),
                this.getUrlWithConfig('/login', 'monthly', 0.7, urlConfigs),

                // صفحات اصلی اخبار و کلاس‌ها
                this.getUrlWithConfig('/news', 'daily', 0.9, urlConfigs),
                this.getUrlWithConfig('/classes', 'daily', 0.9, urlConfigs),

                // صفحات جزئیات کلاس‌ها
                ...classes.map((classItem: any) => 
                    this.getUrlWithConfig(
                        `/classes/${classItem.slug}`, 
                        'weekly', 
                        0.7, 
                        urlConfigs,
                        new Date(classItem.updatedAt).toISOString()
                    )
                ),

                // صفحات جزئیات اخبار
                ...news.map((newsItem: any) => 
                    this.getUrlWithConfig(
                        `/news/${newsItem.slug}`, 
                        'weekly', 
                        0.6, 
                        urlConfigs,
                        new Date(newsItem.updatedAt).toISOString(),
                        newsItem.title
                    )
                )
            ];

            console.log('Total URLs:', urls.length);

            res.json({
                baseUrl,
                urls
            });
        } catch (error) {
            logger.error('Error getting sitemap URLs:', error);
            res.status(500).json({ message: 'خطا در دریافت URLهای sitemap' });
        }
    };

    // متد کمکی برای دریافت URL با تنظیمات ذخیره شده
    private getUrlWithConfig(
        url: string, 
        defaultChangefreq: string, 
        defaultPriority: number, 
        urlConfigs: Map<string, any>,
        lastmod?: string,
        title?: string
    ) {
        const savedConfig = urlConfigs.get(url);
        
        if (savedConfig) {
            return {
                url,
                changefreq: savedConfig.changefreq,
                priority: savedConfig.priority,
                lastmod: savedConfig.lastmod || lastmod,
                title: savedConfig.title || title
            };
        }
        
        return {
            url,
            changefreq: defaultChangefreq,
            priority: defaultPriority,
            lastmod,
            title
        };
    }

    // به‌روزرسانی URLهای sitemap
    public updateSitemapUrl = async (req: Request, res: Response) => {
        try {
            const { url, changefreq, priority, lastmod, title } = req.body;
            
            // اعتبارسنجی داده‌های ورودی
            if (!url || !changefreq || priority === undefined) {
                return res.status(400).json({ 
                    message: 'تمام فیلدهای ضروری باید پر شوند' 
                });
            }

            // اعتبارسنجی priority
            if (priority < 0 || priority > 1) {
                return res.status(400).json({ 
                    message: 'اولویت باید بین 0 و 1 باشد' 
                });
            }

            // اعتبارسنجی changefreq
            const validChangefreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
            if (!validChangefreqs.includes(changefreq)) {
                return res.status(400).json({ 
                    message: 'نوع تغییرات نامعتبر است' 
                });
            }

            // ذخیره یا به‌روزرسانی تنظیمات URL در database
            const updateData = {
                changefreq,
                priority,
                lastmod,
                title,
                isCustom: true
            };

            const savedUrl = await SitemapUrl.findOneAndUpdate(
                { url },
                updateData,
                { 
                    new: true, 
                    upsert: true, 
                    runValidators: true 
                }
            );

            logger.info(`Sitemap URL updated: ${url} - changefreq: ${changefreq}, priority: ${priority}`);

            res.json({ 
                message: 'URL با موفقیت به‌روزرسانی شد',
                url: savedUrl
            });
        } catch (error) {
            logger.error('Error updating sitemap URL:', error);
            res.status(500).json({ message: 'خطا در به‌روزرسانی URL' });
        }
    };
} 
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

// تنظیمات sitemap
const sitemapConfig = {
    hostname: 'https://mohammadrezasardashti.ir',
    cacheTime: 600000,
    urls: []
};

// تنظیمات محیطی
const config = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://mohammadrezasardashti.ir',
    sitePath: process.env.SITE_PATH || path.join(__dirname, '..', '..', '..', 'Site.EndPoint')
};

// تولید sitemap اصلی
async function generateMainSitemap(urls) {
    const sitemap = new SitemapStream({
        ...sitemapConfig,
        xmlns: {
            xhtml: true,
            image: true,
            video: true
        }
    });
    
    urls.forEach(url => {
        sitemap.write({
            url: url.url,
            changefreq: url.changefreq || 'weekly',
            priority: url.priority || 0.8,
            lastmod: url.lastmod || new Date().toISOString()
        });
    });

    sitemap.end();
    return streamToPromise(sitemap);
}

// تولید sitemap اخبار
async function generateNewsSitemap(urls) {
    const sitemap = new SitemapStream({
        ...sitemapConfig,
        xmlns: {
            news: true,
            xhtml: true,
            image: true,
            video: true
        }
    });
    
    urls.forEach(url => {
        sitemap.write({
            url: url.url,
            changefreq: url.changefreq || 'weekly',
            priority: url.priority || 0.8,
            lastmod: url.lastmod || new Date().toISOString(),
            news: {
                publication: {
                    name: 'مدرسه معراج',
                    language: 'fa'
                },
                publication_date: url.lastmod || new Date().toISOString(),
                title: url.title || 'خبر مدرسه معراج'
            }
        });
    });

    sitemap.end();
    return streamToPromise(sitemap);
}

// تولید sitemap کلاس‌ها
async function generateClassesSitemap(urls) {
    const sitemap = new SitemapStream({
        ...sitemapConfig,
        xmlns: {
            xhtml: true,
            image: true,
            video: true
        }
    });
    
    urls.forEach(url => {
        sitemap.write({
            url: url.url,
            changefreq: url.changefreq || 'weekly',
            priority: url.priority || 0.7,
            lastmod: url.lastmod || new Date().toISOString()
        });
    });

    sitemap.end();
    return streamToPromise(sitemap);
}

// ذخیره sitemap در فایل
async function saveSitemap(sitemap, filename) {
    try {
        // مسیر به پوشه public در Site.EndPoint
        const publicDir = path.join(config.sitePath, 'public');
        
        // اطمینان از وجود پوشه
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
            console.log(`Created directory: ${publicDir}`);
        }
        
        const filePath = path.join(publicDir, filename);
        fs.writeFileSync(filePath, sitemap.toString());
        console.log(`Sitemap saved to ${filePath}`);
    } catch (error) {
        console.error(`Error saving sitemap ${filename}:`, error);
        throw error;
    }
}

// تابع اصلی
async function generateSitemaps() {
    try {
        console.log('Starting sitemap generation...');
        console.log('API URL:', config.apiUrl);
        console.log('Site Path:', config.sitePath);

        // تست اتصال به API
        try {
            const testResponse = await axios.get(`${config.apiUrl}/api/sitemap/urls`);
            console.log('API Test Response:', testResponse.data);
        } catch (error) {
            console.error('API Test Error:', error.message);
            if (error.response) {
                console.error('API Response:', error.response.data);
            }
            throw error;
        }

        // دریافت URLها از API
        const response = await axios.get(`${config.apiUrl}/api/sitemap/urls`);
        const { baseUrl, urls } = response.data;

        console.log(`Received ${urls.length} URLs from API`);
        console.log('URLs:', urls);

        // جداسازی URLها بر اساس نوع
        const mainUrls = urls.filter(url => !url.url.includes('/news/') && !url.url.includes('/classes/'));
        const newsUrls = urls.filter(url => url.url.includes('/news/'));
        const classesUrls = urls.filter(url => url.url.includes('/classes/'));

        console.log(`Main URLs: ${mainUrls.length}`, mainUrls);
        console.log(`News URLs: ${newsUrls.length}`, newsUrls);
        console.log(`Classes URLs: ${classesUrls.length}`, classesUrls);

        // تولید و ذخیره sitemap‌ها
        const mainSitemap = await generateMainSitemap(mainUrls);
        const newsSitemap = await generateNewsSitemap(newsUrls);
        const classesSitemap = await generateClassesSitemap(classesUrls);

        await saveSitemap(mainSitemap, 'sitemap.xml');
        await saveSitemap(newsSitemap, 'news-sitemap.xml');
        await saveSitemap(classesSitemap, 'classes-sitemap.xml');

        console.log('All sitemaps generated successfully!');
    } catch (error) {
        console.error('Error generating sitemaps:', error);
        process.exit(1);
    }
}

// اجرای اسکریپت
generateSitemaps(); 
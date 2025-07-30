// scripts/generate-sitemap.js
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { resolve } = require('path');
const axios = require('axios');

// تنظیمات sitemap
const sitemapConfig = {
    hostname: 'https://merajfutureschool.ir',
    xmlns: {
        news: true,
        xhtml: true,
        image: true,
        video: true
    }
};

// دریافت آدرس‌های داینامیک از API
async function fetchDynamicUrls() {
    try {
        console.log('Fetching URLs from API...');
        const response = await axios.get('http://localhost:5000/api/sitemap/urls');
        const { baseUrl, urls } = response.data;
        
        console.log('Received URLs:', urls);
        
        // URLهای اصلی (شامل صفحات اصلی و صفحات ثابت)
        const mainUrls = urls.filter(url => 
            url.url === '/' || 
            url.url === '/about' || 
            url.url === '/contact' || 
            url.url === '/register' || 
            url.url === '/login' || 
            url.url === '/news' || 
            url.url === '/classes'
        );
        
        console.log('Main URLs:', mainUrls);

        // URLهای جزئیات اخبار (به جز صفحه اصلی اخبار)
        const newsUrls = urls.filter(url => 
            url.url.startsWith('/news/') && url.url !== '/news'
        );
        
        console.log('News URLs:', newsUrls);

        // URLهای جزئیات کلاس‌ها (به جز صفحه اصلی کلاس‌ها)
        const classesUrls = urls.filter(url => 
            url.url.startsWith('/classes/') && url.url !== '/classes'
        );
        
        console.log('Classes URLs:', classesUrls);

        return {
            mainUrls,
            newsUrls,
            classesUrls,
            baseUrl
        };
    } catch (error) {
        console.error('Error fetching dynamic URLs:', error.message);
        if (error.response) {
            console.error('API Response:', error.response.data);
        }
        return {
            mainUrls: [],
            newsUrls: [],
            classesUrls: [],
            baseUrl: sitemapConfig.hostname
        };
    }
}

// تولید sitemap اصلی
async function generateMainSitemap(urls) {
    const sitemap = new SitemapStream(sitemapConfig);
    
    urls.forEach(url => {
        sitemap.write({
            url: url.url,
            changefreq: url.changefreq || 'daily',
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
    const sitemap = new SitemapStream(sitemapConfig);
    
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

// تولید sitemap index
async function generateSitemapIndex(baseUrl) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${baseUrl}/sitemap.xml</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${baseUrl}/news-sitemap.xml</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${baseUrl}/classes-sitemap.xml</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n  </sitemap>\n</sitemapindex>`;
    return Buffer.from(xml, 'utf-8');
}

// تولید همه sitemap‌ها
async function generateAllSitemaps() {
    try {
        const { mainUrls, newsUrls, classesUrls, baseUrl } = await fetchDynamicUrls();
        
        if (mainUrls.length === 0 && newsUrls.length === 0 && classesUrls.length === 0) {
            console.error('No URLs were fetched from API. Please make sure the API is running.');
            return;
        }

        // تولید sitemap‌ها
        const [mainSitemap, newsSitemap, classesSitemap, indexSitemap] = await Promise.all([
            generateMainSitemap(mainUrls),
            generateNewsSitemap(newsUrls),
            generateClassesSitemap(classesUrls),
            generateSitemapIndex(baseUrl)
        ]);

        // ذخیره sitemap‌ها
        const sitemapPath = resolve(__dirname, '../public');
        createWriteStream(resolve(sitemapPath, 'sitemap.xml')).write(mainSitemap.toString());
        createWriteStream(resolve(sitemapPath, 'news-sitemap.xml')).write(newsSitemap.toString());
        createWriteStream(resolve(sitemapPath, 'classes-sitemap.xml')).write(classesSitemap.toString());
        createWriteStream(resolve(sitemapPath, 'sitemap-index.xml')).write(indexSitemap);

        console.log('All sitemaps generated successfully!');
    } catch (error) {
        console.error('Error generating sitemaps:', error.message);
    }
}

generateAllSitemaps();
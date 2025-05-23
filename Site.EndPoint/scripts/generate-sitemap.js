// scripts/generate-sitemap.js
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { resolve } = require('path');

// آدرس‌های سایت
const urls = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/classes', changefreq: 'daily', priority: 0.9 },
  { url: '/news', changefreq: 'daily', priority: 0.8 },
  { url: '/about', changefreq: 'monthly', priority: 0.7 },
  { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/register', changefreq: 'monthly', priority: 0.7 },
  { url: '/login', changefreq: 'monthly', priority: 0.7 }
];

// تنظیمات sitemap
const sitemap = new SitemapStream({
  hostname: 'https://mohammadrezasardashti.ir',
  xmlns: {
    news: true,
    xhtml: true,
    image: true,
    video: true
  }
});

// اضافه کردن آدرس‌ها به sitemap
urls.forEach(url => {
  sitemap.write({
    ...url,
    lastmod: new Date().toISOString()
  });
});

sitemap.end();

// ذخیره sitemap.xml
streamToPromise(sitemap).then(sm => {
  const sitemapPath = resolve(__dirname, '../public/sitemap.xml');
  createWriteStream(sitemapPath).write(sm.toString());
  console.log('Sitemap generated successfully!');
}).catch(console.error);

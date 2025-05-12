// scripts/generate-sitemap.js
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

async function generate() {
    const urls = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/about', changefreq: 'weekly', priority: 0.8 },
        { url: '/contact', changefreq: 'weekly', priority: 0.8 },
        { url: '/news', changefreq: 'weekly', priority: 0.8 },
        { url: '/classes', changefreq: 'weekly', priority: 0.8 },
        { url: '/auth', changefreq: 'weekly', priority: 0.8 }
    ];

    const stream = new SitemapStream({ hostname: 'https://merajschool.ir' });
    const writeStream = createWriteStream('./public/sitemap.xml');
    streamToPromise(stream).then(data => writeStream.write(data));
    urls.forEach(u => stream.write(u));
    stream.end();
}

generate();

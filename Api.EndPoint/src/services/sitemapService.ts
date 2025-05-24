import { NewsService } from './newsService';
import { INews } from '../models/News';
import { logger } from '../utils/logger';
import { config } from '../config';
import fs from 'fs';
import path from 'path';
import { SitemapType, SitemapStatus } from '../types/sitemap';
import axios from 'axios';
import fsPromises from 'fs/promises';

export class SitemapService {
    private newsService: NewsService;
    private readonly SITEMAP_DIR = path.join(process.cwd(), 'public');
    private readonly SITEMAP_FILES = {
        main: 'sitemap.xml',
        news: 'news-sitemap.xml',
        classes: 'classes-sitemap.xml',
        index: 'sitemap-index.xml'
    };

    constructor() {
        this.newsService = new NewsService();
        this.ensureSitemapDirectory();
    }

    private async ensureSitemapDirectory() {
        try {
            await fsPromises.mkdir(this.SITEMAP_DIR, { recursive: true });
        } catch (error) {
            logger.error('Error creating sitemap directory:', error);
        }
    }

    public async generateSitemap(): Promise<string> {
        try {
            const baseUrl = config.baseUrl;
            const urls = [
                { url: '/', changefreq: 'daily', priority: '1.0' },
                { url: '/news', changefreq: 'daily', priority: '0.9' },
                { url: '/classes', changefreq: 'weekly', priority: '0.8' },
                { url: '/contact', changefreq: 'monthly', priority: '0.7' },
            ];

            const sitemap = this.generateSitemapXML(urls, baseUrl);
            await this.saveSitemap(sitemap, path.join(this.SITEMAP_DIR, this.SITEMAP_FILES.main));
            return sitemap;
        } catch (error) {
            logger.error('Error generating sitemap:', error);
            throw error;
        }
    }

    public async generateNewsSitemap(): Promise<string> {
        try {
            const baseUrl = config.baseUrl;
            const news = await this.newsService.getAllNews();
            const urls = news.map((news: INews) => ({
                url: `/news/${news.slug}`,
                changefreq: 'weekly',
                priority: '0.8',
                lastmod: news.updatedAt.toISOString()
            }));

            const sitemap = this.generateSitemapXML(urls, baseUrl);
            await this.saveSitemap(sitemap, path.join(this.SITEMAP_DIR, this.SITEMAP_FILES.news));
            return sitemap;
        } catch (error) {
            logger.error('Error generating news sitemap:', error);
            throw error;
        }
    }

    public async refreshSitemap(type: SitemapType): Promise<void> {
        try {
            const response = await axios.get(`http://localhost:5000/api/sitemap/${type}`);
            const xml = response.data;
            const filePath = path.join(this.SITEMAP_DIR, this.SITEMAP_FILES[type]);
            await fsPromises.writeFile(filePath, xml, 'utf-8');
            logger.info(`Sitemap ${type} refreshed successfully`);
        } catch (error) {
            logger.error(`Error refreshing sitemap ${type}:`, error);
            throw error;
        }
    }

    public async getSitemapStatus(type: SitemapType): Promise<SitemapStatus> {
        try {
            const filePath = path.join(this.SITEMAP_DIR, this.SITEMAP_FILES[type]);
            const stats = await fsPromises.stat(filePath);
            const content = await fsPromises.readFile(filePath, 'utf-8');
            const urlCount = (content.match(/<url>/g) || []).length;

            return {
                urlCount,
                fileSize: stats.size,
                lastUpdated: stats.mtime.toISOString(),
                type
            };
        } catch (error) {
            logger.error(`Error getting sitemap status for ${type}:`, error);
            return {
                urlCount: 0,
                fileSize: 0,
                lastUpdated: new Date().toISOString(),
                type
            };
        }
    }

    public async refreshAllSitemaps(): Promise<void> {
        try {
            await Promise.all([
                this.refreshSitemap('main'),
                this.refreshSitemap('news'),
                this.refreshSitemap('classes'),
                this.refreshSitemap('index')
            ]);
            logger.info('All sitemaps refreshed successfully');
        } catch (error) {
            logger.error('Error refreshing all sitemaps:', error);
            throw error;
        }
    }

    private generateSitemapXML(urls: any[], baseUrl: string): string {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${baseUrl}${url.url}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
  </url>`).join('')}
</urlset>`;
        return xml;
    }

    private async saveSitemap(sitemap: string, filePath: string): Promise<void> {
        try {
            await fsPromises.writeFile(filePath, sitemap);
        } catch (error) {
            logger.error('Error saving sitemap:', error);
            throw error;
        }
    }
} 
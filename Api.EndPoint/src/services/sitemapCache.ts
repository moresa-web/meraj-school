import { logger } from '../utils/logger';

export class SitemapCache {
    private static instance: SitemapCache;
    private cache: Map<string, { content: string; expiry: number }>;
    private readonly CACHE_TTL = 3600; // 1 hour in seconds

    private constructor() {
        this.cache = new Map();
    }

    public static getInstance(): SitemapCache {
        if (!SitemapCache.instance) {
            SitemapCache.instance = new SitemapCache();
        }
        return SitemapCache.instance;
    }

    public async set(key: string, content: string): Promise<void> {
        try {
            const expiry = Date.now() + (this.CACHE_TTL * 1000);
            this.cache.set(key, { content, expiry });
        } catch (error) {
            logger.error('Error setting sitemap cache:', error);
        }
    }

    public async get(key: string): Promise<string | null> {
        try {
            const cached = this.cache.get(key);
            if (!cached) return null;

            if (Date.now() > cached.expiry) {
                this.cache.delete(key);
                return null;
            }

            return cached.content;
        } catch (error) {
            logger.error('Error getting sitemap cache:', error);
            return null;
        }
    }

    public async delete(key: string): Promise<void> {
        try {
            this.cache.delete(key);
        } catch (error) {
            logger.error('Error deleting sitemap cache:', error);
        }
    }

    public async clear(): Promise<void> {
        try {
            this.cache.clear();
        } catch (error) {
            logger.error('Error clearing sitemap cache:', error);
        }
    }

    public async refresh(key: string): Promise<void> {
        try {
            const cached = this.cache.get(key);
            if (cached) {
                const expiry = Date.now() + (this.CACHE_TTL * 1000);
                this.cache.set(key, { ...cached, expiry });
            }
        } catch (error) {
            logger.error('Error refreshing sitemap cache:', error);
        }
    }
} 
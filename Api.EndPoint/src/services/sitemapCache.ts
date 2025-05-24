import Redis from 'ioredis';
import { promisify } from 'util';

class SitemapCache {
    private redis: Redis;
    private readonly CACHE_TTL = 3600; // 1 hour in seconds

    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
        });
    }

    // ذخیره sitemap در کش
    async setSitemap(type: string, content: string): Promise<void> {
        const key = `sitemap:${type}`;
        await this.redis.set(key, content, 'EX', this.CACHE_TTL);
    }

    // دریافت sitemap از کش
    async getSitemap(type: string): Promise<string | null> {
        const key = `sitemap:${type}`;
        return await this.redis.get(key);
    }

    // پاک کردن کش sitemap
    async clearSitemap(type?: string): Promise<void> {
        if (type) {
            const key = `sitemap:${type}`;
            await this.redis.del(key);
        } else {
            const keys = await this.redis.keys('sitemap:*');
            if (keys.length > 0) {
                await this.redis.del(...keys);
            }
        }
    }

    // به‌روزرسانی TTL کش
    async refreshTTL(type: string): Promise<void> {
        const key = `sitemap:${type}`;
        await this.redis.expire(key, this.CACHE_TTL);
    }
}

export const sitemapCache = new SitemapCache(); 
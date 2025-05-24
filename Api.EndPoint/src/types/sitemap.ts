export type SitemapType = 'main' | 'news' | 'classes' | 'index';

export interface SitemapStatus {
    urlCount: number;
    fileSize: number;
    lastUpdated: string;
    type: SitemapType;
}

export interface SitemapUrls {
    baseUrl: string;
    urls: Array<{
        url: string;
        changefreq: string;
        priority: number;
        lastmod?: string;
    }>;
} 
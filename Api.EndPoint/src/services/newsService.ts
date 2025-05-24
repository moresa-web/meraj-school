import News, { INews } from '../models/News';
import { logger } from '../utils/logger';

export class NewsService {
    /**
     * دریافت تمام اخبار
     */
    public async getAllNews(): Promise<INews[]> {
        try {
            const news = await News.find()
                .sort({ publishDate: -1 })
                .select('slug title updatedAt');
            return news;
        } catch (error) {
            logger.error('Error getting all news:', error);
            throw error;
        }
    }

    /**
     * دریافت یک خبر با شناسه
     */
    public async getNewsById(id: string): Promise<INews | null> {
        try {
            // این متد باید از دیتابیس خبر را با شناسه دریافت کند
            const news = await News.findById(id).lean() as INews | null;
            return news;
        } catch (error) {
            logger.error('Error getting news by id:', error);
            throw error;
        }
    }

    /**
     * دریافت اخبار با برچسب
     */
    public async getNewsByTag(tag: string): Promise<INews[]> {
        try {
            // این متد باید از دیتابیس اخبار را با برچسب دریافت کند
            return [];
        } catch (error) {
            logger.error('Error getting news by tag:', error);
            throw new Error('خطا در دریافت اخبار با برچسب');
        }
    }
} 
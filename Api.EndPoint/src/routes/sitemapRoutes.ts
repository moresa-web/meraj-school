import { Router } from 'express';
import { SitemapController } from '../controllers/sitemapController';

const router = Router();
const sitemapController = new SitemapController();

// مسیرهای تولید sitemap
router.get('/', sitemapController.generateMainSitemap);
router.get('/news.xml', sitemapController.generateNewsSitemap);
router.get('/classes.xml', sitemapController.generateClassesSitemap);
router.get('/index.xml', sitemapController.generateSitemapIndex);

// مسیرهای مدیریت sitemap
router.post('/refresh/:type', sitemapController.refreshSitemap);
router.get('/status/:type', sitemapController.getSitemapStatus);
router.get('/status', sitemapController.getAllSitemapStatus);

// مسیر دریافت URLها
router.get('/urls', sitemapController.getSitemapUrls);

export default router; 
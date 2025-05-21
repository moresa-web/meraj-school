import express from 'express';
import { generateSitemap } from '../controllers/sitemapController';
import { generateRobots } from '../controllers/robotsController';

const router = express.Router();

router.get('/sitemap.xml', generateSitemap);
router.get('/robots.txt', generateRobots);

export default router; 
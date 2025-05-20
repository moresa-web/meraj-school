import express from 'express';
import authRoutes from './auth';
import userRoutes from './userRoutes';
import newsRoutes from './newsRoutes';
import classesRoutes from './classes';
import contactRoutes from './contact';
import contentRoutes from './content';
import pageContentRoutes from './pageContent.routes';
import seoRoutes from './seo';
import uploadRoutes from './upload';
import dashboardRoutes from './dashboard';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/news', newsRoutes);
router.use('/classes', classesRoutes);
router.use('/contact', contactRoutes);
router.use('/content', contentRoutes);
router.use('/page-content', pageContentRoutes);
router.use('/seo', seoRoutes);
router.use('/upload', uploadRoutes);
router.use('/dashboard', dashboardRoutes);

export default router; 
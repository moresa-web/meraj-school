import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import newsRoutes from './newsRoutes';
import classesRoutes from './classes';
import pageContentRoutes from './pageContent.routes';
import contentRoutes from './content';
import contactRoutes from './contact';
import seoRoutes from './seo';
import uploadRoutes from './upload';
import newsletterRoutes from './newsletterRoutes';
import emailTemplateRoutes from './emailTemplate';
import dashboardRoutes from './dashboard';
import sitemapRoutes from './sitemapRoutes';
import usersRoutes from './users';
import chatRoutes from './chatRoutes';

const router = express.Router();

// اطلاعات مدرسه
router.get('/school-info', (req, res) => {
    res.json({
        status: 'success',
        data: {
            name: 'دبیرستان پسرانه معراج',
            address: 'بلوار دانش آموز، دانش آموز 10',
            phone: '051-38932030',
            email: 'info@merajschool.ir',
            website: 'https://merajschool.ir',
            description: 'دبیرستان پسرانه معراج - مرکز آموزش و پرورش با کیفیت و استانداردهای جهانی',
            workingHours: 'شنبه تا چهارشنبه از ساعت 7:30 تا 14:30',
            socialMedia: {
                instagram: 'https://instagram.com/merajschool',
                telegram: 'https://t.me/merajschool',
                whatsapp: '09123456789'
            }
        }
    });
});

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/classes', classesRoutes);
router.use('/news', newsRoutes);
router.use('/page-content', pageContentRoutes);
router.use('/content', contentRoutes);
router.use('/contact', contactRoutes);
router.use('/seo', seoRoutes);
router.use('/upload', uploadRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/email-templates', emailTemplateRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/sitemap', sitemapRoutes);
router.use('/chat', chatRoutes);

export default router; 
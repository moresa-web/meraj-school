import express from 'express';
import { Class } from '../models/Class';
import News from '../models/News';
import Newsletter from '../models/Newsletter';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const [
      totalClasses,
      totalNewsletters,
      recentClasses,
      recentNews,
      totalNews,
      totalActiveNews,
      totalActiveClasses,
      totalActiveNewsletters
    ] = await Promise.all([
      Class.countDocuments(),
      Newsletter.countDocuments(),
      Class.find({ isActive: true })
        .sort({ startDate: -1 })
        .limit(5)
        .select('title teacher startDate')
        .lean(),
      News.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title createdAt')
        .lean(),
      News.countDocuments(),
      News.countDocuments({ isPublished: true }),
      Class.countDocuments({ isActive: true }),
      Newsletter.countDocuments({ active: true })
    ]);

    res.json({
      totalClasses,
      totalNewsletters,
      recentClasses: recentClasses.map(cls => ({
        id: cls._id?.toString(),
        title: cls.title,
        teacher: cls.teacher,
        startDate: cls.startDate
      })),
      recentNews: recentNews.map(news => ({
        id: news._id?.toString(),
        title: news.title,
        createdAt: (news as any).createdAt?.toString()
      })),
      totalNews,
      totalActiveNews,
      totalActiveClasses,
      totalActiveNewsletters
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'خطا در دریافت آمار داشبورد' });
  }
});

router.get('/newsletter-history', async (req, res) => {
  try {
    // دریافت آمار 6 ماه اخیر
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
        label: date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long' })
      };
    }).reverse();

    const stats = await Promise.all(
      months.map(async ({ start, end, label }) => {
        const total = await Newsletter.countDocuments({
          createdAt: { $gte: start, $lte: end }
        });
        const active = await Newsletter.countDocuments({
          createdAt: { $gte: start, $lte: end },
          active: true
        });
        return {
          label,
          total,
          active
        };
      })
    );

    res.json(stats);
  } catch (error) {
    console.error('Error fetching newsletter history:', error);
    res.status(500).json({ error: 'خطا در دریافت تاریخچه خبرنامه' });
  }
});

export default router; 
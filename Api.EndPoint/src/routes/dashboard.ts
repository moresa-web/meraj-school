import express from 'express';
import { Class } from '../models/Class';
import News from '../models/News';
import Newsletter from '../models/Newsletter';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const [
      totalClasses,
      totalNewsletters,
      recentClasses,
      recentNews
    ] = await Promise.all([
      Class.countDocuments(),
      Newsletter.countDocuments(),
      Class.find()
        .sort({ startDate: -1 })
        .limit(5)
        .select('title teacher startDate'),
      News.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title createdAt')
    ]);

    res.json({
      totalClasses,
      totalNewsletters,
      recentClasses,
      recentNews
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'خطا در دریافت آمار داشبورد' });
  }
});

export default router; 
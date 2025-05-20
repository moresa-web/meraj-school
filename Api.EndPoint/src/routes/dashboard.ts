import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/stats', async (req, res) => {
  try {
    const [
      totalClasses,
      totalNewsletters,
      recentClasses,
      recentNews
    ] = await Promise.all([
      prisma.class.count(),
      prisma.newsletter.count(),
      prisma.class.findMany({
        take: 5,
        orderBy: { startDate: 'desc' },
        select: {
          id: true,
          title: true,
          teacher: true,
          startDate: true
        }
      }),
      prisma.news.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          createdAt: true
        }
      })
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
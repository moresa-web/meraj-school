import express from 'express';
import { Router } from 'express';
import SEO from '../models/SEO';
import { authMiddleware as auth } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Get SEO data
router.get('/', async (req, res) => {
  try {
    const seo = await SEO.findOne();
    res.json(seo || {});
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت اطلاعات سئو' });
  }
});

// Update SEO data
router.put('/', auth, async (req, res) => {
  try {
    const seoData = req.body;
    let seo = await SEO.findOne();

    if (seo) {
      seo = await SEO.findByIdAndUpdate(seo._id, seoData, { new: true });
    } else {
      seo = await SEO.create(seoData);
    }

    res.json(seo);
  } catch (error) {
    res.status(500).json({ message: 'خطا در بروزرسانی اطلاعات سئو' });
  }
});

export default router; 
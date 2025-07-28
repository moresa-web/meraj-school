import express from 'express';
import { Router } from 'express';
import { getSEO, updateSEO } from '../controllers/SEOController';
import { authMiddleware as auth } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Get SEO data
router.get('/', getSEO);

// Update SEO data
router.put('/', auth, updateSEO);

export default router; 
import { Request, Response } from 'express';
import SEO from '../models/SEO';

export const generateRobots = async (req: Request, res: Response) => {
  try {
    const seo = await SEO.findOne();
    const baseUrl = seo?.siteUrl || 'https://mohammadrezasardashti.ir';

    let robotsTxt = '# robots.txt for ' + baseUrl + '\n\n';
    robotsTxt += 'User-agent: *\n';
    robotsTxt += 'Allow: /\n\n';
    robotsTxt += '# Sitemap\n';
    robotsTxt += `Sitemap: ${baseUrl}/sitemap.xml\n\n`;
    robotsTxt += '# Disallow admin panel\n';
    robotsTxt += 'Disallow: /admin\n';
    robotsTxt += 'Disallow: /api\n';
    robotsTxt += 'Disallow: /dashboard\n';

    res.header('Content-Type', 'text/plain');
    res.send(robotsTxt);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    res.status(500).json({ message: 'خطا در تولید robots.txt' });
  }
}; 
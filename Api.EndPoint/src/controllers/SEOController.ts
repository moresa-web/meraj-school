import { Request, Response } from 'express';
import SEO from '../models/SEO';

export const getSEO = async (req: Request, res: Response) => {
  try {
    // Get the first SEO document (there should only be one)
    let seo = await SEO.findOne();
    
    // If no SEO document exists, create one with default values
    if (!seo) {
      seo = await SEO.create({
        title: 'عنوان پیش‌فرض',
        description: 'توضیحات پیش‌فرض',
        keywords: ['کلمه کلیدی 1', 'کلمه کلیدی 2'],
        image: '/images/default-og.jpg',
        siteUrl: 'http://localhost:3000',
        schoolName: 'نام مدرسه',
        address: 'آدرس مدرسه',
        phone: 'شماره تماس',
        email: 'ایمیل',
        socialMedia: {
          instagram: '',
          twitter: ''
        }
      });
    }
    
    res.json(seo);
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    res.status(500).json({ message: 'خطا در دریافت اطلاعات SEO' });
  }
};

export const updateSEO = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      keywords,
      image,
      siteUrl,
      schoolName,
      address,
      phone,
      email,
      socialMedia
    } = req.body;

    // Find the first SEO document
    let seo = await SEO.findOne();
    
    // If no SEO document exists, create one
    if (!seo) {
      seo = new SEO();
      // Initialize socialMedia object if it doesn't exist
      if (!seo.socialMedia) {
        seo.socialMedia = {
          instagram: '',
          twitter: ''
        };
      }
    }

    // Update fields if they are provided
    if (title !== undefined) seo.title = title;
    if (description !== undefined) seo.description = description;
    if (keywords !== undefined) {
      // اگر keywords یک رشته است، آن را به آرایه تبدیل می‌کنیم
      seo.keywords = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim()).filter(Boolean);
    }
    if (image !== undefined) seo.image = image;
    if (siteUrl !== undefined) seo.siteUrl = siteUrl;
    if (schoolName !== undefined) seo.schoolName = schoolName;
    if (address !== undefined) seo.address = address;
    if (phone !== undefined) seo.phone = phone;
    if (email !== undefined) seo.email = email;
    if (socialMedia !== undefined) {
      // Initialize socialMedia object if it doesn't exist
      if (!seo.socialMedia) {
        seo.socialMedia = {
          instagram: '',
          twitter: ''
        };
      }
      if (socialMedia.instagram !== undefined) seo.socialMedia.instagram = socialMedia.instagram;
      if (socialMedia.twitter !== undefined) seo.socialMedia.twitter = socialMedia.twitter;
    }

    await seo.save();
    res.json(seo);
  } catch (error) {
    console.error('Error updating SEO data:', error);
    res.status(500).json({ message: 'خطا در بروزرسانی اطلاعات SEO' });
  }
}; 
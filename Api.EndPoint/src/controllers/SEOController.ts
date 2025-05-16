import { Request, Response } from 'express';
import SEO from '../models/SEO';

export const getSEO = async (req: Request, res: Response) => {
  try {
    // Get the first SEO document (there should only be one)
    let seo = await SEO.findOne();
    
    // If no SEO document exists, create one with default values
    if (!seo) {
      seo = await SEO.create({});
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
    }

    // Update fields if they are provided
    if (title) seo.title = title;
    if (description) seo.description = description;
    if (keywords) seo.keywords = keywords;
    if (image) seo.image = image;
    if (siteUrl) seo.siteUrl = siteUrl;
    if (schoolName) seo.schoolName = schoolName;
    if (address) seo.address = address;
    if (phone) seo.phone = phone;
    if (email) seo.email = email;
    if (socialMedia) {
      if (socialMedia.instagram) seo.socialMedia.instagram = socialMedia.instagram;
      if (socialMedia.twitter) seo.socialMedia.twitter = socialMedia.twitter;
    }

    await seo.save();
    res.json(seo);
  } catch (error) {
    console.error('Error updating SEO data:', error);
    res.status(500).json({ message: 'خطا در بروزرسانی اطلاعات SEO' });
  }
}; 
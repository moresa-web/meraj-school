import { Request, Response } from 'express';
import News, { INews } from '../models/News';
import Newsletter from '../models/Newsletter';
import path from 'path';
import fs from 'fs';
import slugify from 'slugify';
import { sendEmail } from '../utils/mailer';
import { getActiveTemplateByType, sendTemplatedEmail } from '../utils/emailTemplate';

// Get all news with filtering and sorting
export const getNews = async (req: Request, res: Response) => {
  try {
    const { category, sortBy, search, showAll } = req.query;
    
    let query: any = {};
    
    // Only show published news for regular users,
    // admins can see all news when showAll=true is passed
    if (showAll !== 'true') {
      query.isPublished = true;
    }
    
    // Apply category filter
    if (category && category !== 'همه اخبار') {
      query.category = category;
    }
    
    // Apply search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sort: any = {};
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        sort = { date: -1 };
        break;
      case 'mostViewed':
        sort = { views: -1 };
        break;
      case 'mostLiked':
        sort = { likes: -1 };
        break;
      default:
        sort = { date: -1 };
    }
    
    const news = await News.find(query).sort(sort);
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error });
  }
};

// Get single news by slug
export const getNewsBySlug = async (req: Request, res: Response) => {
  try {
    const news = await News.findOne({ slug: req.params.slug });
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    // Increment views
    news.views += 1;
    await news.save();
    
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error });
  }
};

// Create new news
export const createNews = async (req: Request, res: Response) => {
  try {
    const { title, description, content, category, tags, author, isPublished, slug } = req.body;
    let image = '';

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: 'تصویر خبر الزامی است' });
    }

    // Create slug from title if not provided
    const newsSlug = typeof slug === 'string' ? slug : slugify(title, {
      lower: true,
      strict: true,
      locale: 'fa'
    });

    // Parse tags safely
    let parsedTags = [];
    try {
      if (tags) {
        parsedTags = JSON.parse(tags);
        // Validate that it's actually an array
        if (!Array.isArray(parsedTags)) {
          parsedTags = [];
        }
      }
    } catch (error) {
      console.error('Error parsing tags JSON:', error);
      parsedTags = [];
    }

    const news = new News({
      title,
      description,
      content,
      category,
      tags: parsedTags,
      author,
      date: new Date().toLocaleDateString('fa-IR'),
      image,
      isPublished: isPublished === 'true',
      views: 0,
      likes: 0,
      likedBy: [],
      slug: newsSlug
    });

    await news.save();

    // ارسال ایمیل به مشترکین خبرنامه
    try {
      const subscribers = await Newsletter.find({ active: true });
      const template = await getActiveTemplateByType('new_news');

      if (template && subscribers.length > 0) {
        const variables = {
          title: news.title,
          content: news.content,
          image: news.image.startsWith('http') ? news.image : `${process.env.API_URL}${news.image}`,
          date: news.date
        };

        for (const subscriber of subscribers) {
          await sendTemplatedEmail(template, subscriber.email, variables);
        }
      }
    } catch (error) {
      console.error('خطا در ارسال ایمیل به مشترکین:', error);
    }

    res.status(201).json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(400).json({ message: 'Error creating news', error });
  }
};

// Update news
export const updateNews = async (req: Request, res: Response) => {
  try {
    const { title, description, content, category, tags, author, isPublished, slug } = req.body;
    const updateData: any = {
      title,
      description,
      content,
      category,
      author,
      isPublished: isPublished === 'true'
    };

    // Parse tags safely
    try {
      if (tags) {
        updateData.tags = JSON.parse(tags);
        // Validate that it's actually an array
        if (!Array.isArray(updateData.tags)) {
          updateData.tags = [];
        }
      } else {
        updateData.tags = [];
      }
    } catch (error) {
      console.error('Error parsing tags JSON:', error);
      updateData.tags = [];
    }

    // Update slug if provided or if title is changed
    if (typeof slug === 'string' && slug) {
      updateData.slug = slug;
    } else if (title) {
      updateData.slug = slugify(title, {
        lower: true,
        strict: true,
        locale: 'fa'
      });
    }

    if (req.file) {
      // Delete old image if exists
      const news = await News.findOne({ slug: req.params.slug });
      if (news?.image) {
        const oldImagePath = path.join(__dirname, '../../', news.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedNews = await News.findOneAndUpdate(
      { slug: req.params.slug },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(updatedNews);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(400).json({ message: 'Error updating news', error });
  }
};

// Delete news
export const deleteNews = async (req: Request, res: Response) => {
  try {
    const news = await News.findOne({ slug: req.params.slug });
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Delete image if exists
    if (news.image) {
      const imagePath = path.join(__dirname, '../../', news.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await news.deleteOne();
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Error deleting news', error });
  }
};

// Like/Unlike news
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const news = await News.findOne({ slug: req.params.slug });
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // دریافت IP کاربر
    const userIP = req.ip || req.socket.remoteAddress || '';
    
    // بررسی اینکه آیا کاربر قبلاً لایک کرده است
    const hasLiked = news.likedBy.includes(userIP);
    
    if (hasLiked) {
      // اگر قبلاً لایک کرده است، لایک را برمی‌داریم
      news.likes = Math.max(0, news.likes - 1);
      news.likedBy = news.likedBy.filter(ip => ip !== userIP);
    } else {
      // اگر قبلاً لایک نکرده است، لایک را اضافه می‌کنیم
      news.likes += 1;
      news.likedBy.push(userIP);
    }
    
    await news.save();
    res.json(news);
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Error toggling like', error });
  }
}; 
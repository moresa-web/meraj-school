import { Request, Response } from 'express';
import News, { INews } from '../models/News';
import path from 'path';
import fs from 'fs';

// Get all news with filtering and sorting
export const getNews = async (req: Request, res: Response) => {
  try {
    const { category, sortBy, search } = req.query;
    
    let query: any = {};
    
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

// Get single news by ID
export const getNewsById = async (req: Request, res: Response) => {
  try {
    const news = await News.findById(req.params.id);
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
    const { title, description, content, category, tags, author, isPublished } = req.body;
    let image = '';

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: 'تصویر خبر الزامی است' });
    }

    const news = new News({
      title,
      description,
      content,
      category,
      tags: JSON.parse(tags || '[]'),
      author,
      date: new Date().toLocaleDateString('fa-IR'),
      image,
      isPublished: isPublished === 'true',
      views: 0,
      likes: 0,
      likedBy: []
    });

    await news.save();
    res.status(201).json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(400).json({ message: 'Error creating news', error });
  }
};

// Update news
export const updateNews = async (req: Request, res: Response) => {
  try {
    const { title, description, content, category, tags, author, isPublished } = req.body;
    const updateData: any = {
      title,
      description,
      content,
      category,
      tags: JSON.parse(tags || '[]'),
      author,
      isPublished: isPublished === 'true'
    };

    if (req.file) {
      // Delete old image if exists
      const news = await News.findById(req.params.id);
      if (news?.image) {
        const oldImagePath = path.join(__dirname, '../../', news.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
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
    const news = await News.findById(req.params.id);
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
    const news = await News.findById(req.params.id);
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
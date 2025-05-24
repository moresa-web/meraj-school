import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  slug: string;
  content: string;
  summary: string;
  image: string;
  publishDate: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  tags: string[];
  stockTickers: string[];
  views: number;
  likes: number;
  likedBy: string[];
  date: Date;
}

const newsSchema = new Schema<INews>({
  title: {
    type: String,
    required: [true, 'عنوان خبر الزامی است'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'نامک خبر الزامی است'],
    unique: true,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'محتوی خبر الزامی است']
  },
  summary: {
    type: String,
    required: [true, 'خلاصه خبر الزامی است'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'تصویر خبر الزامی است']
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  tags: [{
    type: String,
    trim: true
  }],
  stockTickers: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: String,
    trim: true
  }],
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// ایجاد ایندکس برای جستجو
newsSchema.index({ title: 'text', content: 'text', summary: 'text' });

export default mongoose.model<INews>('News', newsSchema); 
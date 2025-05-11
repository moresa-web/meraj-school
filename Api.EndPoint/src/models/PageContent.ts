import mongoose, { Schema, Document } from 'mongoose';

export interface IPageContent extends Document {
  pageId: string;  // شناسه یکتا برای هر صفحه
  title: string;   // عنوان صفحه
  content: {
    sections: Array<{
      type: 'text' | 'image' | 'gallery' | 'video';
      content: string;  // متن یا مسیر فایل
      order: number;    // ترتیب نمایش
      metadata?: {
        alt?: string;   // برای تصاویر
        caption?: string;
        [key: string]: any;
      };
    }>;
  };
  isActive: boolean;
  lastModifiedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PageContentSchema = new Schema({
  pageId: {
    type: String,
    required: true,
    unique: true,
    enum: ['home', 'about', 'classes', 'news', 'contact']
  },
  title: {
    type: String,
    required: true
  },
  content: {
    sections: [{
      type: {
        type: String,
        enum: ['text', 'image', 'gallery', 'video'],
        required: true
      },
      content: {
        type: String,
        required: true
      },
      order: {
        type: Number,
        required: true
      },
      metadata: {
        type: Schema.Types.Mixed
      }
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastModifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IPageContent>('PageContent', PageContentSchema); 
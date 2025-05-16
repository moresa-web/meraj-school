import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  description: string;
  date: string;
  image: string;
  category: string;
  views: number;
  likes: number;
  likedBy: string[];
  content: string;
  author: string;
  tags: string[];
  slug: string;
  isPublished: boolean;
}

const newsSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  content: { type: String, required: true },
  author: { type: String, required: true },
  tags: [{ type: String }],
  slug: { type: String, required: true, unique: true },
  isPublished: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<INews>('News', newsSchema); 
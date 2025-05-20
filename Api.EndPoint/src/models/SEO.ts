import mongoose, { Schema, Document } from 'mongoose';

export interface ISEO extends Document {
  title: string;
  description: string;
  keywords: string[];
  image: string;
  siteUrl: string;
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    instagram?: string;
    twitter?: string;
  };
}

const SEOSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: [{ type: String, required: true }],
  image: { type: String, required: true },
  siteUrl: { type: String, required: true },
  schoolName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  socialMedia: {
    instagram: { type: String },
    twitter: { type: String }
  }
}, {
  timestamps: true
});

export default mongoose.model<ISEO>('SEO', SEOSchema); 
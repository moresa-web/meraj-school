import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailTemplate extends Document {
  name: string;
  description: string;
  type: 'new_news' | 'new_class';
  subject: string;
  html: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const emailTemplateSchema = new Schema<IEmailTemplate>(
  {
    name: {
      type: String,
      required: [true, 'نام قالب الزامی است'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'توضیحات قالب الزامی است'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'نوع قالب الزامی است'],
      enum: {
        values: ['new_news', 'new_class'],
        message: 'نوع قالب باید یکی از مقادیر new_news یا new_class باشد',
      },
    },
    subject: {
      type: String,
      required: [true, 'موضوع ایمیل الزامی است'],
      trim: true,
    },
    html: {
      type: String,
      required: [true, 'محتوای HTML قالب الزامی است'],
    },
    variables: [{
      type: String,
      required: true,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ایجاد ایندکس برای جستجوی سریع‌تر
emailTemplateSchema.index({ name: 1, type: 1 });

export const EmailTemplate = mongoose.model<IEmailTemplate>('EmailTemplate', emailTemplateSchema); 
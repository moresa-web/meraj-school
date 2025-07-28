import mongoose, { Document, Schema } from 'mongoose';

export interface ISitemapUrl extends Document {
    url: string;
    changefreq: string;
    priority: number;
    lastmod?: string;
    title?: string;
    isCustom: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SitemapUrlSchema = new Schema<ISitemapUrl>({
    url: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    changefreq: {
        type: String,
        required: true,
        enum: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
        default: 'weekly'
    },
    priority: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
        default: 0.5
    },
    lastmod: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    isCustom: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index برای جستجوی سریع
SitemapUrlSchema.index({ url: 1 });
SitemapUrlSchema.index({ isCustom: 1 });

export default mongoose.model<ISitemapUrl>('SitemapUrl', SitemapUrlSchema); 
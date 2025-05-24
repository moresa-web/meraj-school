import mongoose, { Document, Schema } from 'mongoose';

export interface ISEO extends Document {
    siteUrl: string;
    siteName: string;
    siteDescription: string;
    keywords: string[];
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    robotsTxt?: string;
    sitemapUrl?: string;
    updatedAt: Date;
}

const seoSchema = new Schema<ISEO>({
    siteUrl: {
        type: String,
        required: [true, 'آدرس سایت الزامی است'],
        trim: true
    },
    siteName: {
        type: String,
        required: [true, 'نام سایت الزامی است'],
        trim: true
    },
    siteDescription: {
        type: String,
        required: [true, 'توضیحات سایت الزامی است'],
        trim: true
    },
    keywords: [{
        type: String,
        trim: true
    }],
    googleAnalyticsId: {
        type: String,
        trim: true
    },
    googleTagManagerId: {
        type: String,
        trim: true
    },
    robotsTxt: {
        type: String,
        trim: true
    },
    sitemapUrl: {
        type: String,
        trim: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model<ISEO>('SEO', seoSchema); 
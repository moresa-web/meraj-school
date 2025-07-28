import mongoose, { Document, Schema } from 'mongoose';

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
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    robotsTxt?: string;
    sitemapUrl?: string;
    updatedAt: Date;
}

const seoSchema = new Schema<ISEO>({
    title: {
        type: String,
        required: [true, 'عنوان سایت الزامی است'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'توضیحات سایت الزامی است'],
        trim: true
    },
    keywords: [{
        type: String,
        trim: true
    }],
    image: {
        type: String,
        trim: true
    },
    siteUrl: {
        type: String,
        required: [true, 'آدرس سایت الزامی است'],
        trim: true
    },
    schoolName: {
        type: String,
        required: [true, 'نام مدرسه الزامی است'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'آدرس الزامی است'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'شماره تماس الزامی است'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'ایمیل الزامی است'],
        trim: true
    },
    socialMedia: {
        instagram: {
            type: String,
            trim: true
        },
        twitter: {
            type: String,
            trim: true
        }
    },
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
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
        telegram?: string;
        linkedin?: string;
    };
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    bingWebmasterTools?: string;
    yandexWebmaster?: string;
    robotsTxt?: string;
    sitemapUrl?: string;
    // Additional SEO fields for better management
    defaultTitle?: string;
    defaultDescription?: string;
    defaultKeywords?: string[];
    ogImage?: string;
    twitterImage?: string;
    favicon?: string;
    themeColor?: string;
    backgroundColor?: string;
    // Structured data fields
    structuredData?: {
        organization?: any;
        school?: any;
        localBusiness?: any;
    };
    // Contact and location details
    latitude?: number;
    longitude?: number;
    openingHours?: string;
    priceRange?: string;
    foundingDate?: string;
    numberOfStudents?: string;
    numberOfTeachers?: string;
    slogan?: string;
    awards?: string[];
    serviceTypes?: string[];
    curriculum?: string;
    educationalLevel?: string;
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
        },
        telegram: {
            type: String,
            trim: true
        },
        linkedin: {
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
    bingWebmasterTools: {
        type: String,
        trim: true
    },
    yandexWebmaster: {
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
    defaultTitle: {
        type: String,
        trim: true
    },
    defaultDescription: {
        type: String,
        trim: true
    },
    defaultKeywords: [{
        type: String,
        trim: true
    }],
    ogImage: {
        type: String,
        trim: true
    },
    twitterImage: {
        type: String,
        trim: true
    },
    favicon: {
        type: String,
        trim: true
    },
    themeColor: {
        type: String,
        trim: true
    },
    backgroundColor: {
        type: String,
        trim: true
    },
    structuredData: {
        organization: {
            type: Schema.Types.Mixed
        },
        school: {
            type: Schema.Types.Mixed
        },
        localBusiness: {
            type: Schema.Types.Mixed
        }
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    openingHours: {
        type: String,
        trim: true
    },
    priceRange: {
        type: String,
        trim: true
    },
    foundingDate: {
        type: String,
        trim: true
    },
    numberOfStudents: {
        type: String,
        trim: true
    },
    numberOfTeachers: {
        type: String,
        trim: true
    },
    slogan: {
        type: String,
        trim: true
    },
    awards: [{
        type: String,
        trim: true
    }],
    serviceTypes: [{
        type: String,
        trim: true
    }],
    curriculum: {
        type: String,
        trim: true
    },
    educationalLevel: {
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
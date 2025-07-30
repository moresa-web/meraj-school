# SEO API Integration Documentation

## Overview

This document describes the complete SEO API integration that allows all SEO information to be managed through the admin panel and dynamically loaded by the frontend application.

## Architecture

The SEO system consists of three main components:

1. **Backend API** (`Api.EndPoint/`) - MongoDB-based API with comprehensive SEO model
2. **Admin Panel** (`admin-endpoint/`) - Next.js admin interface for managing SEO settings
3. **Frontend Application** (`Site.EndPoint/`) - React application that consumes SEO data

## Backend API Structure

### SEO Model (`Api.EndPoint/src/models/SEO.ts`)

The enhanced SEO model includes all necessary fields for comprehensive SEO management:

```typescript
interface ISEO {
  // Basic SEO fields
  title: string;
  description: string;
  keywords: string[];
  image: string;
  siteUrl: string;
  
  // School information
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  
  // Social media
  socialMedia: {
    instagram?: string;
    twitter?: string;
    telegram?: string;
    linkedin?: string;
  };
  
  // Analytics and tracking
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  bingWebmasterTools?: string;
  yandexWebmaster?: string;
  
  // Default values for pages
  defaultTitle?: string;
  defaultDescription?: string;
  defaultKeywords?: string[];
  
  // Images
  ogImage?: string;
  twitterImage?: string;
  favicon?: string;
  
  // Theme colors
  themeColor?: string;
  backgroundColor?: string;
  
  // Structured data
  structuredData?: {
    organization?: any;
    school?: any;
    localBusiness?: any;
  };
  
  // Location and business info
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
}
```

### API Endpoints

- `GET /api/seo` - Retrieve SEO data (public)
- `PUT /api/seo` - Update SEO data (requires authentication)

### SEO Controller (`Api.EndPoint/src/controllers/SEOController.ts`)

The controller provides:
- Automatic creation of default SEO data if none exists
- Comprehensive validation and error handling
- Support for all new fields

## Admin Panel Integration

### SEO Management Page (`admin-endpoint/src/app/seo/page.tsx`)

The admin panel provides a comprehensive form with sections for:

1. **Basic Information**
   - School name, title, description, keywords
   - Default values for pages

2. **Images**
   - Main image, Open Graph image, Twitter image
   - Drag & drop upload functionality

3. **Contact & Location**
   - Address, phone, email
   - Geographic coordinates
   - Opening hours

4. **Social Media**
   - Instagram, Twitter, Telegram, LinkedIn

5. **School Information**
   - Curriculum, educational level
   - Student/teacher counts
   - Awards and services

6. **Technical Settings**
   - Analytics IDs (Google Analytics, GTM)
   - Webmaster tools (Bing, Yandex)
   - Theme colors and favicon

### Features

- **Real-time validation** and error handling
- **Image upload** with preview functionality
- **Comprehensive form** with organized sections
- **Automatic saving** with success/error notifications
- **Responsive design** for all screen sizes

## Frontend Integration

### SEO Component (`Site.EndPoint/src/components/SEO.tsx`)

The frontend SEO component:

1. **Fetches data from API** on component mount
2. **Falls back to defaults** if API is unavailable
3. **Generates comprehensive meta tags** including:
   - Basic meta tags (title, description, keywords)
   - Open Graph tags
   - Twitter Card tags
   - Hreflang tags
   - Canonical URLs
   - Robots meta tags

4. **Generates structured data** (JSON-LD) for:
   - EducationalOrganization
   - School
   - Article (for news pages)
   - LocalBusiness

5. **Includes analytics scripts** when configured:
   - Google Analytics
   - Google Tag Manager
   - Bing Webmaster Tools
   - Yandex Webmaster

### Usage Example

```typescript
import SEO from '../components/SEO';

// Basic usage
<SEO
  title="صفحه اصلی"
  description="توضیحات صفحه"
  url="/"
/>

// Article usage
<SEO
  title={article.title}
  description={article.description}
  type="article"
  publishedTime={article.publishedAt}
  author={article.author}
  tags={article.tags}
  url={`/news/${article.slug}`}
/>
```

## Database Seeding

### SEO Seeding Script (`Api.EndPoint/src/scripts/seedSEO.ts`)

Run the seeding script to populate the database with comprehensive default SEO data:

```bash
cd Api.EndPoint
npm run seed:seo
# or
npx ts-node src/scripts/seedSEO.ts
```

The script includes:
- Complete school information
- Social media links
- Structured data templates
- Geographic coordinates
- Analytics placeholders

## API Response Format

### GET /api/seo Response

```json
{
  "_id": "seo_id",
  "title": "دبیرستان پسرانه معراج | مدرسه هوشمند در مشهد",
  "description": "دبیرستان پسرانه معراج، مدرسه‌ای هوشمند در مشهد...",
  "keywords": ["دبیرستان پسرانه معراج", "مدرسه هوشمند مشهد", ...],
  "image": "https://merajfutureschool.ir/images/logo.png",
  "siteUrl": "https://merajfutureschool.ir",
  "schoolName": "دبیرستان پسرانه معراج",
  "address": "بلوار دانش آموز، دانش آموز 10، مشهد مقدس",
  "phone": "+985138932030",
  "email": "info@merajschool.ir",
  "socialMedia": {
    "instagram": "https://www.instagram.com/merajschool/",
    "twitter": "@MerajSchoolIR",
    "telegram": "https://t.me/merajschool",
    "linkedin": "https://linkedin.com/company/merajschool"
  },
  "googleAnalyticsId": "G-XXXXXXXXXX",
  "googleTagManagerId": "GTM-XXXXXXX",
  "defaultTitle": "دبیرستان پسرانه معراج | مدرسه هوشمند در مشهد",
  "defaultDescription": "دبیرستان پسرانه معراج، مدرسه‌ای هوشمند...",
  "defaultKeywords": ["دبیرستان پسرانه معراج", "مدرسه هوشمند مشهد", ...],
  "ogImage": "https://merajfutureschool.ir/images/logo.png",
  "twitterImage": "https://merajfutureschool.ir/images/logo.png",
  "favicon": "https://merajfutureschool.ir/favicon.ico",
  "themeColor": "#059669",
  "backgroundColor": "#f8fafc",
  "latitude": 36.328956,
  "longitude": 59.509741,
  "openingHours": "Mo-Fr 07:30-14:30",
  "priceRange": "$$",
  "foundingDate": "1390",
  "numberOfStudents": "500+",
  "numberOfTeachers": "30+",
  "slogan": "آموزش با کیفیت، آینده‌سازی موفق",
  "awards": ["مدرسه برتر منطقه", "مدرسه هوشمند نمونه", "مدرسه سبز"],
  "serviceTypes": ["آموزش دوره اول متوسطه", "کلاس‌های تقویتی", ...],
  "curriculum": "دوره اول متوسطه",
  "educationalLevel": "دوره اول متوسطه",
  "structuredData": {
    "organization": { /* Schema.org EducationalOrganization */ },
    "school": { /* Schema.org School */ },
    "localBusiness": { /* Schema.org LocalBusiness */ }
  },
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

## Setup Instructions

### 1. Database Setup

```bash
# Run the SEO seeding script
cd Api.EndPoint
npm run seed:seo
```

### 2. Environment Variables

Ensure these environment variables are set:

```env
# Backend
MONGODB_URI=mongodb://localhost:27017/meraj-school
JWT_SECRET=your_jwt_secret

# Frontend
VITE_API_URL=http://localhost:5000

# Admin Panel
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start Services

```bash
# Backend API
cd Api.EndPoint
npm run dev

# Admin Panel
cd admin-endpoint
npm run dev

# Frontend
cd Site.EndPoint
npm run dev
```

## Benefits

1. **Centralized Management**: All SEO data managed from admin panel
2. **Dynamic Updates**: Changes reflect immediately without code deployment
3. **Comprehensive Coverage**: Includes all major SEO elements
4. **Structured Data**: Automatic Schema.org markup generation
5. **Analytics Integration**: Built-in support for major analytics platforms
6. **Fallback System**: Graceful degradation if API is unavailable
7. **Multi-language Support**: Hreflang tags for internationalization
8. **Performance Optimized**: Efficient data loading and caching

## Maintenance

### Regular Tasks

1. **Update Analytics IDs** when changing tracking systems
2. **Refresh structured data** when school information changes
3. **Monitor API performance** and optimize if needed
4. **Backup SEO data** regularly
5. **Test meta tags** using Google's Rich Results Test

### Troubleshooting

1. **API Connection Issues**: Check network connectivity and API URL
2. **Missing Meta Tags**: Verify SEO component is properly imported
3. **Structured Data Errors**: Use Google's Rich Results Test to validate
4. **Image Upload Failures**: Check file permissions and upload directory

## Future Enhancements

1. **SEO Analytics Dashboard**: Track SEO performance metrics
2. **Bulk SEO Management**: Manage multiple pages at once
3. **SEO Templates**: Pre-defined templates for different page types
4. **Automated SEO Audits**: Regular SEO health checks
5. **Competitor Analysis**: Track competitor SEO strategies
6. **Local SEO Optimization**: Enhanced local business features 
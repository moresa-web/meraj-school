// SEO Utilities for better SEO management

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url: string;
  type?: 'website' | 'article' | 'school';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

export interface StructuredDataConfig {
  type: 'Organization' | 'School' | 'Article' | 'NewsArticle' | 'WebPage' | 'BreadcrumbList';
  data: any;
}

/**
 * Generate optimized title for SEO
 */
export const generateSEOTitle = (pageTitle: string, siteName: string = 'دبیرستان پسرانه معراج'): string => {
  const maxLength = 60;
  const separator = ' | ';
  
  if (pageTitle.length + separator.length + siteName.length <= maxLength) {
    return `${pageTitle}${separator}${siteName}`;
  }
  
  const availableLength = maxLength - separator.length - siteName.length;
  return `${pageTitle.substring(0, availableLength - 3)}...${separator}${siteName}`;
};

/**
 * Generate optimized description for SEO
 */
export const generateSEODescription = (content: string, maxLength: number = 160): string => {
  if (content.length <= maxLength) {
    return content;
  }
  
  // Try to break at sentence boundary
  const truncated = content.substring(0, maxLength - 3);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastQuestion = truncated.lastIndexOf('؟');
  const lastExclamation = truncated.lastIndexOf('!');
  
  const breakPoint = Math.max(lastPeriod, lastQuestion, lastExclamation);
  
  if (breakPoint > maxLength * 0.7) {
    return content.substring(0, breakPoint + 1);
  }
  
  return `${truncated}...`;
};

/**
 * Generate optimized keywords for SEO
 */
export const generateSEOKeywords = (baseKeywords: string[], pageKeywords: string[] = []): string => {
  const allKeywords = [...baseKeywords, ...pageKeywords];
  const uniqueKeywords = [...new Set(allKeywords)];
  return uniqueKeywords.join(', ');
};

/**
 * Generate canonical URL
 */
export const generateCanonicalUrl = (path: string, baseUrl: string = 'https://merajfutureschool.ir'): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Generate Open Graph image URL
 */
export const generateOGImageUrl = (imagePath: string, baseUrl: string = 'https://merajfutureschool.ir'): string => {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Generate structured data for organization
 */
export const generateOrganizationStructuredData = (config: {
  name: string;
  description: string;
  url: string;
  logo: string;
  address: any;
  contactPoint: any;
  sameAs: string[];
  email: string;
  openingHours: string;
  geo: any;
}): StructuredDataConfig => {
  return {
    type: 'Organization',
    data: {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: config.name,
      description: config.description,
      url: config.url,
      logo: config.logo,
      address: config.address,
      contactPoint: config.contactPoint,
      sameAs: config.sameAs,
      email: config.email,
      openingHours: config.openingHours,
      geo: config.geo
    }
  };
};

/**
 * Generate structured data for articles
 */
export const generateArticleStructuredData = (config: {
  headline: string;
  description: string;
  image: string;
  url: string;
  publishedTime: string;
  modifiedTime: string;
  author: string;
  publisher: string;
  publisherLogo: string;
  section?: string;
  keywords?: string;
}): StructuredDataConfig => {
  return {
    type: 'Article',
    data: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: config.headline,
      description: config.description,
      image: config.image,
      url: config.url,
      datePublished: config.publishedTime,
      dateModified: config.modifiedTime,
      author: {
        '@type': 'Person',
        name: config.author
      },
      publisher: {
        '@type': 'Organization',
        name: config.publisher,
        logo: {
          '@type': 'ImageObject',
          url: config.publisherLogo
        }
      },
      ...(config.section && { articleSection: config.section }),
      ...(config.keywords && { keywords: config.keywords })
    }
  };
};

/**
 * Generate structured data for breadcrumbs
 */
export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{ name: string; item: string }>): StructuredDataConfig => {
  return {
    type: 'BreadcrumbList',
    data: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: breadcrumb.item
      }))
    }
  };
};

/**
 * Generate FAQ structured data
 */
export const generateFAQStructuredData = (faqs: Array<{ question: string; answer: string }>): StructuredDataConfig => {
  return {
    type: 'WebPage',
    data: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  };
};

/**
 * Generate Local Business structured data
 */
export const generateLocalBusinessStructuredData = (config: {
  name: string;
  description: string;
  url: string;
  address: any;
  telephone: string;
  email: string;
  openingHours: string;
  geo: any;
  priceRange: string;
  servesCuisine?: string;
  menu?: string;
}): StructuredDataConfig => {
  return {
    type: 'Organization',
    data: {
      '@context': 'https://schema.org',
      '@type': 'School',
      name: config.name,
      description: config.description,
      url: config.url,
      address: config.address,
      telephone: config.telephone,
      email: config.email,
      openingHours: config.openingHours,
      geo: config.geo,
      priceRange: config.priceRange
    }
  };
};

/**
 * Validate SEO configuration
 */
export const validateSEOConfig = (config: SEOConfig): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config.title || config.title.length === 0) {
    errors.push('Title is required');
  } else if (config.title.length > 60) {
    errors.push('Title should be less than 60 characters');
  }
  
  if (!config.description || config.description.length === 0) {
    errors.push('Description is required');
  } else if (config.description.length > 160) {
    errors.push('Description should be less than 160 characters');
  }
  
  if (!config.keywords || config.keywords.length === 0) {
    errors.push('Keywords are required');
  }
  
  if (!config.url || config.url.length === 0) {
    errors.push('URL is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate meta robots content
 */
export const generateRobotsContent = (noindex: boolean = false, nofollow: boolean = false): string => {
  const directives = [];
  
  if (noindex) {
    directives.push('noindex');
  } else {
    directives.push('index');
  }
  
  if (nofollow) {
    directives.push('nofollow');
  } else {
    directives.push('follow');
  }
  
  directives.push('max-image-preview:large', 'max-snippet:-1', 'max-video-preview:-1');
  
  return directives.join(', ');
};

/**
 * Generate hreflang tags
 */
export const generateHreflangTags = (url: string, languages: string[] = ['fa', 'en']): Array<{ lang: string; url: string }> => {
  const baseUrl = 'https://merajfutureschool.ir';
  
  return languages.map(lang => ({
    lang: lang === 'fa' ? 'fa' : lang,
    url: lang === 'fa' ? `${baseUrl}${url}` : `${baseUrl}/${lang}${url}`
  }));
};

/**
 * Clean URL for SEO
 */
export const cleanUrlForSEO = (url: string): string => {
  return url
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Generate reading time estimate
 */
export const generateReadingTime = (content: string, wordsPerMinute: number = 200): number => {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Generate social media meta tags
 */
export const generateSocialMetaTags = (config: {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
  siteName: string;
  twitterHandle?: string;
}) => {
  return {
    // Open Graph
    'og:title': config.title,
    'og:description': config.description,
    'og:image': config.image,
    'og:url': config.url,
    'og:type': config.type,
    'og:site_name': config.siteName,
    'og:locale': 'fa_IR',
    
    // Twitter Card
    'twitter:card': 'summary_large_image',
    'twitter:title': config.title,
    'twitter:description': config.description,
    'twitter:image': config.image,
    ...(config.twitterHandle && { 'twitter:site': config.twitterHandle }),
    ...(config.twitterHandle && { 'twitter:creator': config.twitterHandle })
  };
}; 
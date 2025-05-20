export interface SEO {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
} 
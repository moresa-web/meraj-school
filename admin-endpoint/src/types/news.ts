export interface News {
  _id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  description?: string;
  author?: {
    userId: string;
    fullName: string;
    email: string;
  };
  image?: string;
  date: string;
  tags?: string[];
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsFormData {
  title: string;
  content: string;
  category: string;
  description?: string;
  author?: string;
  image?: File;
  tags?: string[];
  isPublished: boolean;
  date?: string;
} 
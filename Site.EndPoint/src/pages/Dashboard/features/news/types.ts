export interface News {
  _id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  image?: string;
  slug: string;
  description?: string;
  author?: string;
  tags?: string[];
  isPublished?: boolean;
}

export interface NewsFormData {
  id?: string;
  title: string;
  content: string;
  category: string;
  image?: File;
  slug?: string;
  description?: string;
  author?: string;
  tags?: string[];
  isPublished?: boolean;
} 
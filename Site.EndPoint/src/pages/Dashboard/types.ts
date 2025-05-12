export interface News {
  _id: string;
  title: string;
  description: string;
  content: string;
  image?: string | File;
  date: string;
  category: string;
  views: number;
  likes: number;
  author: string;
  tags: string[];
  isPublished: boolean;
}

export interface Class {
  _id: string;
  title: string;
  teacher: string;
  schedule: string;
  description: string;
  price: number;
  level: 'مقدماتی' | 'متوسط' | 'پیشرفته';
  image?: string | File;
  category: string;
  capacity: number;
  enrolledStudents: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface NewsFormData {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  date: string;
  author: string;
  isPublished: boolean;
  image?: File;
}

export interface ClassFormData {
  title: string;
  teacher: string;
  schedule: string;
  description: string;
  price: number;
  level: 'مقدماتی' | 'متوسط' | 'پیشرفته';
  category: string;
  capacity: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  image?: File;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
}

export interface SidebarProps {
  onAddNews: () => void;
  onAddClass: () => void;
} 
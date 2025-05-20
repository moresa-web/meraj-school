export interface Class {
  id: string;
  _id: string;
  title: string;
  teacher: string;
  level: string;
  category: string;
  capacity: number;
  price: number;
  startDate: string;
  endDate: string;
  schedule: string;
  description: string;
  image: string;
  isActive: boolean;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClassFormData {
  title: string;
  teacher: string;
  level: string;
  category: string;
  capacity: number;
  price: number;
  startDate: string;
  endDate: string;
  schedule: string;
  description: string;
  image: string;
  isActive: boolean;
} 
export interface Class {
  _id: string;
  title: string;
  teacher: string;
  schedule: string;
  description: string;
  price: number;
  level: 'مقدماتی' | 'متوسط' | 'پیشرفته';
  image?: string;
  category: string;
  capacity: number;
  enrolledStudents: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
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
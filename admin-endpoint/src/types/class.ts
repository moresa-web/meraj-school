export interface Class {
  _id: string;
  title: string;
  teacher: string;
  schedule: string;
  description: string;
  price: number;
  level: string;
  image: string;
  category: string;
  views: number;
  likes: number;
  capacity: number;
  enrolledStudents: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  likedBy: string[];
  registrations: Registration[];
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  grade: string;
  registeredAt: string;
  ip: string;
}

export interface ClassFormData {
  title: string;
  teacher: string;
  schedule: string;
  description: string;
  price: number;
  level: string;
  category: string;
  capacity: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  image?: File;
} 
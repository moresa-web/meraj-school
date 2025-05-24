export interface Class {
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
  level: string;
  category: string;
  capacity: number;
  price: number;
  startDate: string;
  endDate: string;
  schedule: string;
  description: string;
  image: string | File;
  isActive: boolean;
} 
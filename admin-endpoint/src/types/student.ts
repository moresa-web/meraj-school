export interface Student {
  _id: string;
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  grade: string;
  isActive: boolean;
  registeredAt: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFormData {
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  grade: string;
  isActive: boolean;
} 
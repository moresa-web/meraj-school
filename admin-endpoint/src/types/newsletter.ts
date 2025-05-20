export interface Newsletter {
  _id: string;
  title: string;
  subject: string;
  content: string;
  sent: boolean;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
} 
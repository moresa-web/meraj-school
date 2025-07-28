export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'student' | 'teacher' | 'admin' | 'parent';
  studentPhone?: string;
  parentPhone?: string;
  grade?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  _id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  message: string;
  isRead: boolean;
  isDeleted: boolean;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

export interface Conversation {
  _id: string;
  participants: string[];
  lastMessage: ChatMessage;
  unreadCount: number;
  lastMessageTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  _id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image?: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Class {
  _id: string;
  name: string;
  description: string;
  teacher: User;
  students: User[];
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
} 
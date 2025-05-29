import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// تنظیم توکن در هدر همه درخواست‌ها
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface ChatMessage {
    id: string;
    chatId: string;
    senderId: string;
    senderName: string;
    message: string;
    isRead: boolean;
    isDeleted: boolean;
    timestamp: string;
    createdAt: string;
    updatedAt: string;
}

export interface Chat {
    id?: string;
    _id?: string;
    userId: string;
    userName: string;
    status: 'open' | 'closed';
    isClosed: boolean;
    createdAt: string;
    updatedAt: string;
}

class ChatService {
    private socket: Socket | null = null;
    private messageCallbacks: ((message: ChatMessage) => void)[] = [];
    private typingCallbacks: (() => void)[] = [];
    private user: any;

    constructor() {
        this.initializeSocket();
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
    }

    private initializeSocket() {
        this.socket = io(API_URL, {
            path: '/socket.io',
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        this.socket.on('error', (error: Error) => {
            console.error('Socket error:', error);
            toast.error('خطا در اتصال به سرور چت');
        });

        this.socket.on('newMessage', (message: ChatMessage) => {
            this.messageCallbacks.forEach(callback => callback(message));
        });

        this.socket.on('userTyping', () => {
            this.typingCallbacks.forEach(callback => callback());
        });
    }

    async getChatList(userId: string) {
        try {
            const response = await axios.get(`${API_URL}/api/chat/user/${userId}`);
            console.log(response);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching chat list:', error);
            toast.error('خطا در دریافت لیست چت‌ها');
            return [];
        }
    }

    async createChat(userId: string, userName: string) {
        try {
            const response = await axios.post(`${API_URL}/api/chat`, { userId, userName });
            return response.data;
        } catch (error) {
            console.error('Error creating chat:', error);
            toast.error('خطا در ایجاد چت جدید');
            return null;
        }
    }

    async sendMessage(chatId: string, message: string, fileData?: { url: string; type: string; name: string }) {
        try {
            const response = await axios.post(`${API_URL}/api/chat/${chatId}/messages`, {
                chatId,
                senderId: this.user?._id || 'current-user',
                senderName: this.user?.fullName || 'شما',
                message,
                fileData
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('خطا در ارسال پیام');
            throw error;
        }
    }

    onNewMessage(callback: (message: ChatMessage) => void) {
        this.messageCallbacks.push(callback);
    }

    offNewMessage(callback: (message: ChatMessage) => void) {
        this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    }

    onTyping(callback: () => void) {
        this.typingCallbacks.push(callback);
    }

    offTyping(callback: () => void) {
        this.typingCallbacks = this.typingCallbacks.filter(cb => cb !== callback);
    }

    emitTyping() {
        if (this.socket) {
            this.socket.emit('typing');
        }
    }

    async getChatById(chatId: string) {
        try {
            const response = await axios.get(`${API_URL}/api/chat/user/${this.user?._id}`);
            console.log(response);
            const chat = (response.data || []).find((c: any) => c.id === chatId || c._id === chatId);
            return chat || null;
        } catch (error) {
            console.error('Error fetching chat by id:', error);
            return null;
        }
    }

    async getChatMessages(chatId: string) {
        try {
            const response = await axios.get(`${API_URL}/api/chat/${chatId}/messages`);
            console.log(response);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching chat messages:', error);
            return [];
        }
    }
}

export const chatService = new ChatService();
export default chatService; 
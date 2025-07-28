import type { ChatMessage } from '../types/chat';
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

interface MessageStatus {
    isRead: boolean;
    status: 'sent' | 'delivered' | 'read';
    isAI?: boolean;
}

class ChatService {
    private socket: typeof Socket | null = null;
    private messageHandlers: ((message: ChatMessage) => void)[] = [];
    private typingHandlers: (() => void)[] = [];
    private user: any;

    constructor() {
        this.initializeSocket();
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
    }

    private initializeSocket() {
        this.socket = io(API_URL, {
            transports: ['websocket'],
            autoConnect: true,
        });

        this.socket.on('connect', () => {
            console.log('Connected to chat server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from chat server');
        });

        this.socket.on('error', (error: Error) => {
            console.error('Socket error:', error);
            toast.error('خطا در اتصال به سرور چت');
        });

        this.socket.on('new_message', (message: ChatMessage) => {
            this.messageHandlers.forEach(handler => handler(message));
        });

        this.socket.on('typing', () => {
            this.typingHandlers.forEach(handler => handler());
        });
    }

    public async getChatList(userId: string): Promise<any[]> {
        try {
            const response = await fetch(`${API_URL}/api/chat/list/${userId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching chat list:', error);
            return [];
        }
    }

    public async getChatMessages(chatId: string): Promise<ChatMessage[]> {
        try {
            const response = await fetch(`${API_URL}/api/chat/messages/${chatId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching chat messages:', error);
            return [];
        }
    }

    public async createChat(userId: string, userName: string): Promise<any> {
        try {
            const response = await fetch(`${API_URL}/api/chat/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, userName }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating chat:', error);
            return null;
        }
    }

    public async sendMessage(chatId: string, message: string, fileData?: { url: string; name: string; type: string }): Promise<void> {
        if (!this.socket) {
            throw new Error('Socket not initialized');
        }

        const messageData: ChatMessage = {
            _id: Date.now().toString(),
            chatId,
            message,
            senderId: 'current-user',
            senderName: 'شما',
            isRead: false,
            isDeleted: false,
            timestamp: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            ...(fileData && {
                fileUrl: fileData.url,
                fileName: fileData.name,
                fileType: fileData.type,
            }),
        };

        this.socket.emit('send_message', messageData);
    }

    public onNewMessage(handler: (message: ChatMessage) => void): void {
        this.messageHandlers.push(handler);
    }

    public offNewMessage(handler: (message: ChatMessage) => void): void {
        this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    }

    public onTyping(handler: () => void): void {
        this.typingHandlers.push(handler);
    }

    public offTyping(handler: () => void): void {
        this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
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
}

export const chatService = new ChatService();
export default chatService; 
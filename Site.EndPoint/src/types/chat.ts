export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    type: 'text' | 'file' | 'faq';
    metadata: {
        isRead: boolean;
        status: 'sent' | 'delivered' | 'read';
        isAI?: boolean;
    };
}

export interface ChatResponse {
    status: 'success' | 'error';
    message: ChatMessage;
    conversationId: string;
    error?: string;
}

export interface ConversationContext {
    lastMessages: ChatMessage[];
    userPreferences: {
        language: string;
        tone: 'formal' | 'casual';
        topics: string[];
    };
}

export interface SchoolInfo {
    name: string;
    phone: string;
    address: string;
    email: string;
    website: string;
    workingHours: string;
    socialMedia?: {
        instagram?: string;
        telegram?: string;
        whatsapp?: string;
    };
}

export interface FAQ {
    _id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
    isActive: boolean;
}

export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'support';
    timestamp: Date;
    status?: 'sent' | 'delivered' | 'read';
    attachments?: Attachment[];
}

export interface Attachment {
    id: number;
    messageId: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
}

export interface Conversation {
    id: number;
    name: string;
    avatar: string;
    message: string;
    time: Date;
    unread?: number;
    icon?: string;
}

export interface ChatState {
    conversations: Conversation[];
    selectedConversationId: number | null;
    messages: ChatMessage[];
    online: boolean;
} 
export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai' | 'bot' | 'support';
    timestamp: Date;
    type: 'text' | 'image' | 'file';
    metadata?: {
        isRead?: boolean;
        status?: 'sent' | 'delivered' | 'read';
        sentiment?: 'positive' | 'negative' | 'neutral';
        intent?: string;
        confidence?: number;
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
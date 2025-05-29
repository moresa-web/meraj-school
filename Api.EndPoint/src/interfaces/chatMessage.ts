export interface IChatMessage {
    text: string;
    context?: string;
    timestamp: Date;
    sender: 'user' | 'ai';
    type: 'text';
    metadata: {
        isRead: boolean;
        status: 'sent' | 'delivered' | 'read';
    };
} 
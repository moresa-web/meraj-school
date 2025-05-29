import React from 'react';
import { ChatMessage } from '../../services/chat.service';
import ChatMessageComponent from './ChatMessage';

interface ChatMessagesProps {
    messages: ChatMessage[];
    onDeleteMessage?: (messageId: string) => Promise<void>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, onDeleteMessage }) => {
    return (
        <div className="space-y-4">
            {messages.map((message) => (
                <ChatMessageComponent
                    key={message.id}
                    message={message}
                    onDelete={onDeleteMessage ? () => onDeleteMessage(message.id) : undefined}
                />
            ))}
        </div>
    );
};

export default ChatMessages; 
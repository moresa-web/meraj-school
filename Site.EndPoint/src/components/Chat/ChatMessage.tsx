import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '../../types/chat';

interface ChatMessageProps {
    message: Message;
    isLastMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLastMessage }) => {
    const isUser = message.sender === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                    isUser
                        ? 'bg-[#10b981] text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
            >
                <div className="text-sm">{message.text}</div>
                <div
                    className={`text-xs mt-1 ${
                        isUser ? 'text-[#b5ffe1]' : 'text-gray-500'
                    }`}
                >
                    {new Date(message.timestamp).toLocaleTimeString('fa-IR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default ChatMessage; 
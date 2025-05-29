import React from 'react';
import { Chat } from '@/services/chat.service';

interface ChatHeaderProps {
    chat: Chat | null;
    onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, onClose }) => {
    const getStatusColor = () => {
        if (!chat) return 'bg-gray-500';
        return chat.status === 'open' ? 'bg-green-500' : 'bg-red-500';
    };

    const getStatusText = () => {
        if (!chat) return 'در حال اتصال...';
        return chat.status === 'open' ? 'پشتیبانی آنلاین' : 'چت بسته شده';
    };

    return (
        <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-lg">
            <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
                <div>
                    <h3 className="font-semibold text-gray-800">
                        {getStatusText()}
                    </h3>
                    {chat?.adminName && (
                        <p className="text-xs text-gray-500">
                            پشتیبان: {chat.adminName}
                        </p>
                    )}
                        </div>
                    </div>
            <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="بستن چت"
            >
                <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                        </svg>
                    </button>
        </div>
    );
};

export default ChatHeader; 
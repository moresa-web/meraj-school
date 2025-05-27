import React from 'react';
import { Conversation } from '../../types/chat';

interface ChatConversationProps {
    conversations: Conversation[];
    selectedConversationId: number | null;
    onSelectConversation: (id: number) => void;
}

const ChatConversation: React.FC<ChatConversationProps> = ({
    conversations,
    selectedConversationId,
    onSelectConversation
}) => {
    const formatDate = (date: Date): string => {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return '';
        }

        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        const oneWeek = 7 * oneDay;

        if (diff < oneDay) {
            return date.toLocaleTimeString('fa-IR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } 
        
        if (diff < oneWeek) {
            return date.toLocaleDateString('fa-IR', { 
                weekday: 'long' 
            });
        } 
        
        return date.toLocaleDateString('fa-IR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
        e.currentTarget.src = 'https://via.placeholder.com/40';
    };

    const handleConversationClick = (id: number): void => {
        onSelectConversation(id);
    };

    const renderAvatar = (conv: Conversation): React.ReactNode => {
        if (conv.avatar) {
            return (
                <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                    onError={handleImageError}
                />
            );
        }

        return (
            <div className="w-12 h-12 rounded-full bg-[#10b981] flex items-center justify-center text-xl text-white border-2 border-white shadow">
                {conv.icon || conv.name[0]}
            </div>
        );
    };

    const renderUnreadBadge = (count: number): React.ReactNode => {
        if (count <= 0) return null;

        return (
            <div className="absolute -top-0.5 -right-0.5 flex items-center justify-center">
                <span 
                    className="min-w-[18px] h-[18px] px-1 bg-[#10b981] text-white text-[11px] font-medium rounded-full flex items-center justify-center shadow-sm"
                    aria-label={`${count} پیام نخوانده`}
                >
                    {count > 99 ? '99+' : count}
                </span>
            </div>
        );
    };

    return (
        <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
                <button
                    key={conv.id}
                    type="button"
                    onClick={() => handleConversationClick(conv.id)}
                    className={`w-full flex items-center gap-3 p-4 transition-colors duration-200 ${
                        selectedConversationId === conv.id
                            ? 'bg-[#10b981] bg-opacity-10'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <div className="relative">
                        {renderAvatar(conv)}
                        {renderUnreadBadge(conv.unreadCount)}
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {conv.name}
                            </h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap mr-2">
                                {formatDate(new Date(conv.lastMessageTime))}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                            {conv.message}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default ChatConversation; 
import React from 'react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { FiClock } from 'react-icons/fi';
import moment from 'moment';
import type { ChatMessage as ChatMessageType } from '../../types/chat';

interface ChatMessageProps {
    message: ChatMessageType;
    isOwnMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
    const { user } = useAuth();
    const isCurrentUser = message.senderId === user?._id;

    // تابع کمکی برای فرمت کردن تاریخ
    const formatDate = (dateValue: string | Date | undefined) => {
        if (!dateValue) return '--:--';
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
            console.warn('Invalid date value:', dateValue);
            return '--:--';
        }
        return format(date, 'HH:mm');
    };

    // مقدار زمان را از timestamp یا createdAt بخوان
    const dateValue = message.timestamp || message.createdAt;
    const timeString = formatDate(dateValue);

    const formattedTime = moment(message.timestamp).format('HH:mm');

    if (message.isDeleted) {
        return (
            <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-500 italic">
                    این پیام حذف شده است
                </div>
            </div>
        );
    }

    return (
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${isCurrentUser ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg px-4 py-2`}>
                {!isCurrentUser && (
                    <div className="text-xs font-semibold mb-1">{message.senderName}</div>
                )}
                <div className="break-words">{message.message}</div>
                {message.fileUrl && (
                    <div className="mt-2">
                        {message.fileType?.startsWith('image/') ? (
                            <img
                                src={message.fileUrl}
                                alt={message.fileName || 'تصویر'}
                                className="max-w-full rounded-lg"
                            />
                        ) : (
                            <a
                                href={message.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 underline"
                            >
                                {message.fileName || 'دانلود فایل'}
                            </a>
                        )}
                    </div>
                )}
                <div
                    className={`flex items-center justify-end mt-2 space-x-1 space-x-reverse ${isCurrentUser ? 'text-white/70' : 'text-gray-500'
                        }`}
                >
                    {isCurrentUser && (
                        <span className="text-xs flex items-center">
                            {message.isRead ? (
                                <span className="ml-1">✓✓</span>
                            ) : (
                                <span className="ml-1">✓</span>
                            )}
                        </span>
                    )}
                    <span className="text-xs flex items-center">
                        <FiClock className="ml-1" size={13} />
                        {formattedTime}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
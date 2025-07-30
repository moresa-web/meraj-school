import React from 'react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, Check, CheckCheck, Download, Image as ImageIcon, FileText } from 'lucide-react';
import moment from 'moment';
import type { ChatMessage as ChatMessageType } from '../../types/chat';

interface ChatMessageProps {
    message: ChatMessageType;
    isOwnMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
    const { user } = useAuth();
    
    // تشخیص پیام‌های کاربر: اگر senderId برابر 'current-user' باشد یا برابر user._id باشد
    const isCurrentUser = message.senderId === 'current-user' || message.senderId === user?._id;
    
    // تشخیص پیام‌های پشتیبان: اگر senderId برابر 'admin' باشد یا شامل 'admin' باشد
    const isAdminMessage = message.senderId === 'admin' || 
                          message.senderId?.includes('admin') || 
                          message.senderName?.includes('پشتیبان') ||
                          message.senderName?.includes('Admin') ||
                          message.senderId === 'admin-welcome';

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

    const getFileIcon = (fileType: string) => {
        if (fileType?.startsWith('image/')) {
            return <ImageIcon className="w-4 h-4" />;
        }
        return <FileText className="w-4 h-4" />;
    };

    if (message.isDeleted) {
        return (
            <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className="bg-gray-700/50 rounded-lg px-4 py-2 text-gray-400 italic border border-gray-600/50">
                    این پیام حذف شده است
                </div>
            </div>
        );
    }

    return (
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 group`}>
            <div className={`max-w-[75%] ${
                isCurrentUser 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg' 
                    : isAdminMessage 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                        : 'bg-gray-700/80 text-gray-100 border border-gray-600/50'
            } rounded-2xl px-4 py-3 relative`}>
                
                {/* Header for non-user messages */}
                {!isCurrentUser && (
                    <div className={`text-xs font-semibold mb-2 ${
                        isAdminMessage ? 'text-blue-200' : 'text-emerald-300'
                    } flex items-center gap-1`}>
                        {message.senderName}
                        {isAdminMessage && <span className="text-blue-200">👨‍💼</span>}
                    </div>
                )}
                
                {/* Message content */}
                <div className="break-words leading-relaxed text-sm">
                    {message.message}
                </div>
                
                {/* File attachment */}
                {message.fileUrl && (
                    <div className="mt-3 p-3 bg-black/20 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            {getFileIcon(message.fileType)}
                            <span className="text-xs font-medium">
                                {message.fileName || 'فایل پیوست'}
                            </span>
                        </div>
                        
                        {message.fileType?.startsWith('image/') ? (
                            <div className="relative group">
                                <img
                                    src={message.fileUrl}
                                    alt={message.fileName || 'تصویر'}
                                    className="max-w-full rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                />
                                <a
                                    href={message.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Download className="w-3 h-3" />
                                </a>
                            </div>
                        ) : (
                            <a
                                href={message.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
                            >
                                <Download className="w-3 h-3" />
                                دانلود فایل
                            </a>
                        )}
                    </div>
                )}
                
                {/* Message footer */}
                <div
                    className={`flex items-center justify-end mt-2 gap-1 ${
                        isCurrentUser 
                            ? 'text-white/70' 
                            : isAdminMessage 
                                ? 'text-blue-200' 
                                : 'text-gray-400'
                    }`}
                >
                    {/* Read status for user messages */}
                    {isCurrentUser && (
                        <span className="text-xs flex items-center">
                            {message.isRead ? (
                                <CheckCheck className="w-3 h-3 text-blue-300" />
                            ) : (
                                <Check className="w-3 h-3" />
                            )}
                        </span>
                    )}
                    
                    {/* Time */}
                    <span className="text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formattedTime}
                    </span>
                </div>
                
                {/* Message status indicator */}
                {isCurrentUser && (
                    <div className={`absolute -bottom-1 ${isCurrentUser ? 'right-4' : 'left-4'} w-2 h-2 rounded-full ${
                        message.isRead ? 'bg-blue-400' : 'bg-gray-400'
                    }`} />
                )}
            </div>
        </div>
    );
};

export default ChatMessage;
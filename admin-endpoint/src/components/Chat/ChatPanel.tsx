import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUser, FiClock, FiCheck, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

interface ChatMessage {
    id: string;
    chatId: string;
    senderId: string;
    senderName: string;
    message: string;
    isRead: boolean;
    isDeleted: boolean;
    timestamp: string;
    createdAt: string;
    updatedAt: string;
}

interface Chat {
    _id: string;
    userId: string;
    userName: string;
    status: 'open' | 'closed';
    isClosed: boolean;
    createdAt: string;
    updatedAt: string;
    lastMessage?: ChatMessage;
}

const ChatPanel: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [shouldScroll, setShouldScroll] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();
    const chatIntervalRef = useRef<NodeJS.Timeout>();
    const messagesIntervalRef = useRef<NodeJS.Timeout>();
    const prevMessagesLengthRef = useRef<number>(0);

    // انیمیشن‌های Framer Motion
    const chatListVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    const messageVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // تابع اسکرول به پایین
    const scrollToBottom = useCallback(() => {
        if (shouldScroll && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [shouldScroll]);

    // تابع دریافت لیست چت‌ها
    const fetchChats = useCallback(async () => {
        try {
            const response = await axios.get('/api/chat');
            if (response.data.success) {
                setChats(response.data.data);
            } else {
                toast.error(response.data.message || 'خطا در دریافت لیست چت‌ها');
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching chats:', error);
            toast.error('خطا در دریافت لیست چت‌ها');
        }
    }, []);

    // تابع دریافت پیام‌های یک چت
    const fetchMessages = useCallback(async (chatId: string) => {
        if (!chatId) return;

        try {
            console.log('Fetching messages for chat:', chatId);
            const response = await axios.get(`/api/chat/${chatId}/messages`);
            console.log('Messages response:', response.data);

            if (response.data.success) {
                const newMessages = response.data.data;
                const hasNewMessages = newMessages.length > prevMessagesLengthRef.current;
                setMessages(newMessages);
                prevMessagesLengthRef.current = newMessages.length;
                
                if (hasNewMessages) {
                    setShouldScroll(true);
                    scrollToBottom();
                }
            } else {
                toast.error(response.data.message || 'خطا در دریافت پیام‌ها');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('خطا در دریافت پیام‌ها');
        }
    }, [scrollToBottom]);

    // تابع ارسال پیام
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;

        try {
            const response = await axios.post(
                `/api/chat/${selectedChat._id}/messages`,
                {
                    chatId: selectedChat._id,
                    senderId: 'admin',
                    senderName: 'پشتیبان',
                    message: newMessage.trim()
                }
            );

            if (response.data.success) {
                setMessages(prev => [...prev, response.data.data]);
                setNewMessage('');
                setShouldScroll(true);
                scrollToBottom();
                fetchChats();
            } else {
                toast.error(response.data.message || 'خطا در ارسال پیام');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('خطا در ارسال پیام');
        }
    };

    // تابع بستن چت
    const handleCloseChat = async () => {
        if (!selectedChat) return;

        try {
            const response = await axios.post(
                `/api/chat/${selectedChat._id}/close`,
                {
                    adminId: 'admin',
                    adminName: 'پشتیبان'
                }
            );
            if (response.data.success) {
                toast.success('چت با موفقیت بسته شد');
                fetchChats();
            } else {
                toast.error(response.data.message || 'خطا در بستن چت');
            }
        } catch (error) {
            console.error('Error closing chat:', error);
            toast.error('خطا در بستن چت');
        }
    };

    // تابع باز کردن چت
    const handleReopenChat = async () => {
        if (!selectedChat) return;

        try {
            const response = await axios.post(
                `/api/chat/${selectedChat._id}/reopen`,
                {}
            );
            if (response.data.success) {
                toast.success('چت با موفقیت باز شد');
                fetchChats();
            } else {
                toast.error(response.data.message || 'خطا در باز کردن چت');
            }
        } catch (error) {
            console.error('Error reopening chat:', error);
            toast.error('خطا در باز کردن چت');
        }
    };

    // تابع انتخاب چت
    const handleChatSelect = (chat: Chat) => {
        console.log(chat);
        setSelectedChat(chat);
        setMessages([]); // پاک کردن پیام‌های قبلی
        if (chat._id) {
            fetchMessages(chat._id);
        }
    };

    // تابع فرمت‌بندی تاریخ
    const formatDate = (date: string) => {
        try {
            if (!date) return '';
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) return '';
            return format(dateObj, 'HH:mm', { locale: faIR });
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    // تنظیم interval‌ها
    useEffect(() => {
        setMounted(true);
        return () => {
            if (chatIntervalRef.current) clearInterval(chatIntervalRef.current);
            if (messagesIntervalRef.current) clearInterval(messagesIntervalRef.current);
        };
    }, []);

    // به‌روزرسانی لیست چت‌ها
    useEffect(() => {
        if (mounted) {
            fetchChats();
            chatIntervalRef.current = setInterval(fetchChats, 10000);
            return () => {
                if (chatIntervalRef.current) clearInterval(chatIntervalRef.current);
            };
        }
    }, [mounted, fetchChats]);

    // به‌روزرسانی پیام‌ها
    useEffect(() => {
        if (mounted && selectedChat?._id) {
            fetchMessages(selectedChat._id);
            messagesIntervalRef.current = setInterval(() => fetchMessages(selectedChat._id), 5000);
            return () => {
                if (messagesIntervalRef.current) clearInterval(messagesIntervalRef.current);
            };
        }
    }, [mounted, selectedChat?._id, fetchMessages]);

    // اضافه کردن event listener برای اسکرول
    useEffect(() => {
        const messagesContainer = document.querySelector('.overflow-y-auto');
        if (messagesContainer) {
            const handleScroll = () => {
                const { scrollTop, scrollHeight, clientHeight } = messagesContainer as HTMLElement;
                const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
                setShouldScroll(isAtBottom);
            };

            messagesContainer.addEventListener('scroll', handleScroll);
            return () => {
                messagesContainer.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] mt-16 bg-gray-100">
            {/* لیست چت‌ها */}
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={chatListVariants}
                className={`w-full lg:w-1/3 bg-white border-l border-gray-200 shadow-lg ${
                    selectedChat ? 'hidden lg:block' : 'block'
                }`}
            >
                <div className="p-4 border-b border-gray-200 bg-emerald-50">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <FiMessageSquare className="ml-2" />
                        گفتگوها
                    </h2>
                </div>
                <div className="overflow-y-auto h-[calc(100vh-8rem)]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                        </div>
                    ) : (
                        <AnimatePresence>
                            {chats.map((chat) => (
                                <motion.div
                                    key={`chat-${chat._id || Math.random()}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onClick={() => handleChatSelect(chat)}
                                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
                                        selectedChat?._id === chat._id ? 'bg-emerald-50 border-r-4 border-r-emerald-500' : ''
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 ml-2 flex-shrink-0" />
                                                <h3 className="font-medium text-gray-800 truncate">{chat.userName}</h3>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate mt-1 pr-2">
                                                {chat.lastMessage?.message || 'بدون پیام'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end flex-shrink-0 ml-2">
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {chat.lastMessage ? formatDate(chat.lastMessage.timestamp) : ''}
                                            </span>
                                            {!chat.lastMessage?.isRead && (
                                                <span className="mt-1 px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full whitespace-nowrap">
                                                    جدید
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </motion.div>

            {/* بخش چت */}
            <div className={`flex-1 flex flex-col ${selectedChat ? 'block' : 'hidden lg:block'}`}>
                {selectedChat ? (
                    <>
                        {/* هدر چت */}
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-white border-b border-gray-200 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => setSelectedChat(null)}
                                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <FiCheckCircle className="h-5 w-5 text-gray-500" />
                                    </button>
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <FiUser className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">{selectedChat.userName}</h3>
                                        <p className="text-sm text-gray-500 flex items-center">
                                            <span className={`w-2 h-2 rounded-full ${selectedChat.status === 'open' ? 'bg-emerald-500' : 'bg-red-500'} ml-1`} />
                                            {selectedChat.status === 'open' ? 'آنلاین' : 'آفلاین'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={selectedChat.status === 'open' ? handleCloseChat : handleReopenChat}
                                        className={`px-3 py-1 rounded-lg text-sm flex items-center transition-all duration-200 ${
                                            selectedChat.status === 'open'
                                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                                : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                                        }`}
                                    >
                                        {selectedChat.status === 'open' ? (
                                            <>
                                                <FiCheckCircle className="ml-1" />
                                                <span className="hidden sm:inline">بستن چت</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiCheckCircle className="ml-1" />
                                                <span className="hidden sm:inline">باز کردن چت</span>
                                            </>
                                        )}
                                    </button>
                                    <span className="text-sm text-gray-500 hidden sm:inline">
                                        {selectedChat.createdAt && formatDate(selectedChat.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* پیام‌ها */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            <AnimatePresence>
                                {messages.map((message) => {
                                    const isAdmin = message.senderId === 'admin';
                                    return (
                                        <motion.div
                                            key={`message-${message.id || Math.random()}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-4`}
                                        >
                                            <div
                                                className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-3 shadow-sm ${
                                                    isAdmin
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-white text-gray-800'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-sm font-medium">
                                                        {message.senderName}
                                                    </span>
                                                    <span className="text-xs opacity-75">
                                                        {formatDate(message.timestamp)}
                                                    </span>
                                                </div>
                                                <p className="text-sm break-words">{message.message}</p>
                                                {isAdmin && message.isRead && (
                                                    <div className="flex justify-end mt-1">
                                                        <FiCheckCircle className="text-white opacity-75" size={14} />
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                            {isTyping && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center space-x-2 text-gray-500 mt-2"
                                >
                                    <span>در حال تایپ...</span>
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* ورودی پیام */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-white border-t border-gray-200 shadow-lg"
                        >
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="پیام خود را بنویسید..."
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    <FiSend className="transform hover:scale-110 transition-transform duration-200" />
                                </button>
                            </div>
                        </motion.div>
                    </>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex items-center justify-center bg-gray-50"
                    >
                        <div className="text-center">
                            <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">گفتگویی انتخاب نشده</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                برای شروع گفتگو، یک کاربر را از لیست انتخاب کنید
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ChatPanel; 
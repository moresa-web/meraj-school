import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMinimize2, FiX, FiMessageSquare, FiHelpCircle, FiShare2, FiUser, FiClock, FiMaximize2, FiInstagram, FiSend, FiTwitter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { chatService, ChatMessage as ChatMessageType } from '../../services/chat.service';
import { useAuth } from '../../contexts/AuthContext';

interface FAQ {
    _id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ChatBoxProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'faq' | 'social'>('chat');
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatIdRef = useRef<string | null>(null);
    const [onlineStatus, setOnlineStatus] = useState<'online' | 'offline'>('offline');
    const typingTimeoutRef = useRef<NodeJS.Timeout>();
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [activeChat, setActiveChat] = useState<ChatMessageType | null>(null);

    useEffect(() => {
        const initializeChat = async () => {
            try {
                setIsLoading(true);
                if (!user?._id || !user?.fullName) {
                    toast.error('اطلاعات کاربر یافت نشد');
                    setIsLoading(false);
                    return;
                }
                const chatList = await chatService.getChatList(user._id);
                console.log('Chat List:', chatList);
                
                if (chatList && chatList.length > 0) {
                    const activeChat = chatList[0];
                    console.log('Active Chat:', activeChat);
                    
                    chatIdRef.current = activeChat._id;
                    setActiveChatId(activeChat._id);
                    setOnlineStatus('online');
                    
                    // دریافت پیام‌های چت
                    const messages = await chatService.getChatMessages(activeChat._id);
                    console.log('Raw Chat Messages:', messages);
                    
                    if (messages && messages.length > 0) {
                        const formattedMessages = messages.map((msg: any) => {
                            console.log('Processing message:', msg);
                            return {
                                id: msg._id,
                                chatId: msg.chatId,
                                message: msg.message,
                                senderId: msg.senderId,
                                senderName: msg.senderName,
                                isRead: msg.isRead,
                                isDeleted: msg.isDeleted,
                                timestamp: msg.timestamp,
                                createdAt: msg.createdAt,
                                updatedAt: msg.updatedAt
                            };
                        });
                        console.log('Formatted Messages:', formattedMessages);
                        setMessages(formattedMessages.reverse());
                    }
                } else {
                    const newChat = await chatService.createChat(user._id, user.fullName);
                    if (newChat) {
                        chatIdRef.current = newChat._id;
                        setActiveChatId(newChat._id);
                        setOnlineStatus('online');
                    }
                }
            } catch (error) {
                console.error('Error initializing chat:', error);
                toast.error('خطا در راه‌اندازی چت');
            } finally {
                setIsLoading(false);
            }
        };

        initializeChat();

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [user?._id, user?.fullName]);

    useEffect(() => {
        if (activeTab === 'faq') {
            fetchFaqs();
        }
    }, [activeTab]);

    useEffect(() => {
        const handleNewMessage = (message: ChatMessageType) => {
            console.log('New message received:', message);
            const formattedMessage = {
                id: message._id,
                chatId: message.chatId,
                message: message.message,
                senderId: message.senderId,
                senderName: message.senderName,
                isRead: message.isRead,
                isDeleted: message.isDeleted,
                timestamp: message.timestamp,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt
            };
            console.log('Formatted new message:', formattedMessage);
            setMessages(prev => [...prev, formattedMessage]);
            if (!isOpen) {
                toast.success('پیام جدید دریافت شد', {
                    icon: '📬',
                    style: {
                        background: '#064e3b',
                        color: '#fff',
                    },
                });
            }
            scrollToBottom();
        };

        const handleTyping = () => {
            setIsTyping(true);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(false);
            }, 3000);
        };

        chatService.onNewMessage(handleNewMessage);
        chatService.onTyping(handleTyping);

        return () => {
            chatService.offNewMessage(handleNewMessage);
            chatService.offTyping(handleTyping);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [isOpen]);

    const fetchFaqs = async () => {
        try {
            setIsLoadingFaqs(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/faq`);
            setFaqs(response.data.data.data);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            toast.error('خطا در دریافت سوالات متداول', {
                icon: '❌',
                style: {
                    background: '#dc2626',
                    color: '#fff',
                },
            });
        } finally {
            setIsLoadingFaqs(false);
        }
    };

    const handleSendMessage = async (message: string, fileData?: { url: string; name: string; type: string }) => {
        try {
            if (!message.trim() && !fileData) return;
            if (!chatIdRef.current) {
                toast.error('خطا در ارسال پیام: چت فعال نیست');
                return;
            }

            const newMessage: ChatMessageType = {
                id: Date.now().toString(),
                chatId: chatIdRef.current,
                message,
                senderId: 'current-user',
                senderName: 'شما',
                isRead: false,
                isDeleted: false,
                timestamp: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            setMessages(prev => [...prev, newMessage]);
            await chatService.sendMessage(chatIdRef.current, message, fileData);

            if (activeChatId) {
                localStorage.setItem('activeChatId', activeChatId);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('خطا در ارسال پیام');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        console.log('Current messages state:', messages);
    }, [messages]);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-4 rounded-t-lg flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-white font-semibold">پشتیبانی آنلاین</h3>
                                <span className={`w-2 h-2 rounded-full ${onlineStatus === 'online' ? 'bg-green-400' : 'bg-red-400'}`} />
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="text-white hover:text-emerald-100 transition-colors"
                                >
                                    {isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-white hover:text-emerald-100 transition-colors"
                                >
                                    <FiX />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Tabs */}
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-2 flex space-x-2">
                                    <button
                                        onClick={() => setActiveTab('chat')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            activeTab === 'chat'
                                                ? 'bg-white text-emerald-600 shadow-md scale-105'
                                                : 'text-gray-600 hover:bg-white hover:bg-opacity-50'
                                        }`}
                                    >
                                        چت آنلاین
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('faq')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            activeTab === 'faq'
                                                ? 'bg-white text-emerald-600 shadow-md scale-105'
                                                : 'text-gray-600 hover:bg-white hover:bg-opacity-50'
                                        }`}
                                    >
                                        سوالات متداول
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('social')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            activeTab === 'social'
                                                ? 'bg-white text-emerald-600 shadow-md scale-105'
                                                : 'text-gray-600 hover:bg-white hover:bg-opacity-50'
                                        }`}
                                    >
                                        شبکه‌های اجتماعی
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-4">
                                    {activeTab === 'chat' && (
                                        <div className="space-y-4">
                                            {isLoading ? (
                                                <div className="flex justify-center items-center h-full">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                                                </div>
                                            ) : (
                                                <>
                                                    {messages.map((message) => {
                                                        const isOwnMessage = message.senderId === 'current-user';
                                                        return (
                                                            <ChatMessage
                                                                key={message.id}
                                                                message={message}
                                                                isOwnMessage={isOwnMessage}
                                                            />
                                                        );
                                                    })}
                                                    {isTyping && (
                                                        <div className="flex items-center space-x-2 text-gray-500">
                                                            <span>در حال تایپ...</span>
                                                            <div className="flex space-x-1">
                                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div ref={messagesEndRef} />
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'faq' && (
                                        <div className="space-y-4">
                                            {isLoadingFaqs ? (
                                                <div className="flex justify-center items-center h-full">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                                                </div>
                                            ) : (
                                                faqs
                                                    .filter(faq => faq.isActive)
                                                    .sort((a, b) => a.order - b.order)
                                                    .map((faq) => (
                                                        <div
                                                            key={faq._id}
                                                            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                                                        >
                                                            <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                                                            <p className="text-gray-600">{faq.answer}</p>
                                                            <span className="text-xs text-gray-400 mt-2 block">{faq.category}</span>
                                                        </div>
                                                    ))
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'social' && (
                                        <div className="space-y-4">
                                            <a
                                                href="https://instagram.com/your-account"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors"
                                            >
                                                <FiInstagram size={24} />
                                                <span>اینستاگرام</span>
                                            </a>
                                            <a
                                                href="https://twitter.com/your-account"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 text-blue-400 hover:text-blue-500 transition-colors"
                                            >
                                                <FiTwitter size={24} />
                                                <span>توییتر</span>
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {activeTab === 'chat' && (
                                    <div className="border-t p-4">
                                        <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatBox;
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMinimize2, FiX, FiMessageSquare, FiHelpCircle, FiShare2, FiUser, FiClock, FiMaximize2, FiInstagram, FiSend, FiTwitter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { chatService } from '../../services/chat.service';
import type { ChatMessage as ChatMessageType } from '../../types/chat';
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
    const [hasShownWelcome, setHasShownWelcome] = useState(false);

    const initializeChat = async () => {
        try {
            setIsLoading(true);
            
            // اگر user از AuthContext موجود نیست، از localStorage دریافت کن
            let currentUser = user;
            if (!currentUser?._id || !currentUser?.username) {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    currentUser = JSON.parse(storedUser);
                }
            }
            
            if (!currentUser?._id || !currentUser?.username) {
                // اگر هنوز user موجود نیست، یک user موقت ایجاد کن
                currentUser = {
                    _id: 'guest-' + Date.now(),
                    username: 'کاربر مهمان',
                    email: 'guest@example.com'
                };
            }
            
            const chatList = await chatService.getChatList(currentUser._id);
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
                        return {
                            _id: msg._id,
                            chatId: msg.chatId,
                            message: msg.message,
                            senderId: msg.senderId,
                            senderName: msg.senderName,
                            isRead: msg.isRead,
                            isDeleted: msg.isDeleted,
                            timestamp: new Date(msg.timestamp),
                            createdAt: new Date(msg.createdAt),
                            updatedAt: new Date(msg.updatedAt),
                            fileUrl: msg.fileUrl,
                            fileName: msg.fileName,
                            fileType: msg.fileType,
                        };
                    });
                    console.log('Formatted Messages:', formattedMessages);
                    setMessages(formattedMessages.reverse());
                    setHasShownWelcome(true);
                } else if (!hasShownWelcome) {
                    // اگر هیچ پیامی وجود ندارد و هنوز پیام پیشفرض نمایش داده نشده، پیام پیشفرض نمایش بده
                    const welcomeMessage: ChatMessageType = {
                        _id: 'welcome-message',
                        chatId: activeChat._id,
                        message: 'سلام! 👋 به پشتیبانی آنلاین دبیرستان معراج خوش آمدید. چطور می‌تونم کمکتون کنم؟',
                        senderId: 'admin-welcome',
                        senderName: 'پشتیبانی آنلاین',
                        isRead: false,
                        isDeleted: false,
                        timestamp: new Date(),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    setMessages([welcomeMessage]);
                    setHasShownWelcome(true);
                }
            } else {
                const newChat = await chatService.createChat(currentUser._id, currentUser.username);
                if (newChat) {
                    chatIdRef.current = newChat._id;
                    setActiveChatId(newChat._id);
                    setOnlineStatus('online');
                    
                    // پیام پیشفرض برای چت جدید
                    const welcomeMessage: ChatMessageType = {
                        _id: 'welcome-message',
                        chatId: newChat._id,
                        message: 'سلام! 👋 به پشتیبانی آنلاین دبیرستان معراج خوش آمدید. چطور می‌تونم کمکتون کنم؟',
                        senderId: 'admin-welcome',
                        senderName: 'پشتیبانی آنلاین',
                        isRead: false,
                        isDeleted: false,
                        timestamp: new Date(),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    setMessages([welcomeMessage]);
                    setHasShownWelcome(true);
                }
            }
        } catch (error) {
            console.error('Error initializing chat:', error);
            toast.error('خطا در راه‌اندازی چت');
            
            // در صورت خطا، پیام پیشفرض نمایش بده
            if (!hasShownWelcome) {
                const errorWelcomeMessage: ChatMessageType = {
                    _id: 'error-welcome-message',
                    chatId: 'error-chat',
                    message: 'سلام! 👋 به پشتیبانی آنلاین دبیرستان معراج خوش آمدید. در حال حاضر در حال اتصال به سرور هستیم...',
                    senderId: 'admin-welcome',
                    senderName: 'پشتیبانی آنلاین',
                    isRead: false,
                    isDeleted: false,
                    timestamp: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                setMessages([errorWelcomeMessage]);
                setHasShownWelcome(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setHasShownWelcome(false);
            initializeChat();
        }
    }, [isOpen]);

    useEffect(() => {
        if (activeTab === 'faq') {
            fetchFaqs();
        }
    }, [activeTab]);

    useEffect(() => {
        const handleNewMessage = (message: ChatMessageType) => {
            console.log('New message received:', message);
            setMessages(prev => [...prev, message]);
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

        // وقتی چت باز می‌شود، پیام‌های جدید را فوراً دریافت کن
        const fetchLatestMessages = async () => {
            if (activeChatId && isOpen) {
                try {
                    const messages = await chatService.getChatMessages(activeChatId);
                    if (messages && messages.length > 0) {
                        const formattedMessages = messages.map((msg: any) => ({
                            _id: msg._id,
                            chatId: msg.chatId,
                            message: msg.message,
                            senderId: msg.senderId,
                            senderName: msg.senderName,
                            isRead: msg.isRead,
                            isDeleted: msg.isDeleted,
                            timestamp: new Date(msg.timestamp),
                            createdAt: new Date(msg.createdAt),
                            updatedAt: new Date(msg.updatedAt),
                            fileUrl: msg.fileUrl,
                            fileName: msg.fileName,
                            fileType: msg.fileType,
                        }));

                        setMessages(prevMessages => {
                            const existingIds = new Set(prevMessages.map(m => m._id));
                            const newMessages = formattedMessages.filter(msg => !existingIds.has(msg._id));
                            
                            if (newMessages.length > 0) {
                                console.log('New messages found on chat open:', newMessages);
                                // اگر پیام جدید از پشتیبان است، notification نمایش بده
                                const adminMessages = newMessages.filter(msg => 
                                    msg.senderId?.includes('admin') ||
                                    msg.senderName?.includes('پشتیبان')
                                );
                                if (adminMessages.length > 0 && !isOpen) {
                                    toast.success('پیام جدید از پشتیبان دریافت شد', {
                                        icon: '👨‍💼',
                                        style: {
                                            background: '#1e40af',
                                            color: '#fff',
                                        },
                                    });
                                }
                                
                                // اگر پیام‌های واقعی دریافت شد، پیام پیشفرض را حذف کن
                                const realMessages = newMessages.filter(msg => 
                                    !msg._id.includes('welcome-message') && 
                                    !msg._id.includes('error-welcome-message')
                                );
                                
                                if (realMessages.length > 0) {
                                    const updatedMessages = prevMessages.filter(msg => 
                                        !msg._id.includes('welcome-message') && 
                                        !msg._id.includes('error-welcome-message')
                                    );
                                    return [...updatedMessages, ...newMessages];
                                } else {
                                    return [...prevMessages, ...newMessages];
                                }
                            }
                            return prevMessages;
                        });
                    }
                } catch (error) {
                    console.error('Error fetching latest messages:', error);
                }
            }
        };

        // Polling برای دریافت پیام‌های جدید
        let pollingInterval: NodeJS.Timeout;
        if (activeChatId && isOpen) {
            console.log('Starting polling for chat:', activeChatId);
            
            // فوراً پیام‌های جدید را دریافت کن
            fetchLatestMessages();
            
            pollingInterval = setInterval(async () => {
                try {
                    const messages = await chatService.getChatMessages(activeChatId);
                    if (messages && messages.length > 0) {
                        const formattedMessages = messages.map((msg: any) => ({
                            _id: msg._id,
                            chatId: msg.chatId,
                            message: msg.message,
                            senderId: msg.senderId,
                            senderName: msg.senderName,
                            isRead: msg.isRead,
                            isDeleted: msg.isDeleted,
                            timestamp: new Date(msg.timestamp),
                            createdAt: new Date(msg.createdAt),
                            updatedAt: new Date(msg.updatedAt),
                            fileUrl: msg.fileUrl,
                            fileName: msg.fileName,
                            fileType: msg.fileType,
                        }));

                        // فقط پیام‌های جدید را اضافه کن
                        setMessages(prevMessages => {
                            const existingIds = new Set(prevMessages.map(m => m._id));
                            const newMessages = formattedMessages.filter(msg => !existingIds.has(msg._id));
                            
                            if (newMessages.length > 0) {
                                console.log('New messages found:', newMessages);
                                // اگر پیام جدید از کاربر دیگری است، notification نمایش بده
                                const otherUserMessages = newMessages.filter(msg => 
                                    msg.senderId !== 'current-user' && 
                                    msg.senderId !== user?._id &&
                                    !msg.senderId?.includes('admin') &&
                                    !msg.senderName?.includes('پشتیبان')
                                );
                                if (otherUserMessages.length > 0 && !isOpen) {
                                    toast.success('پیام جدید دریافت شد', {
                                        icon: '📬',
                                        style: {
                                            background: '#064e3b',
                                            color: '#fff',
                                        },
                                    });
                                }
                                
                                // اگر پیام‌های واقعی دریافت شد، پیام پیشفرض را حذف کن
                                const realMessages = newMessages.filter(msg => 
                                    !msg._id.includes('welcome-message') && 
                                    !msg._id.includes('error-welcome-message')
                                );
                                
                                if (realMessages.length > 0) {
                                    const updatedMessages = prevMessages.filter(msg => 
                                        !msg._id.includes('welcome-message') && 
                                        !msg._id.includes('error-welcome-message')
                                    );
                                    const finalMessages = [...updatedMessages, ...newMessages];
                                    // بعد از به‌روزرسانی پیام‌ها، scroll به پایین
                                    setTimeout(() => scrollToBottom(), 100);
                                    return finalMessages;
                                } else {
                                    const updatedMessages = [...prevMessages, ...newMessages];
                                    // بعد از به‌روزرسانی پیام‌ها، scroll به پایین
                                    setTimeout(() => scrollToBottom(), 100);
                                    return updatedMessages;
                                }
                            }
                            return prevMessages;
                        });
                    }
                } catch (error) {
                    console.error('Error polling for new messages:', error);
                }
            }, 2000); // هر 2 ثانیه چک کن (کمتر از قبل برای real-time بهتر)
        } else {
            console.log('Stopping polling - chat not open or no active chat');
        }

        chatService.onNewMessage(handleNewMessage);
        chatService.onTyping(handleTyping);

        return () => {
            chatService.offNewMessage(handleNewMessage);
            chatService.offTyping(handleTyping);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [isOpen, activeChatId]);

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

            const tempMessageId = Date.now().toString();
            const newMessage: ChatMessageType = {
                _id: tempMessageId,
                chatId: chatIdRef.current,
                message,
                senderId: 'current-user',
                senderName: 'شما',
                isRead: false,
                isDeleted: false,
                timestamp: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                ...(fileData && { fileUrl: fileData.url, fileName: fileData.name, fileType: fileData.type }),
            };

            // فوراً پیام را در UI نمایش بده
            setMessages(prev => [...prev, newMessage]);
            scrollToBottom();

            // پیام را به سرور ارسال کن
            await chatService.sendMessage(chatIdRef.current, message, fileData);

            // بعد از ارسال موفق، پیام موقت را با پیام واقعی از سرور جایگزین کن
            setTimeout(async () => {
                try {
                    const messages = await chatService.getChatMessages(chatIdRef.current!);
                    if (messages && messages.length > 0) {
                        const latestMessage = messages[messages.length - 1];
                        if (latestMessage && latestMessage.message === message) {
                            setMessages(prev => prev.map(msg => 
                                msg._id === tempMessageId 
                                    ? {
                                        ...msg,
                                        _id: latestMessage._id,
                                        timestamp: new Date(latestMessage.timestamp),
                                        createdAt: new Date(latestMessage.createdAt),
                                        updatedAt: new Date(latestMessage.updatedAt),
                                    }
                                    : msg
                            ));
                        }
                    }
                } catch (error) {
                    console.error('Error updating message with server response:', error);
                }
            }, 1000);

            if (activeChatId) {
                localStorage.setItem('activeChatId', activeChatId);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('خطا در ارسال پیام');
            
            // در صورت خطا، پیام موقت را حذف کن
            setMessages(prev => prev.filter(msg => msg._id !== Date.now().toString()));
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
                                    <FiMaximize2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-white hover:text-emerald-100 transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
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
                                                        const isOwnMessage = message.senderId === 'current-user' || message.senderId === user?._id;
                                                        return (
                                                            <ChatMessage
                                                                key={message._id}
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
                                                <FiInstagram className="w-5 h-5" />
                                                <span>اینستاگرام</span>
                                            </a>
                                            <a
                                                href="https://twitter.com/your-account"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 text-blue-400 hover:text-blue-500 transition-colors"
                                            >
                                                <FiTwitter className="w-5 h-5" />
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
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Minimize2, 
  X, 
  MessageSquare, 
  HelpCircle, 
  Share2, 
  User, 
  Clock, 
  Maximize2, 
  Instagram, 
  Send, 
  Twitter,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  FileText,
  Image as ImageIcon,
  Download
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { chatService } from '../../services/chat.service';
import type { ChatMessage as ChatMessageType } from '../../types/chat';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

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
    console.log('ChatBox rendered, isOpen:', isOpen);
    const { user } = useAuth();
    
    useEffect(() => {
        console.log('isOpen changed to:', isOpen);
    }, [isOpen]);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'faq' | 'social' | 'contact'>('chat');
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);
    const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set());
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
            // استفاده از URL مستقیم backend
            const apiUrl = 'http://localhost:5000'; // Hardcoded برای تست
            const response = await axios.get(`${apiUrl}/api/faq`);
            console.log('FAQ Response:', response.data);
            console.log('API URL used:', `${apiUrl}/api/faq`);
            
            // بررسی ساختار response و استخراج داده‌ها
            let faqData;
            if (response.data && response.data.data) {
                // اگر response.data.data موجود است
                faqData = response.data.data;
                console.log('FAQ data from response.data.data:', faqData);
            } else if (response.data && Array.isArray(response.data)) {
                // اگر response.data مستقیماً آرایه است
                faqData = response.data;
                console.log('FAQ data from response.data (array):', faqData);
            } else {
                // اگر هیچ‌کدام نباشد، آرایه خالی
                faqData = [];
                console.log('No FAQ data found, using empty array');
            }
            
            const finalFaqs = Array.isArray(faqData) ? faqData : [];
            console.log('Final FAQs to set:', finalFaqs);
            setFaqs(finalFaqs);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            console.error('Error details:', error.response?.data || error.message);
            toast.error('خطا در دریافت سوالات متداول', {
                icon: '❌',
                style: {
                    background: '#dc2626',
                    color: '#fff',
                },
            });
            setFaqs([]);
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

    const toggleFaq = (faqId: string) => {
        setExpandedFaqs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(faqId)) {
                newSet.delete(faqId);
            } else {
                newSet.add(faqId);
            }
            return newSet;
        });
    };

    const handleFaqClick = (faq: FAQ) => {
        if (chatIdRef.current) {
            handleSendMessage(`سوال: ${faq.question}\n\nپاسخ: ${faq.answer}`);
            setActiveTab('chat');
        }
    };

    return (
        <div className="fixed inset-0 md:bottom-4 md:right-4 md:inset-auto z-50">
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full h-full md:w-96 md:h-[600px] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 md:rounded-2xl md:shadow-2xl flex flex-col border border-gray-700"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-4 rounded-t-2xl flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5 text-white" />
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                        onlineStatus === 'online' ? 'bg-green-400' : 'bg-red-400'
                                    }`} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">پشتیبانی آنلاین</h3>
                                    <p className="text-white/80 text-xs">
                                        {onlineStatus === 'online' ? 'آنلاین' : 'آفلاین'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-white hover:bg-white/20 rounded-full p-2"
                                >
                                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                                </Button>
                                <Button
                                    onClick={onClose}
                                    variant="ghost"
                                    size="sm"
                                    className="text-white hover:bg-white/20 rounded-full p-2"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Tabs */}
                                <div className="bg-gray-800/50 p-2">
                                    <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
                                        {[
                                            { id: 'chat', label: 'چت آنلاین', icon: MessageSquare },
                                            { id: 'faq', label: 'سوالات متداول', icon: HelpCircle },
                                            { id: 'contact', label: 'اطلاعات تماس', icon: Phone },
                                            { id: 'social', label: 'شبکه‌های اجتماعی', icon: Share2 }
                                        ].map((tab) => (
                                            <Button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id as any)}
                                                variant={activeTab === tab.id ? "default" : "ghost"}
                                                size="sm"
                                                className={`flex-shrink-0 h-8 text-xs font-medium transition-all whitespace-nowrap ${
                                                    activeTab === tab.id
                                                        ? 'bg-emerald-600 text-white shadow-md'
                                                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                                }`}
                                            >
                                                <tab.icon className="w-3 h-3 ml-1" />
                                                {tab.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {activeTab === 'chat' && (
                                        <div className="space-y-4">
                                            {isLoading ? (
                                                <div className="flex justify-center items-center h-full">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
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
                                                        <div className="flex items-center space-x-2 text-gray-400 bg-gray-700/50 rounded-lg p-3">
                                                            <div className="flex space-x-1">
                                                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                                                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100" />
                                                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200" />
                                                            </div>
                                                            <span className="text-sm">در حال تایپ...</span>
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
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
                                                </div>
                                            ) : (
                                                (() => {
                                                    console.log('All FAQs:', faqs);
                                                    const activeFaqs = faqs.filter(faq => faq.isActive);
                                                    console.log('Active FAQs:', activeFaqs);
                                                    const sortedFaqs = activeFaqs.sort((a, b) => a.order - b.order);
                                                    console.log('Sorted FAQs:', sortedFaqs);
                                                    
                                                    return sortedFaqs.length === 0 ? (
                                                        <Card className="bg-gray-800/50 border-gray-700">
                                                            <CardContent className="flex flex-col items-center justify-center h-32 text-center">
                                                                <HelpCircle className="w-12 h-12 text-gray-400 mb-4" />
                                                                <h3 className="text-lg font-semibold text-gray-300 mb-2">سوالات متداول</h3>
                                                                <p className="text-gray-400 text-sm">در حال حاضر سوالات متداول در دسترس نیستند.</p>
                                                                <p className="text-gray-500 text-xs mt-2">لطفاً از طریق چت آنلاین با ما در تماس باشید.</p>
                                                            </CardContent>
                                                        </Card>
                                                    ) : (
                                                        sortedFaqs.map((faq) => (
                                                            <Card 
                                                                key={faq._id}
                                                                className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                                                                onClick={() => toggleFaq(faq._id)}
                                                            >
                                                                <CardHeader className="pb-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <CardTitle className="text-sm font-semibold text-white">
                                                                            {faq.question}
                                                                        </CardTitle>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-gray-400 hover:text-white"
                                                                        >
                                                                            {expandedFaqs.has(faq._id) ? (
                                                                                <ChevronUp className="w-4 h-4" />
                                                                            ) : (
                                                                                <ChevronDown className="w-4 h-4" />
                                                                            )}
                                                                        </Button>
                                                                    </div>
                                                                </CardHeader>
                                                                <AnimatePresence>
                                                                    {expandedFaqs.has(faq._id) && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, height: 0 }}
                                                                            animate={{ opacity: 1, height: "auto" }}
                                                                            exit={{ opacity: 0, height: 0 }}
                                                                            transition={{ duration: 0.3 }}
                                                                        >
                                                                            <CardContent className="pt-0">
                                                                                <p className="text-gray-300 text-sm mb-3">{faq.answer}</p>
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                                                                                        {faq.category}
                                                                                    </span>
                                                                                    <Button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleFaqClick(faq);
                                                                                        }}
                                                                                        size="sm"
                                                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                                                                                    >
                                                                                        ارسال در چت
                                                                                    </Button>
                                                                                </div>
                                                                            </CardContent>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </Card>
                                                        ))
                                                    );
                                                })()
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'contact' && (
                                        <div className="space-y-4">
                                            <Card className="bg-gray-800/50 border-gray-700">
                                                <CardHeader>
                                                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                                        <Phone className="w-5 h-5 text-emerald-400" />
                                                        اطلاعات تماس
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                                                        <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                                        <div>
                                                            <div className="text-sm text-gray-400">تلفن تماس</div>
                                                            <div className="text-white font-medium">۰۲۱-۱۲۳۴۵۶۷۸</div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                                                        <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                                        <div>
                                                            <div className="text-sm text-gray-400">ایمیل</div>
                                                            <div className="text-white font-medium">info@merajschool.ir</div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                                                        <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                                        <div>
                                                            <div className="text-sm text-gray-400">آدرس</div>
                                                            <div className="text-white font-medium">تهران، خیابان ولیعصر</div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                                                        <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                                                        <div>
                                                            <div className="text-sm text-gray-400">ساعات کاری</div>
                                                            <div className="text-white font-medium">شنبه تا چهارشنبه: ۸ صبح تا ۴ عصر</div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )}

                                    {activeTab === 'social' && (
                                        <div className="space-y-4">
                                            <Card className="bg-gray-800/50 border-gray-700">
                                                <CardHeader>
                                                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                                        <Share2 className="w-5 h-5 text-emerald-400" />
                                                        شبکه‌های اجتماعی
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <a
                                                        href="https://instagram.com/merajschool"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg hover:from-pink-500/30 hover:to-purple-500/30 transition-all cursor-pointer border border-pink-500/30"
                                                    >
                                                        <Instagram className="w-5 h-5 text-pink-400" />
                                                        <span className="text-white font-medium">اینستاگرام</span>
                                                    </a>
                                                    <a
                                                        href="https://twitter.com/merajschool"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg hover:from-blue-500/30 hover:to-cyan-500/30 transition-all cursor-pointer border border-blue-500/30"
                                                    >
                                                        <Twitter className="w-5 h-5 text-blue-400" />
                                                        <span className="text-white font-medium">توییتر</span>
                                                    </a>
                                                    <a
                                                        href="https://t.me/merajschool"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-lg hover:from-blue-500/30 hover:to-emerald-500/30 transition-all cursor-pointer border border-blue-500/30"
                                                    >
                                                        <MessageSquare className="w-5 h-5 text-blue-400" />
                                                        <span className="text-white font-medium">تلگرام</span>
                                                    </a>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )}
                                </div>

                                {activeTab === 'chat' && (
                                    <div className="border-t border-gray-700 p-4">
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
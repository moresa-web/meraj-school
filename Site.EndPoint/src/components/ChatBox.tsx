import React, { useRef, useState, useEffect } from 'react';
import { ChatMessage as ChatMessageType, FAQ, Conversation, Message } from '../types/chat';
import { chatService } from '../services/chatService';
import { motion, AnimatePresence } from 'framer-motion';
import ChatHeader from './Chat/ChatHeader';
import ChatMessageComponent from './Chat/ChatMessage';
import ChatInput from './Chat/ChatInput';
import ChatConversation from './Chat/ChatConversation';

const socialButtons = [
    {
        label: 'ایتا',
        icon: (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#10b981">
                <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" />
                <path d="M8 12l2.5 2.5L16 9" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        link: 'https://eitaa.com/merajschool'
    },
    {
        label: 'روبیکا',
        icon: (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#10b981">
                <rect x="4" y="4" width="16" height="16" rx="4" stroke="#10b981" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" stroke="#10b981" strokeWidth="2" />
            </svg>
        ),
        link: 'https://rubika.ir/merajschool'
    },
    {
        label: 'شاد',
        icon: (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#10b981">
                <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" />
                <circle cx="9" cy="10" r="1" fill="#10b981" />
                <circle cx="15" cy="10" r="1" fill="#10b981" />
                <path d="M9 15c1.5 1 3.5 1 5 0" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        link: 'https://shad.ir/merajschool'
    },
    {
        label: 'تلگرام',
        icon: (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#10b981">
                <path d="M21 3L3 10.53l5.09 1.64L19 6.13l-7.19 8.32v4.12l2.89-2.89" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        link: 'https://t.me/merajschool'
    },
    {
        label: 'اینستاگرام',
        icon: (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#10b981">
                <rect width="18" height="18" x="3" y="3" rx="5" stroke="#10b981" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" stroke="#10b981" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="#10b981" />
            </svg>
        ),
        link: 'https://instagram.com/merajschool'
    }
];

const conversations: Conversation[] = [
    {
        id: 1,
        name: 'پشتیبانی',
        avatar: 'https://cdn-icons-png.flaticon.com/512/194/194938.png',
        message: "سلام! چطور می‌توانم کمکتان کنم؟",
        time: new Date(),
        unread: 0,
    },
    {
        id: 2,
        name: 'ارتباط با ما',
        avatar: 'https://cdn-icons-png.flaticon.com/512/194/194938.png',
        message: 'اطلاعات تماس و آدرس مدرسه',
        time: new Date(),
        unread: 0,
    }
];

const ChatBox: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [online] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [allMessages, setAllMessages] = useState<{ [key: number]: ChatMessageType[] }>({});
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);
    const [activeSection, setActiveSection] = useState<'chat' | 'social' | 'faq'>('chat');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const chatServiceInstance = chatService;

    useEffect(() => {
        if (selectedConversationId && !allMessages[selectedConversationId]) {
            const welcomeMessage: ChatMessageType = {
                id: 'welcome',
                text: 'سلام! چطور می‌توانم کمکتان کنم؟',
                sender: 'bot',
                timestamp: new Date(),
                type: 'text',
                metadata: {
                    isRead: false,
                    status: 'sent',
                    isAI: true
                }
            };
            setAllMessages(prev => ({
                ...prev,
                [selectedConversationId]: [welcomeMessage]
            }));
        }
    }, [selectedConversationId, allMessages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [allMessages, selectedConversationId]);

    useEffect(() => {
        const fetchFAQs = async () => {
        try {
                setIsLoadingFaqs(true);
                const faqData = await chatServiceInstance.getFAQs();
                setFaqs(faqData);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            } finally {
                setIsLoadingFaqs(false);
            }
        };

        if (activeSection === 'faq') {
            fetchFAQs();
        }
    }, [activeSection, chatServiceInstance]);

    const handleSendMessage = async (message: string) => {
        if (!message.trim() || !selectedConversationId) return;

        const newMessage: ChatMessageType = {
            id: Date.now().toString(),
            text: message,
            sender: 'user',
            timestamp: new Date(),
            type: 'text',
            metadata: {
                isRead: false,
                status: 'sent'
            }
        };

        setAllMessages(prev => ({
            ...prev,
            [selectedConversationId]: [...(prev[selectedConversationId] || []), newMessage]
        }));

        setIsTyping(true);

        try {
            const schoolInfo = {
                name: 'دبیرستان پسرانه معراج',
                phone: '051-38932030',
                address: 'بلوار دانش آموز، دانش آموز 10',
                email: 'info@merajschool.ir',
                website: 'https://merajschool.ir',
                workingHours: 'شنبه تا چهارشنبه از ساعت 7:30 تا 14:30',
                socialMedia: {
                    instagram: 'https://instagram.com/merajschool',
                    telegram: 'https://t.me/merajschool',
                    whatsapp: '09123456789'
                }
            };

            const response = await chatServiceInstance.sendMessage(message, schoolInfo);
            const botMessage: ChatMessageType = {
                id: (Date.now() + 1).toString(),
                text: response.message.text,
                sender: 'bot',
                timestamp: new Date(),
                type: 'text',
                metadata: {
                    isRead: false,
                    status: 'sent',
                    isAI: true
                }
            };

            setAllMessages(prev => ({
                ...prev,
                [selectedConversationId]: [...(prev[selectedConversationId] || []), botMessage]
            }));
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSendFile = async (file: File) => {
        if (!selectedConversationId) return;
        console.log('File to send:', file);
    };

    const handleDragStart = (e: React.MouseEvent) => {
        if (chatBoxRef.current) {
            const rect = chatBoxRef.current.getBoundingClientRect();
            setPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            setIsDragging(true);
        }
    };

    const handleDragMove = (e: React.MouseEvent) => {
        if (isDragging && chatBoxRef.current) {
            const x = e.clientX - position.x;
            const y = e.clientY - position.y;
            chatBoxRef.current.style.transform = `translate(${x}px, ${y}px)`;
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const renderSocialButtons = () => (
        <div className="p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ارتباط با ما</h3>
            <div className="grid grid-cols-2 gap-4">
                {socialButtons.map((button) => (
                    <a
                        key={button.label}
                        href={button.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-[#e6f9f3] hover:bg-[#10b981]/10 transition-colors"
                    >
                        {button.icon}
                        <span className="text-gray-700">{button.label}</span>
                    </a>
                ))}
            </div>
        </div>
    );

    const renderFAQSection = () => (
        <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">سوالات متداول</h3>
            {isLoadingFaqs ? (
                <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981]"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <div
                            key={faq._id}
                            className="bg-[#e6f9f3] rounded-lg p-4 cursor-pointer hover:bg-[#10b981]/10 transition-colors"
                        >
                            <div className="font-medium text-[#064e3b] mb-2">{faq.question}</div>
                            <div className="text-sm text-gray-600">{faq.answer}</div>
                        </div>
                    ))}
                </div>
            )}
            </div>
        );

    const selectedConv = conversations.find(c => c.id === selectedConversationId);

    return (
        <>
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 bg-[#10b981] text-white p-4 rounded-full shadow-lg hover:bg-[#059669] transition-colors duration-200 z-[9999]"
            >
                {isOpen ? (
                    <motion.svg
                        initial={{ rotate: -180 }}
                        animate={{ rotate: 0 }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </motion.svg>
                ) : (
                    <motion.svg
                        initial={{ rotate: 180 }}
                        animate={{ rotate: 0 }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </motion.svg>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={chatBoxRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col z-[9998]"
                        style={{
                            cursor: isDragging ? 'grabbing' : 'default',
                            touchAction: 'none'
                        }}
                        onMouseDown={handleDragStart}
                        onMouseMove={handleDragMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                    >
                        <ChatHeader
                            selectedConversationId={selectedConversationId}
                            selectedConv={selectedConv}
                            online={online}
                            onClose={() => setIsOpen(false)}
                            onBack={() => {
                                setSelectedConversationId(null);
                                setActiveSection('chat');
                            }}
                        />

                        <div className="flex-1 overflow-y-auto">
                            {selectedConversationId ? (
                                <div className="p-4">
                                    <AnimatePresence>
                                        {allMessages[selectedConversationId]?.map((message, index) => (
                                            <ChatMessageComponent
                                                key={message.id}
                                                message={message as unknown as Message}
                                                isLastMessage={index === allMessages[selectedConversationId].length - 1}
                                            />
                                        ))}
                                    </AnimatePresence>
                                    <div ref={messagesEndRef} />
                                </div>
                            ) : (
                                <>
                                    <div className="flex border-b">
                                        <button
                                            onClick={() => setActiveSection('chat')}
                                            className={`flex-1 py-3 text-sm font-medium ${
                                                activeSection === 'chat'
                                                    ? 'text-[#10b981] border-b-2 border-[#10b981]'
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            چت
                                        </button>
                                        <button
                                            onClick={() => setActiveSection('social')}
                                            className={`flex-1 py-3 text-sm font-medium ${
                                                activeSection === 'social'
                                                    ? 'text-[#10b981] border-b-2 border-[#10b981]'
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            شبکه‌های اجتماعی
                                        </button>
                                        <button
                                            onClick={() => setActiveSection('faq')}
                                            className={`flex-1 py-3 text-sm font-medium ${
                                                activeSection === 'faq'
                                                    ? 'text-[#10b981] border-b-2 border-[#10b981]'
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            سوالات متداول
                                        </button>
                                    </div>

                                    {activeSection === 'chat' && (
                                        <ChatConversation
                                            conversations={conversations}
                                            selectedConversationId={selectedConversationId}
                                            onSelectConversation={setSelectedConversationId}
                                        />
                                    )}

                                    {activeSection === 'social' && renderSocialButtons()}
                                    {activeSection === 'faq' && renderFAQSection()}
                                </>
                            )}
                        </div>

                        {selectedConversationId && (
                            <ChatInput
                                onSendMessage={handleSendMessage}
                                onSendFile={handleSendFile}
                                disabled={!online}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBox; 
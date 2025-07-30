import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBox from './ChatBox';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Bell } from 'lucide-react';
import { Button } from '../ui/button';

const ChatButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        <Button
                            onClick={() => {
                                console.log('Chat button clicked, isAuthenticated:', isAuthenticated);
                                if (!isAuthenticated) {
                                    // اگر کاربر وارد نشده، به صفحه ورود هدایت شود
                                    window.location.href = '/login';
                                    return;
                                }
                                console.log('Setting isOpen to true');
                                setIsOpen(true);
                            }}
                            className="relative w-14 h-14 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-500 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 group touch-manipulation"
                            aria-label="شروع گفتگو با پشتیبان"
                            type="button"
                        >
                            <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                            
                            {/* Online indicator */}
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse" />
                            
                            {/* Notification badge */}
                            <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg animate-bounce">
                                <Bell className="w-3 h-3" />
                            </div>
                        </Button>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            پشتیبانی آنلاین
                            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {isAuthenticated && (
                <ChatBox isOpen={isOpen} onClose={() => setIsOpen(false)} />
            )}
        </>
    );
};

export default ChatButton; 
import React, { useState } from 'react';
import ChatBox from './ChatBox';
import { useAuth } from '../../contexts/AuthContext';
import { FiMessageSquare } from 'react-icons/fi';

const ChatButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => {
                        if (!isAuthenticated) {
                            // اگر کاربر وارد نشده، به صفحه ورود هدایت شود
                            window.location.href = '/login';
                            return;
                        }
                        setIsOpen(true);
                    }}
                    className="fixed bottom-4 right-4 p-4 bg-gradient-to-br from-emerald-800 to-teal-700 text-white rounded-full shadow-lg hover:from-emerald-700 hover:to-teal-600 transition-all z-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    aria-label="شروع گفتگو با پشتیبان"
                >
                    <FiMessageSquare size={24} />
                </button>
            )}
            {isAuthenticated && (
                <ChatBox isOpen={isOpen} onClose={() => setIsOpen(false)} />
            )}
        </>
    );
};

export default ChatButton; 
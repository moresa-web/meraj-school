import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiPaperclip, FiX } from 'react-icons/fi';
import { chatService } from '../../services/chat.service';

interface ChatInputProps {
    onSendMessage: (message: string, fileData?: { name: string; type: string; url: string }) => void;
    isTyping: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isTyping }) => {
    const [message, setMessage] = useState('');
    const [fileData, setFileData] = useState<{ name: string; type: string; url: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() || fileData) {
            onSendMessage(message, fileData || undefined);
            setMessage('');
            setFileData(null);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFileData({
                name: file.name,
                type: file.type,
                url
            });
        }
    };

    const removeFile = () => {
        if (fileData?.url) {
            URL.revokeObjectURL(fileData.url);
        }
        setFileData(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        chatService.emitTyping();
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-emerald-100">
            <AnimatePresence>
                {fileData && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-2 p-2 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-between"
                    >
                        <span className="text-sm text-emerald-700 truncate">{fileData.name}</span>
                <button
                    type="button"
                            onClick={removeFile}
                            className="text-emerald-600 hover:text-emerald-700"
                >
                            <FiX size={16} />
                </button>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="flex items-center space-x-2">
                <label className="cursor-pointer text-emerald-600 hover:text-emerald-700">
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*,.pdf,.doc,.docx"
                    />
                    <FiPaperclip size={20} />
                </label>
                <input
                    type="text"
                    value={message}
                    onChange={handleChange}
                    placeholder="پیام خود را بنویسید..."
                    className="flex-1 p-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button
                    type="submit"
                    disabled={!message.trim() && !fileData}
                    className={`p-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 text-white ${
                        (!message.trim() && !fileData) ? 'opacity-50 cursor-not-allowed' : 'hover:from-emerald-700 hover:to-teal-600'
                    }`}
                >
                    <FiSend size={20} />
                </button>
            </div>
        </form>
    );
};

export default ChatInput; 
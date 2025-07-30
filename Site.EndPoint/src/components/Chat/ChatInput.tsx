import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, X, Image as ImageIcon, FileText, Download } from 'lucide-react';
import { chatService } from '../../services/chat.service';
import { Button } from '../ui/button';

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

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) {
            return <ImageIcon className="w-4 h-4" />;
        }
        return <FileText className="w-4 h-4" />;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence>
                {fileData && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            {getFileIcon(fileData.type)}
                            <span className="text-sm text-emerald-300 truncate max-w-48">{fileData.name}</span>
                        </div>
                        <Button
                            type="button"
                            onClick={removeFile}
                            variant="ghost"
                            size="sm"
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 p-1"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="flex items-center gap-2">
                <label className="cursor-pointer text-emerald-400 hover:text-emerald-300 transition-colors p-2 hover:bg-emerald-500/20 rounded-lg">
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <Paperclip className="w-5 h-5" />
                </label>
                
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={message}
                        onChange={handleChange}
                        placeholder="پیام خود را بنویسید..."
                        className="w-full p-3 pr-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        disabled={isTyping}
                    />
                    {isTyping && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-100" />
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-200" />
                        </div>
                    )}
                </div>
                
                <Button
                    type="submit"
                    disabled={(!message.trim() && !fileData) || isTyping}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                        (message.trim() || fileData) && !isTyping
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <Send className="w-5 h-5" />
                </Button>
            </div>
            
            <div className="text-xs text-gray-400 text-center">
                برای ارسال فایل، روی آیکون گیره کلیک کنید
            </div>
        </form>
    );
};

export default ChatInput; 
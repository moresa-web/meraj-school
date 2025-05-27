import React from 'react';
import { Conversation } from '../../types/chat';

interface ChatHeaderProps {
    selectedConversationId: number | null;
    selectedConv: Conversation | undefined;
    online: boolean;
    onClose: () => void;
    onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    selectedConversationId,
    selectedConv,
    online,
    onClose,
    onBack
}) => {
    return (
        <div className="bg-[#10b981] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {selectedConversationId && (
                    <button
                        onClick={onBack}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
                {selectedConv ? (
                    <>
                        <div className="relative">
                            <img
                                src={selectedConv.avatar}
                                alt={selectedConv.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white"
                            />
                            {online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-medium">{selectedConv.name}</h3>
                            <p className="text-sm text-white/80">
                                {online ? 'آنلاین' : 'آفلاین'}
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <h3 className="font-medium">چت آنلاین</h3>
                    </div>
                )}
            </div>
            <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default ChatHeader; 
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatButton from './Chat/ChatButton';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <ChatButton />
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                        direction: 'rtl'
                    }
                }}
            />
        </div>
    );
};

export default Layout; 
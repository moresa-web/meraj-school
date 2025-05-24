"use client";

import Sidebar from '@/components/layout/Sidebar';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Vazirmatn } from 'next/font/google';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-vazirmatn',
});

// ایجاد یک نمونه از QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 دقیقه
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 w-full lg:w-[calc(100%-16rem)]">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
            <Toaster 
              position="top-center"
              toastOptions={{
                className: 'rtl',
                style: {
                  direction: 'rtl',
                  textAlign: 'right',
                },
              }}
            />
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

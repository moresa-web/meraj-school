"use client";

import Sidebar from '@/components/layout/Sidebar';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
    <html lang="fa" dir="rtl">
      <body>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-8">
                {children}
              </main>
            </div>
            <Toaster position="top-center" />
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

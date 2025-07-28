import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import News from './pages/News/News';
import NewsDetail from './pages/News/NewsDetail';
import Classes from './pages/Classes/Classes';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFound from './pages/NotFound/NotFound';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { motion, useScroll } from "motion/react"
import './App.css';
import { HelmetProvider } from 'react-helmet-async';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Profile from './pages/Profile/Profile';
import ChatButton from './components/Chat/ChatButton';

// کامپوننت اصلی برنامه که از useAuth استفاده می‌کند
const AppContent: React.FC = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div className="app">
      <motion.div
        id="scroll-indicator"
        style={{
          scaleX: scrollYProgress,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          originX: 0,
          backgroundColor: "#10b981",
          zIndex: 1100,
        }}
      />
      <Header />
      <ScrollToTop />
      <main className="main-content">
        <Routes>
          <Route path="/auth" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      <Footer />
      <ChatButton />
    </div>
  );
};

// کامپوننت اصلی که Provider‌ها را تنظیم می‌کند
const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <HelmetProvider>
        <Router>
          <AuthProvider>
            <AppContent />
            <Toaster />
          </AuthProvider>
        </Router>
      </HelmetProvider>
    </I18nextProvider>
  );
};

export default App; 
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import News from './pages/News/News';
import NewsDetail from './pages/News/NewsDetail';
import Classes from './pages/Classes/Classes';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Auth from './pages/Auth/Auth';
import NotFound from './pages/NotFound/NotFound';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route path="news" element={<Dashboard />} />
              <Route path="news/add" element={<Dashboard />} />
              <Route path="news/edit/:id" element={<Dashboard />} />
              <Route path="classes" element={<Dashboard />} />
              <Route path="classes/add" element={<Dashboard />} />
              <Route path="classes/edit/:id" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App; 
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSiteInfo } from '../../hooks/useSiteInfo';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { getImageUrl } from '../../utils/format';

const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { siteInfo, loading } = useSiteInfo();
  const { t, i18n } = useTranslation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      navigate(path);
    }
  };

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled 
        ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800' 
        : 'bg-transparent'
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={() => handleNavigation('/')}>
            <div className="relative">
              <img
                src={loading ? '/images/logo.png' : getImageUrl(siteInfo?.image || '') || '/images/logo.png'}
                alt={loading ? 'لوگو مدرسه' : siteInfo?.schoolName || 'دبیرستان معراج'}
                className="h-12 w-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
              />
              <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-sm group-hover:bg-emerald-500/30 transition-all duration-300"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-emerald-200 transition-all duration-300">
              دبیرستان معراج
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-lg font-medium transition-all duration-200 relative group ${isActive('/')
                ? 'text-emerald-400 font-semibold'
                : isScrolled
                  ? 'text-gray-300 hover:text-emerald-400'
                  : 'text-white hover:text-emerald-400'
                }`}
            >
              {t('nav.home')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/about"
              className={`text-lg font-medium transition-all duration-200 relative group ${isActive('/about')
                ? 'text-emerald-400 font-semibold'
                : isScrolled
                  ? 'text-gray-300 hover:text-emerald-400'
                  : 'text-white hover:text-emerald-400'
                }`}
            >
              {t('nav.about')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/classes"
              className={`text-lg font-medium transition-all duration-200 relative group ${isActive('/classes')
                ? 'text-emerald-400 font-semibold'
                : isScrolled
                  ? 'text-gray-300 hover:text-emerald-400'
                  : 'text-white hover:text-emerald-400'
                }`}
            >
              {t('nav.classes')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/news"
              className={`text-lg font-medium transition-all duration-200 relative group ${isActive('/news')
                ? 'text-emerald-400 font-semibold'
                : isScrolled
                  ? 'text-gray-300 hover:text-emerald-400'
                  : 'text-white hover:text-emerald-400'
                }`}
            >
              {t('nav.news')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/contact"
              className={`text-lg font-medium transition-all duration-200 relative group ${isActive('/contact')
                ? 'text-emerald-400 font-semibold'
                : isScrolled
                  ? 'text-gray-300 hover:text-emerald-400'
                  : 'text-white hover:text-emerald-400'
                }`}
            >
              {t('nav.contact')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {user?.role === 'admin' ? (
              <Link
                to="http://localhost:3001"
                onClick={() => handleNavigation('http://localhost:3001')}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-emerald-500/25 border border-emerald-500/20"
              >
                {t('nav.dashboard')}
              </Link>
            ) : (<></>)}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-red-500/25 border border-red-500/20"
              >
                {t('nav.logout')}
              </button>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-emerald-500/25 border border-emerald-500/20"
              >
                ورود / ثبت‌نام
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-all duration-200 ${
              isScrolled 
                ? 'hover:bg-gray-800 text-gray-300 hover:text-emerald-400' 
                : 'hover:bg-white/10 text-white hover:text-emerald-400'
            }`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 z-50">
            <div className="fixed top-0 right-0 w-80 h-full bg-gray-900 shadow-2xl transform transition-transform duration-300 border-l border-gray-800">
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <button
                    onClick={toggleMenu}
                    className="p-2 rounded-lg hover:bg-gray-800 transition-all duration-200 text-gray-300 hover:text-emerald-400"
                    aria-label="بستن منو"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <span className="text-xl font-semibold text-emerald-400">منو</span>
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-8">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-right text-xl font-medium transition-all duration-200 py-3 px-4 rounded-lg ${isActive('/') 
                      ? 'text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20' 
                      : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-800'
                      }`}
                  >
                    خانه
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-right text-xl font-medium transition-all duration-200 py-3 px-4 rounded-lg ${isActive('/about') 
                      ? 'text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20' 
                      : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-800'
                      }`}
                  >
                    درباره ما
                  </Link>
                  <Link
                    to="/classes"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-right text-xl font-medium transition-all duration-200 py-3 px-4 rounded-lg ${isActive('/classes') 
                      ? 'text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20' 
                      : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-800'
                      }`}
                  >
                    کلاس‌های تقویتی
                  </Link>
                  <Link
                    to="/news"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-right text-xl font-medium transition-all duration-200 py-3 px-4 rounded-lg ${isActive('/news') 
                      ? 'text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20' 
                      : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-800'
                      }`}
                  >
                    اخبار
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-right text-xl font-medium transition-all duration-200 py-3 px-4 rounded-lg ${isActive('/contact') 
                      ? 'text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20' 
                      : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-800'
                      }`}
                  >
                    تماس با ما
                  </Link>
                </div>

                <div className="mt-auto pt-8 space-y-4">
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-red-500/25 text-lg border border-red-500/20"
                    >
                      خروج
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="block w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 text-center shadow-lg hover:shadow-emerald-500/25 text-lg border border-emerald-500/20"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ورود / ثبت‌نام
                    </Link>
                  )}
                  {user?.role === 'admin' ? (
                    <Link
                      to="http://localhost:3001"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 text-center shadow-lg hover:shadow-emerald-500/25 text-lg border border-emerald-500/20"
                    >
                      داشبورد
                    </Link>
                  ) : (<></>)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 
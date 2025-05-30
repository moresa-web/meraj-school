import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useSiteInfo } from '../../hooks/useSiteInfo';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Globe
} from 'lucide-react';
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
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={() => handleNavigation('/')}>
            <img
              src={loading ? '/images/logo.png' : getImageUrl(siteInfo?.image || '') || '/images/logo.png'}
              alt={loading ? 'لوگو مدرسه' : siteInfo?.schoolName || 'دبیرستان معراج'}
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              دبیرستان معراج
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-lg font-medium transition-all duration-200 ${isActive('/')
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent font-semibold'
                : isScrolled
                  ? 'text-gray-800 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-500 hover:bg-clip-text hover:text-transparent hover:scale-105'
                  : 'text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-500 hover:bg-clip-text hover:text-transparent hover:scale-105'
                }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/about"
              className={`text-lg font-medium transition-all duration-200 ${isActive('/about')
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent font-semibold'
                : isScrolled
                  ? 'text-gray-800 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-500 hover:bg-clip-text hover:text-transparent hover:scale-105'
                  : 'text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-500 hover:bg-clip-text hover:text-transparent hover:scale-105'
                }`}
            >
              {t('nav.about')}
            </Link>
            <Link
              to="/classes"
              className={`text-lg font-medium transition-all duration-200 ${isActive('/classes')
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent font-semibold'
                : isScrolled
                  ? 'text-gray-800 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-500 hover:bg-clip-text hover:text-transparent hover:scale-105'
                  : 'text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-500 hover:bg-clip-text hover:text-transparent hover:scale-105'
                }`}
            >
              {t('nav.classes')}
            </Link>
            <Link
              to="/news"
              className={`text-lg font-medium transition-all duration-200 ${isActive('/news')
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent font-semibold'
                : isScrolled
                  ? 'text-gray-800 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-500 hover:bg-clip-text hover:text-transparent hover:scale-105'
                  : 'text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-500 hover:bg-clip-text hover:text-transparent hover:scale-105'
                }`}
            >
              {t('nav.news')}
            </Link>
            <Link
              to="/contact"
              className={`text-lg font-medium transition-all duration-200 ${isActive('/contact')
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent font-semibold'
                : isScrolled
                  ? 'text-gray-800 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-500 hover:bg-clip-text hover:text-transparent hover:scale-105'
                  : 'text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-500 hover:bg-clip-text hover:text-transparent hover:scale-105'
                }`}
            >
              {t('nav.contact')}
            </Link>
            {user?.role === 'admin' ? (
              <Link
                to="/dashboard"
                onClick={() => handleNavigation('/dashboard')}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
              >
                {t('nav.dashboard')}
              </Link>
            ) : (<></>)}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
              >
                {t('nav.logout')}
              </button>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
              >
                ورود / ثبت‌نام
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-600"
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
          <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300">
            <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl transform transition-transform duration-300">
              <div className="p-6 h-full flex flex-col bg-white">
                <div className="flex justify-between items-center mb-8">
                  <button
                    onClick={toggleMenu}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                    aria-label="بستن منو"
                  >
                    <svg
                      className="w-6 h-6 text-gray-600"
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
                  <span className="text-xl font-semibold text-gray-800">منو</span>
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-8">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-right text-xl font-medium transition-all duration-200 ${isActive('/') ? 'text-emerald-600 font-semibold' : 'text-gray-600 hover:text-emerald-600'
                      }`}
                  >
                    خانه
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-right text-xl font-medium transition-all duration-200 ${isActive('/about') ? 'text-emerald-600 font-semibold' : 'text-gray-600 hover:text-emerald-600'
                      }`}
                  >
                    درباره ما
                  </Link>
                  <Link
                    to="/classes"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-right text-xl font-medium transition-all duration-200 ${isActive('/classes') ? 'text-emerald-600 font-semibold' : 'text-gray-600 hover:text-emerald-600'
                      }`}
                  >
                    کلاس‌های تقویتی
                  </Link>
                  <Link
                    to="/news"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-right text-xl font-medium transition-all duration-200 ${isActive('/news') ? 'text-emerald-600 font-semibold' : 'text-gray-600 hover:text-emerald-600'
                      }`}
                  >
                    اخبار
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-right text-xl font-medium transition-all duration-200 ${isActive('/contact') ? 'text-emerald-600 font-semibold' : 'text-gray-600 hover:text-emerald-600'
                      }`}
                  >
                    تماس با ما
                  </Link>
                </div>

                <div className="mt-auto pt-8">
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg text-lg"
                    >
                      خروج
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="block w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 text-center shadow-md hover:shadow-lg text-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ورود / ثبت‌نام
                    </Link>
                  )}
                  {user?.role === 'admin' ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 text-center shadow-md hover:shadow-lg text-lg"
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
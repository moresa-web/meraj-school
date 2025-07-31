import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSiteInfo } from '../../hooks/useSiteInfo';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import { getImageUrl } from '../../utils/format';
import { Menu, X, Home, Info, BookOpen, Newspaper, Phone, LogOut, LogIn, Settings } from 'lucide-react';

interface HeroContent {
  logo: string;
  title: string;
  description: string;
}

const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { siteInfo, loading } = useSiteInfo();
  const { t, i18n } = useTranslation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [heroLoading, setHeroLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Only update scroll state if mobile menu is closed
      if (!isMobileMenuOpen) {
        setIsScrolled(window.scrollY > 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Fetch hero content for logo
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/content/home/hero`);
        if (response.ok) {
          const data = await response.json();
          console.log('Hero content fetched for header logo:', data);
          setHeroContent(data);
        } else {
          // Fallback to default logo if API fails
          setHeroContent({
            logo: '/images/logo.png',
            title: 'دبیرستان معراج',
            description: 'دبیرستان معراج - مرکز آموزش و پرورش با کیفیت'
          });
        }
      } catch (error) {
        console.error('Error fetching hero content for logo:', error);
        // Fallback to default logo if API fails
        setHeroContent({
          logo: '/images/logo.png',
          title: 'دبیرستان معراج',
          description: 'دبیرستان معراج - مرکز آموزش و پرورش با کیفیت'
        });
      } finally {
        setHeroLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
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
              src={heroLoading ? '/images/logo.png' : getImageUrl(heroContent?.logo || '/images/logo.png')}
              alt={heroLoading ? 'لوگو مدرسه' : siteInfo?.schoolName || 'دبیرستان معراج'}
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
                to="https://admin.merajfutureschool.ir"
                onClick={() => handleNavigation('https://admin.merajfutureschool.ir')}
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
        <div className={`md:hidden fixed inset-0 z-[99999] transition-all duration-700 ease-out ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-700 ease-out z-10 ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeMenu}
          />
          
          {/* Menu Panel */}
          <div className={`absolute top-0 right-0 w-80 h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 shadow-2xl border-l border-gray-700 transition-all duration-700 ease-out transform z-20 overflow-y-auto ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="p-6 min-h-screen flex flex-col relative">
              {/* Background Pattern */}
              <div className={`absolute inset-0 opacity-5 transition-all duration-1000 ease-out ${
                isMobileMenuOpen ? 'opacity-5' : 'opacity-0'
              }`}>
                <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-24 h-24 bg-blue-500 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>

              {/* Header */}
              <div className={`flex justify-between items-center mb-8 relative z-10 transition-all duration-700 ease-out transform ${
                isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`} style={{ transitionDelay: '200ms' }}>
                <button
                  onClick={toggleMenu}
                  className="p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-300 text-gray-300 hover:text-emerald-400 hover:scale-110 group"
                  aria-label="بستن منو"
                >
                  <X
                    className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90"
                  />
                </button>
                <div className="text-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                    منو
                  </span>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-300 mx-auto mt-1 rounded-full"></div>
                </div>
                <div className="w-10"></div> {/* Spacer for centering */}
              </div>

              {/* Navigation Links */}
              <div className="flex-1 flex flex-col justify-start space-y-2 relative z-10 py-8">
                {[
                  { path: '/', label: 'خانه', icon: Home },
                  { path: '/about', label: 'درباره ما', icon: Info },
                  { path: '/classes', label: 'کلاس‌های تقویتی', icon: BookOpen },
                  { path: '/news', label: 'اخبار', icon: Newspaper },
                  { path: '/contact', label: 'تماس با ما', icon: Phone }
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMenu}
                      className={`group flex items-center justify-between w-full text-right text-lg font-medium transition-all duration-500 ease-out py-4 px-6 rounded-2xl relative overflow-hidden transform ${
                        isActive(item.path)
                          ? 'text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                          : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-800/50'
                      } ${
                        isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                      }`}
                      style={{ 
                        transitionDelay: `${400 + index * 100}ms`,
                        transitionDuration: '600ms'
                      }}
                    >
                      {/* Background glow for active item */}
                      {isActive(item.path) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-2xl"></div>
                      )}
                      
                      {/* Content */}
                      <div className="flex items-center space-x-3 space-x-reverse relative z-10">
                        <div className="p-2 rounded-xl bg-gray-800/50 group-hover:bg-emerald-500/20 transition-all duration-300">
                          <IconComponent className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {item.label}
                        </span>
                      </div>
                      
                      {/* Arrow indicator */}
                      <div className={`transition-all duration-300 ${
                        isActive(item.path) 
                          ? 'text-emerald-400 translate-x-1' 
                          : 'text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className={`mt-8 pt-8 space-y-4 relative z-10 transition-all duration-700 ease-out transform ${
                isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`} style={{ transitionDelay: '800ms' }}>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25 text-lg font-medium border border-red-500/20 hover:scale-105 group"
                  >
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <LogOut className="w-5 h-5" />
                      <span>خروج</span>
                    </div>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl hover:from-emerald-700 hover:to-emerald-600 transition-all duration-300 text-center shadow-lg hover:shadow-emerald-500/25 text-lg font-medium border border-emerald-500/20 hover:scale-105 group"
                    onClick={closeMenu}
                  >
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <LogIn className="w-5 h-5" />
                      <span>ورود / ثبت‌نام</span>
                    </div>
                  </Link>
                )}
                
                {user?.role === 'admin' && (
                  <Link
                    to="https://admin.merajfutureschool.ir"
                    onClick={closeMenu}
                    className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 text-center shadow-lg hover:shadow-blue-500/25 text-lg font-medium border border-blue-500/20 hover:scale-105 group"
                  >
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <Settings className="w-5 h-5" />
                      <span>داشبورد</span>
                    </div>
                  </Link>
                )}
              </div>

              {/* Footer */}
              <div className={`mt-8 pt-6 border-t border-gray-700 relative z-10 transition-all duration-700 ease-out transform ${
                isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`} style={{ transitionDelay: '900ms' }}>
                <div className="text-center text-gray-400 text-sm">
                  <p className="mb-2">دبیرستان معراج</p>
                  <div className="flex justify-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
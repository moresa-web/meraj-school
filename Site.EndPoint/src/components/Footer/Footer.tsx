import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteInfo } from '../../hooks/useSiteInfo';
import { Instagram, Twitter, Mail, Phone, MapPin, Facebook, Linkedin, Youtube, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { newsletterService } from '../../services/newsletterService';
import '../Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const { siteInfo, loading } = useSiteInfo();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // اعتبارسنجی ساده ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ text: t('footer.invalidEmail'), type: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const response = await newsletterService.subscribe(email);
      if (response.success) {
        setMessage({ text: response.message, type: 'success' });
        setEmail('');
      } else {
        setMessage({ text: response.message, type: 'error' });
      }
    } catch (error) {
      console.error('خطا در ثبت‌نام خبرنامه:', error);
      setMessage({ text: t('footer.subscribeError'), type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social media icons mapping
  const socialIcons = {
    instagram: Instagram,
    twitter: Twitter,
    facebook: Facebook,
    linkedin: Linkedin,
    youtube: Youtube
  };

  const getSocialIcon = (platform: string) => {
    const IconComponent = socialIcons[platform as keyof typeof socialIcons];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      ref={footerRef}
      className={`footer ${isVisible ? 'footer--visible' : ''}`}
      role="contentinfo"
      aria-label="پاورقی سایت"
    >
      {/* Background decoration */}
      <div className="footer-background">
        <div className="footer-pattern"></div>
      </div>

      <div className="footer-container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section footer-about">
            <h3 className="footer-section-title">
              {t('footer.about')}
            </h3>
            <div className="footer-about-content">
              <p className="footer-description">
                {loading ? (
                  <span className="footer-loading">در حال بارگذاری...</span>
                ) : (
                  siteInfo?.description || 'مدرسه معراج، مرکز آموزشی پیشرفته با امکانات مدرن و کادر مجرب'
                )}
              </p>
              
              {/* Social Media */}
              <div className="footer-social">
                {!loading && siteInfo?.socialMedia && Object.entries(siteInfo.socialMedia).map(([platform, url]) => {
                  if (!url) return null;
                  
                  const icon = getSocialIcon(platform);
                  if (!icon) return null;

                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social-link"
                      aria-label={`${platform} مدرسه معراج`}
                    >
                      {icon}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section footer-links">
            <h3 className="footer-section-title">
              {t('footer.quickLinks')}
            </h3>
            <nav className="footer-nav" role="navigation" aria-label="لینک‌های سریع">
              <ul className="footer-nav-list">
                <li>
                  <Link to="/" className="footer-nav-link">
                    {t('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="footer-nav-link">
                    {t('nav.news')}
                  </Link>
                </li>
                <li>
                  <Link to="/classes" className="footer-nav-link">
                    {t('nav.classes')}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="footer-nav-link">
                    {t('nav.about')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="footer-nav-link">
                    {t('nav.contact')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="footer-section footer-contact">
            <h3 className="footer-section-title">
              {t('footer.contactInfo')}
            </h3>
            <div className="footer-contact-info">
              {!loading && siteInfo?.address && (
                <div className="footer-contact-item">
                  <MapPin className="footer-contact-icon" aria-hidden="true" />
                  <span className="footer-contact-text">{siteInfo.address}</span>
                </div>
              )}
              {!loading && siteInfo?.phone && (
                <div className="footer-contact-item">
                  <Phone className="footer-contact-icon" aria-hidden="true" />
                  <a
                    href={`tel:${siteInfo.phone}`}
                    className="footer-contact-link"
                    aria-label={`تماس با شماره ${siteInfo.phone}`}
                  >
                    {siteInfo.phone}
                  </a>
                </div>
              )}
              {!loading && siteInfo?.email && (
                <div className="footer-contact-item">
                  <Mail className="footer-contact-icon" aria-hidden="true" />
                  <a
                    href={`mailto:${siteInfo.email}`}
                    className="footer-contact-link"
                    aria-label={`ارسال ایمیل به ${siteInfo.email}`}
                  >
                    {siteInfo.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-section footer-newsletter">
            <h3 className="footer-section-title">
              {t('footer.newsletter')}
            </h3>
            <div className="footer-newsletter-content">
              <p className="footer-newsletter-description">
                {t('footer.newsletterDescription') || 'برای دریافت آخرین اخبار و اطلاعیه‌ها عضو خبرنامه ما شوید'}
              </p>
              
              <form className="footer-newsletter-form" onSubmit={handleSubscribe} noValidate>
                <div className="footer-newsletter-input-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('footer.emailPlaceholder') || 'ایمیل خود را وارد کنید'}
                    className="footer-newsletter-input"
                    aria-label="ایمیل برای خبرنامه"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="footer-newsletter-button"
                    aria-label="عضویت در خبرنامه"
                  >
                    {isSubmitting ? (
                      <div className="footer-loading-spinner"></div>
                    ) : (
                      <Send className="footer-newsletter-icon" />
                    )}
                  </button>
                </div>
                
                {message && (
                  <div className={`footer-message footer-message--${message.type}`}>
                    {message.type === 'success' ? (
                      <CheckCircle className="footer-message-icon" />
                    ) : (
                      <AlertCircle className="footer-message-icon" />
                    )}
                    <span>{message.text}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <div className="footer-copyright-content">
            <p className="footer-copyright-text">
              © {new Date().getFullYear()} {loading ? 'مدرسه معراج' : siteInfo?.schoolName || 'مدرسه معراج'}. {t('footer.allRightsReserved') || 'تمامی حقوق محفوظ است'}
            </p>
            <button
              onClick={scrollToTop}
              className="footer-scroll-top"
              aria-label="بازگشت به بالای صفحه"
            >
              <svg className="footer-scroll-top-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteInfo } from '../../hooks/useSiteInfo';
import { Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { newsletterService } from '../../services/newsletterService';

const Footer = () => {
  const { t } = useTranslation();
  const { siteInfo, loading } = useSiteInfo();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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

  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('footer.about')}</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {loading ? '...' : siteInfo?.description}
            </p>
            <div className="flex space-x-4">
              {!loading && siteInfo?.socialMedia?.instagram && (
                <a
                  href={siteInfo.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {!loading && siteInfo?.socialMedia?.twitter && (
                <a
                  href={`https://twitter.com/${siteInfo.socialMedia.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                  {t('nav.news')}
                </Link>
              </li>
              <li>
                <Link to="/classes" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                  {t('nav.classes')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('footer.contactInfo')}</h3>
            <ul className="space-y-4">
              {!loading && siteInfo?.address && (
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-emerald-500 mt-1" />
                  <span className="text-gray-500 dark:text-gray-400">{siteInfo.address}</span>
                </li>
              )}
              {!loading && siteInfo?.phone && (
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-emerald-500" />
                  <a
                    href={`tel:${siteInfo.phone}`}
                    className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
                  >
                    {siteInfo.phone}
                  </a>
                </li>
              )}
              {!loading && siteInfo?.email && (
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-emerald-500" />
                  <a
                    href={`mailto:${siteInfo.email}`}
                    className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
                  >
                    {siteInfo.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('footer.newsletter')}</h3>
            <p className="text-gray-500 dark:text-gray-400">{t('footer.newsletterDescription')}</p>
            <form className="space-y-2" onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('footer.subscribing') : t('footer.subscribe')}
              </button>
              {message && (
                <div className={`text-sm mt-2 ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {message.text}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} {loading ? '...' : siteInfo?.schoolName}. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
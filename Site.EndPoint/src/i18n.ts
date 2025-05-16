import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import faTranslation from './locales/fa/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fa: {
        translation: faTranslation
      }
    },
    lng: 'fa',
    fallbackLng: 'fa',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 
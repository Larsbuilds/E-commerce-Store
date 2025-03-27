import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';
import deTranslations from './locales/de.json';
import frTranslations from './locales/fr.json';
import esTranslations from './locales/es.json';

const supportedLanguages = ['en', 'ar', 'de', 'fr', 'es'];

// Get initial language from localStorage or browser
const getInitialLanguage = () => {
  const savedLang = localStorage.getItem('i18nextLng');
  if (savedLang && supportedLanguages.includes(savedLang)) {
    return savedLang;
  }
  const browserLang = navigator.language.split('-')[0];
  return supportedLanguages.includes(browserLang) ? browserLang : 'en';
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      ar: {
        translation: arTranslations,
      },
      de: {
        translation: deTranslations,
      },
      fr: {
        translation: frTranslations,
      },
      es: {
        translation: esTranslations,
      },
    },
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    lng: getInitialLanguage(),
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    debug: true,
  });

// Set initial direction
const initialLang = getInitialLanguage();
document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = initialLang;

// Log the current language and available languages
console.log('Current language:', i18n.language);
console.log('Available languages:', i18n.languages);

export default i18n; 
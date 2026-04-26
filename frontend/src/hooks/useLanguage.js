import { useState, useEffect } from 'react';
import arTranslations from '../i18n/ar.json';
import enTranslations from '../i18n/en.json';

const translations = { ar: arTranslations, en: enTranslations };

export function useLanguage() {
  const [language, setLanguage] = useState('ar');
  const [t, setT] = useState(translations.ar);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    setT(translations[newLang]);
  };

  return { language, t, toggleLanguage };
}

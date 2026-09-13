'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LanguageMode } from '@/lib/types';

interface LanguageContextType {
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
  toggleLanguage: () => void;
  t: (en: string, te: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (en) => en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageMode>('en');

  useEffect(() => {
    const saved = localStorage.getItem('prasad_news_lang') as LanguageMode | null;
    if (saved === 'en' || saved === 'te') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: LanguageMode) => {
    setLanguageState(lang);
    localStorage.setItem('prasad_news_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'te' : 'en';
    setLanguage(next);
  };

  const t = (en: string, te: string) => {
    return language === 'te' ? te || en : en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      <div className={language === 'te' ? 'font-telugu' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

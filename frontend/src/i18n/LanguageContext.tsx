"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from './translations/en';
import { ta } from './translations/ta';
import { hi } from './translations/hi';
import { te } from './translations/te';
import { ml } from './translations/ml';
import { kn } from './translations/kn';

export type Language = 'en' | 'ta' | 'hi' | 'te' | 'ml' | 'kn';
export type TranslationType = typeof en;

export interface LanguageOption {
  code: Language;
  label: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ' }
];

const translations: Record<Language, TranslationType> = {
  en,
  ta: ta as TranslationType,
  hi: hi as TranslationType,
  te: te as TranslationType,
  ml: ml as TranslationType,
  kn: kn as TranslationType
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationType;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: en,
  languages: SUPPORTED_LANGUAGES
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('agriflow_language') as Language;
      if (stored && ['en', 'ta', 'hi', 'te', 'ml', 'kn'].includes(stored)) {
        setLanguageState(stored);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = stored;
        }
      }
    } catch (e) {
      console.warn('localStorage unavailable for language preference');
    }
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('agriflow_language', lang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
    } catch (e) {
      console.warn('Failed to persist language preference');
    }
  };

  const t = translations[language] || en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);


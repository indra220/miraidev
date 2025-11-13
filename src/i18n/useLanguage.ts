// src/i18n/useLanguage.ts
import { useContext } from 'react';
import { LanguageContext } from './LanguageContext';

interface LanguageContextType {
  locale: import('./config').Locale;
  setLocale: (locale: import('./config').Locale) => void;
  t: (key: string, fallback?: string) => Promise<string>;
}

export type { LanguageContextType };

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
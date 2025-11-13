// src/i18n/LanguageContext.ts
import { createContext } from 'react';
import { Locale } from './config';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => Promise<string>;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
// src/i18n/LanguageContextProvider.tsx
'use client';

import React, { useState, ReactNode, useEffect } from 'react';
import { Locale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from './config';
import { LanguageContext } from './LanguageContext';

interface LanguageProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLocale = DEFAULT_LOCALE
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Fungsi untuk mengatur locale dan menyimpan ke localStorage
  const setLocale = (newLocale: Locale) => {
    if (SUPPORTED_LOCALES.includes(newLocale)) {
      setLocaleState(newLocale);
      localStorage.setItem('locale', newLocale);
    }
  };

  // Fungsi terjemahan yang menggunakan locale saat ini
  const t = async (key: string, fallback?: string): Promise<string> => {
    // Impor fungsi terjemahan secara dinamis
    const { t: translate } = await import('./t');
    return translate(key, locale, fallback);
  };

  // Muat locale dari localStorage saat aplikasi dimulai
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale | null;
    if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
      setLocaleState(savedLocale);
    } else {
      // Deteksi bahasa browser pengguna
      const browserLocale = navigator.language.split('-')[0] as Locale;
      if (SUPPORTED_LOCALES.includes(browserLocale)) {
        setLocaleState(browserLocale);
      }
    }
  }, []);

  // Update HTML lang attribute saat locale berubah
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
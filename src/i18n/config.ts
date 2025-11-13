// src/i18n/config.ts
export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALES = ['en', 'id'] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  id: 'Indonesia'
};

// Path untuk file-file terjemahan statis
export const LOCALE_PATHS: Record<Locale, string> = {
  en: '/locales/en',
  id: '/locales/id'
};
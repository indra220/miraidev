// src/i18n/local-translation-service.ts
import { Locale } from './config';

// Definisi tipe rekursif untuk kamus terjemahan
export type TranslationDictionary = {
  [key: string]: string | TranslationDictionary;
};

// Fungsi untuk mendapatkan kamus terjemahan lokal berdasarkan locale
export const getLocalDictionary = async (locale: Locale): Promise<TranslationDictionary> => {
  try {
    const localeModule = await import(`../locales/${locale}/common.json`);
    return localeModule.default || {};
  } catch (error) {
    console.error(`Error loading locale dictionary for ${locale}:`, error);
    // Kembalikan kamus kosong jika tidak bisa memuat
    return {};
  }
};

// Fungsi untuk mendapatkan teks terjemahan dari kamus lokal
export const getLocalTranslation = (
  dictionary: TranslationDictionary,
  key: string,
  fallback: string = key
): string => {
  const keys = key.split('.');
  let current: TranslationDictionary | string = dictionary;

  for (const k of keys) {
    if (current && typeof current === 'object' && current[k] !== undefined) {
      current = current[k] as TranslationDictionary | string;
    } else {
      return fallback;
    }
  }

  return typeof current === 'string' ? current : fallback;
};

// Fungsi untuk mengganti parameter dalam string terjemahan
export const interpolate = (str: string, params: Record<string, string | number>): string => {
  let result = str;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{${key}}`, 'g'), String(value));
  });
  return result;
};

// Fungsi komprehensif untuk menerjemahkan teks statis
export const translateStaticText = async (
  key: string,
  locale: Locale,
  params?: Record<string, string | number>,
  fallback?: string
): Promise<string> => {
  const dictionary = await getLocalDictionary(locale);
  let translation = getLocalTranslation(dictionary, key, fallback || key);

  // Jika ada parameter, lakukan interpolasi
  if (params) {
    translation = interpolate(translation, params);
  }

  return translation;
};
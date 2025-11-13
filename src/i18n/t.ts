// src/i18n/t.ts
import { Locale } from './config';

// Tipe untuk menyimpan terjemahan
export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}



// Fungsi untuk mengambil terjemahan dari kamus
export const getTranslation = (
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

// Fungsi terjemahan utama
export const t = async (
  key: string,
  locale: Locale = 'en',
  fallback: string = key,
  useDatabaseFallback: boolean = true  // Kembalikan ke true untuk mendukung terjemahan dinamis
): Promise<string> => {
  // Coba ambil terjemahan dari file lokal terlebih dahulu
  const localTranslation = await getLocalTranslation(key, locale);
  if (localTranslation !== key) {
    return localTranslation;
  }

  // Jika tidak ditemukan di file lokal dan fitur database aktif, coba dari database
  if (useDatabaseFallback) {
    const dbTranslation = await getDatabaseTranslation(key, locale);
    if (dbTranslation !== key) {
      return dbTranslation;
    }
  }

  return fallback;
};

// Fungsi untuk mengambil terjemahan dari file lokal
const getLocalTranslation = async (key: string, locale: Locale): Promise<string> => {
  try {
    // Dinamis impor file terjemahan berdasarkan locale
    const localeData = await import(`../locales/${locale}/common.json`);
    return getTranslation(localeData.default, key, key);
  } catch (error) {
    console.warn(`Locale file not found for ${locale}:`, error);
    return key;
  }
};

// Fungsi untuk mengambil terjemahan dari database
const getDatabaseTranslation = async (key: string, locale: Locale): Promise<string> => {
  try {
    // Di sini kita akan mengambil terjemahan dari tabel translations di database
    const { createClient } = await import('../lib/supabase/client');
    const supabase = createClient();

    const { data, error, status } = await supabase
      .from('translations')
      .select('value')
      .eq('key', key)
      .eq('lang', locale)
      .single();

    // Cek status untuk menangani kasus data tidak ditemukan
    if (error) {
      // Jika error adalah karena data tidak ditemukan (status 406), kembalikan key asli
      if (status === 406 || error.code === 'ROW_NOT_FOUND') {
        return key; // Kembalikan key asli jika tidak ditemukan
      }
      // Tangani error lainnya seperti tabel tidak ditemukan
      if (error.code === '42P01' || error.code === 'UNDEFINED_TABLE') { // Error kode untuk tabel tidak ditemukan
        console.warn('Translations table not found in database:', error.message);
        return key; // Kembalikan key asli jika tabel tidak ditemukan
      }
      // Untuk error lain, log tapi tetap kembalikan key asli
      console.warn('Database translation lookup failed for key:', key, error);
      return key;
    }

    return data?.value || key;
  } catch (error: unknown) {
    // Log error untuk debugging, tapi tidak menghentikan aplikasi
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn('Failed to fetch translation from database for key:', key, errorMessage);
    return key;
  }
};

// Fungsi untuk mengambil terjemahan secara sinkron (jika diperlukan)
export const tSync = (
  key: string,
  dictionary: TranslationDictionary,
  fallback: string = key
): string => {
  return getTranslation(dictionary, key, fallback);
};
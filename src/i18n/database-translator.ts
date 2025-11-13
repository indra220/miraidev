// src/i18n/database-translator.ts
import { Locale } from './config';
import { translateAndSave } from './translation-service';

// Interface untuk data terjemahan
export interface TranslatableData {
  key: string;
  value: string;
}

// Fungsi untuk mendapatkan data terjemahan berdasarkan kunci dan bahasa
export const getTranslatedData = async (
  key: string,
  targetLang: Locale,
  fallbackLang: Locale = 'en'
): Promise<string> => {
  try {
    const { createClient } = await import('../lib/supabase/client');
    const supabase = createClient();

    // Coba ambil terjemahan dalam bahasa target
    const { data: translation, error } = await supabase
      .from('translations')
      .select('value')
      .eq('key', key)
      .eq('lang', targetLang)
      .single();

    if (error) {
      console.warn(`Translation not found for key '${key}' in language '${targetLang}':`, error);
      
      // Jika tidak ditemukan, coba ambil dari bahasa fallback
      if (targetLang !== fallbackLang) {
        const { data: fallbackTranslation, error: fallbackError } = await supabase
          .from('translations')
          .select('value')
          .eq('key', key)
          .eq('lang', fallbackLang)
          .single();

        if (fallbackError) {
          console.warn(`Fallback translation not found for key '${key}' in language '${fallbackLang}':`, fallbackError);
          return key; // Kembalikan kunci asli jika tidak ada terjemahan
        }

        return fallbackTranslation?.value || key;
      }
      
      return key;
    }

    return translation?.value || key;
  } catch (error) {
    console.error('Error fetching translated data:', error);
    return key;
  }
};

// Fungsi untuk menerjemahkan data dari tabel-tabel tertentu
export const translateTableData = async (
  tableName: string,
  recordId: string,
  columnToTranslate: string,
  targetLang: Locale,
  sourceLang: Locale = 'id'
): Promise<string> => {
  try {
    const { createClient } = await import('../lib/supabase/client');
    const supabase = createClient();

    // Ambil data asli dari tabel
    const { data: record, error } = await supabase
      .from(tableName)
      .select(columnToTranslate)
      .eq('id', recordId)
      .single();

    if (error) {
      console.error(`Error fetching record from ${tableName}:`, error);
      return '';
    }

    if (!record || typeof record === 'object' && 'error' in record) {
      return '';
    }

    // Dapatkan nilai dari kolom yang dituju
    const sourceText = record && typeof record === 'object' && columnToTranslate in record
      ? (record as Record<string, unknown>)[columnToTranslate] as string
      : '';
    
    if (!sourceText) {
      return '';
    }

    // Buat kunci terjemahan
    const translationKey = `${tableName}.${recordId}.${columnToTranslate}`;

    // Dapatkan terjemahan atau buat baru jika belum ada
    const translationResult = await translateAndSave(translationKey, sourceText, targetLang, sourceLang);

    if (translationResult.success && translationResult.translatedText) {
      return translationResult.translatedText;
    } else {
      console.error('Translation failed:', translationResult.error);
      return sourceText; // Kembalikan teks asli jika terjemahan gagal
    }
  } catch (error) {
    console.error('Error translating table data:', error);
    return '';
  }
};

// Fungsi untuk mengambil dan menerjemahkan koleksi data
export type FilterValue = {
  operator?: string;
  value?: string | number | boolean;
} | string | number | boolean;

export const translateCollectionData = async (
  tableName: string,
  columnsToTranslate: string[],
  targetLang: Locale,
  sourceLang: Locale = 'id',
  filters?: Record<string, FilterValue>
): Promise<Record<string, string | number | boolean | object>[]> => {
  try {
    const { createClient } = await import('../lib/supabase/client');
    const supabase = createClient();

    // Bangun query dengan filter
    let query = supabase.from(tableName).select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Jika value adalah objek, kita asumsikan ini untuk operasi kompleks seperti range
          if (value.operator && value.value) {
            query = query.filter(key, value.operator, value.value);
          }
        } else {
          query = query.eq(key, value);
        }
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching records from ${tableName}:`, error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Proses setiap record untuk menerjemahkan kolom yang ditentukan
    const translatedData = await Promise.all(data.map(async (record) => {
      const translatedRecord: Record<string, string | number | boolean | object> = { ...record };

      for (const column of columnsToTranslate) {
        if (record[column]) {
          const translationKey = `${tableName}.${record.id || record.name || 'unknown'}.${column}`;
          const sourceText = record[column];

          const translationResult = await translateAndSave(translationKey, sourceText, targetLang, sourceLang);

          if (translationResult.success && translationResult.translatedText) {
            translatedRecord[column] = translationResult.translatedText;
          }
          // Jika terjemahan gagal, kita tetap gunakan teks asli
        }
      }

      return translatedRecord;
    }));

    return translatedData;
  } catch (error) {
    console.error('Error translating collection data:', error);
    return [];
  }
};

// Fungsi untuk membuat terjemahan manual dari admin
export const createManualTranslation = async (
  key: string,
  lang: Locale,
  value: string
): Promise<boolean> => {
  try {
    const { createClient } = await import('../lib/supabase/client');
    const supabase = createClient();

    // Cek apakah terjemahan sudah ada
    const { data: existingTranslation } = await supabase
      .from('translations')
      .select('id')
      .eq('key', key)
      .eq('lang', lang)
      .single();

    if (existingTranslation) {
      // Update jika sudah ada
      const { error } = await supabase
        .from('translations')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key)
        .eq('lang', lang);

      if (error) {
        console.error('Error updating translation:', error);
        return false;
      }
    } else {
      // Insert jika belum ada
      const { error } = await supabase
        .from('translations')
        .insert([{ 
          key, 
          lang, 
          value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error inserting translation:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in createManualTranslation:', error);
    return false;
  }
};

// Fungsi untuk menerjemahkan kolom-kolom dalam data harga (menggunakan tabel-tabel yang berkaitan)
export const translatePricingData = async (targetLang: Locale, sourceLang: Locale = 'id') => {
  try {
    const translationResults = {
      complexityPrices: await translateCollectionData(
        'complexity_prices', 
        ['label_key', 'description_key'], 
        targetLang, 
        sourceLang
      ),
      featurePrices: await translateCollectionData(
        'feature_prices', 
        ['name_key', 'description_key'], 
        targetLang, 
        sourceLang
      ),
      timelinePrices: await translateCollectionData(
        'timeline_prices', 
        ['label_key', 'description_key'], 
        targetLang, 
        sourceLang
      ),
      pricingPackages: await translateCollectionData(
        'pricing_packages', 
        ['name_key', 'description_key'], 
        targetLang, 
        sourceLang
      ),
      projectTypes: await translateCollectionData(
        'project_types', 
        ['name_key', 'description_key'], 
        targetLang, 
        sourceLang
      )
    };

    return translationResults;
  } catch (error) {
    console.error('Error translating pricing data:', error);
    return null;
  }
};
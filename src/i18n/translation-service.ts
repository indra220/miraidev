// src/i18n/translation-service.ts
import { Locale } from './config';

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

interface TranslationResult {
  success: boolean;
  translatedText?: string;
  error?: string;
}

// Fungsi untuk menerjemahkan teks menggunakan Google Gemini
export const translateWithGemini = async (
  text: string,
  targetLang: Locale,
  sourceLang: Locale = 'id'
): Promise<TranslationResult> => {
  if (!GEMINI_API_KEY) {
    return {
      success: false,
      error: 'Google Gemini API key is not configured'
    };
  }

  try {
    // Format permintaan untuk Google Gemini API
    const prompt = `Translate the following text from ${sourceLang === 'id' ? 'Indonesian' : 'English'} to ${targetLang === 'id' ? 'Indonesian' : 'English'}. Only return the translated text, nothing else:\n\n${text}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!translatedText) {
      return {
        success: false,
        error: 'No translation returned from Gemini API'
      };
    }

    return {
      success: true,
      translatedText
    };
  } catch (error) {
    console.error('Error translating with Gemini:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Fungsi untuk menyimpan terjemahan ke database
export const saveTranslationToDB = async (
  key: string,
  sourceText: string,
  translatedText: string,
  targetLang: Locale
): Promise<boolean> => {
  try {
    const { createClient } = await import('../lib/supabase/client');
    const supabase = createClient();

    // Cek apakah terjemahan sudah ada
    const { data: existingTranslation } = await supabase
      .from('translations')
      .select('id')
      .eq('key', key)
      .eq('lang', targetLang)
      .single();

    if (existingTranslation) {
      // Jika sudah ada, lakukan update
      const { error: updateError } = await supabase
        .from('translations')
        .update({ value: translatedText, updated_at: new Date().toISOString() })
        .eq('key', key)
        .eq('lang', targetLang);

      if (updateError) {
        console.error('Error updating translation:', updateError);
        return false;
      }
    } else {
      // Jika belum ada, lakukan insert
      const { error: insertError } = await supabase
        .from('translations')
        .insert([{ 
          key, 
          lang: targetLang, 
          value: translatedText,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('Error inserting translation:', insertError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving translation to database:', error);
    return false;
  }
};

// Fungsi untuk menerjemahkan dan menyimpan terjemahan jika belum ada
export const translateAndSave = async (
  key: string,
  sourceText: string,
  targetLang: Locale,
  sourceLang: Locale = 'id'
): Promise<TranslationResult> => {
  try {
    // Coba ambil terjemahan dari database terlebih dahulu
    const { createClient } = await import('../lib/supabase/client');
    const supabase = createClient();

    const { data, error } = await supabase
      .from('translations')
      .select('value')
      .eq('key', key)
      .eq('lang', targetLang)
      .single();

    if (error) {
      console.error('Error fetching translation from database:', error);
    }

    // Jika terjemahan sudah ada di database, kembalikan
    if (data?.value) {
      return {
        success: true,
        translatedText: data.value
      };
    }

    // Jika belum ada, terjemahkan dengan Gemini
    const translationResult = await translateWithGemini(sourceText, targetLang, sourceLang);

    if (translationResult.success && translationResult.translatedText) {
      // Simpan terjemahan ke database
      const saveSuccess = await saveTranslationToDB(key, sourceText, translationResult.translatedText, targetLang);

      if (!saveSuccess) {
        console.warn('Failed to save translation to database, but translation was successful');
      }
    }

    return translationResult;
  } catch (error) {
    console.error('Error in translateAndSave:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
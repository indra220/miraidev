// src/i18n/Translate.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from './useLanguage';
import { translateStaticText } from './local-translation-service';
import DOMPurify from 'isomorphic-dompurify';

interface TranslateProps {
  children?: React.ReactNode;
  i18nKey: string;
  fallback?: string;
  params?: Record<string, string | number>;
  component?: keyof React.JSX.IntrinsicElements;
  className?: string;
}

const Translate: React.FC<TranslateProps> = ({ 
  i18nKey, 
  fallback, 
  params,
  component: Component = 'span',
  className,
  children
}) => {
  const { locale } = useLanguage();
  const [translation, setTranslation] = useState<string>(fallback || i18nKey);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchTranslation = async () => {
      const translatedText = await translateStaticText(i18nKey, locale, params, fallback);
      // Gunakan DOMPurify untuk membersihkan HTML yang mungkin mengandung script berbahaya
      const sanitizedText = DOMPurify.sanitize(translatedText);
      setTranslation(sanitizedText);
      setIsLoading(false);
    };

    fetchTranslation();
  }, [i18nKey, locale, params, fallback]);

  // Jika ada children, render sebagai wrapper biasa
  if (children) {
    return (
      <Component className={`${className} translate-content`}>
        <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
          {isLoading ? <span style={{ visibility: 'hidden', display: 'inline' }}>{fallback || i18nKey}</span> : translation}
        </span>
        {children}
      </Component>
    );
  }

  // Jika translation mengandung HTML dan komponen bukan option
  if (translation.includes('<') && translation.includes('>')) {
    // Untuk komponen option, hanya tampilkan teks tanpa HTML
    if (Component === 'option') {
      // Hapus tag HTML dan tampilkan hanya teksnya
      const textOnly = translation.replace(/<[^>]*>/g, '');
      return (
        <Component className={`${className} translate-content`}>
          <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
            {isLoading ? <span style={{ visibility: 'hidden', display: 'inline' }}>{textOnly}</span> : textOnly}
          </span>
        </Component>
      );
    } else {
      return (
        <Component 
          className={`${className} translate-content`}
          dangerouslySetInnerHTML={{ 
            __html: isLoading
              ? `<span style="visibility: hidden; display: inline;">${DOMPurify.sanitize(fallback || i18nKey)}</span>`
              : translation 
          }} 
        />
      );
    }
  }

  // Jika tidak, tampilkan sebagai teks biasa
  return (
    <Component className={`${className} translate-content`}>
      <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        {isLoading ? <span style={{ visibility: 'hidden', display: 'inline' }}>{fallback || i18nKey}</span> : translation}
      </span>
    </Component>
  );
};

export default Translate;
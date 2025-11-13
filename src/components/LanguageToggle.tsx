// src/components/LanguageToggle.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import { LOCALE_LABELS, Locale } from '@/i18n/config';

// Mapping untuk singkatan bahasa
const LOCALE_SHORTCUTS: Record<Locale, string> = {
  en: 'EN',
  id: 'ID'
};

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="language-toggle-btn border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700">
          <Globe className="h-4 w-4 mr-2" />
          <span className="flex justify-center w-full">{LOCALE_SHORTCUTS[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
        {(Object.keys(LOCALE_LABELS) as Locale[]).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLocaleChange(lang)}
            className={`language-dropdown-item ${
              locale === lang
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {LOCALE_LABELS[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
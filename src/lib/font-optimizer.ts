// src/lib/font-optimizer.ts
import { Geist, Geist_Mono } from 'next/font/google';

// Optimalkan loading font dengan preload dan subset yang tepat
export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Tampilkan fallback font saat font sedang dimuat
  preload: true,
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap', // Tampilkan fallback font saat font sedang dimuat
  preload: true,
});
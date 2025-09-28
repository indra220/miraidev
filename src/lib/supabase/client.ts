// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

// Klien ini untuk digunakan di sisi klien (komponen dengan 'use client')
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
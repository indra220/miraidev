// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

// Klien KHUSUS ini hanya boleh digunakan di sisi server
// untuk tugas yang memerlukan hak akses penuh (melewati RLS)
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY tidak diatur.');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
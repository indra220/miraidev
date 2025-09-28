import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public Supabase client for accessing public data
// **PERBAIKAN: Menambahkan opsi untuk tidak menyimpan sesi**
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        cache: "no-store",
      });
    },
  },
  auth: {
    persistSession: false, // <-- Perubahan di sini
  },
});

// Server-side Supabase client (for admin operations)
// Tidak ada perubahan di sini karena sesi server-side bersifat stateless
export async function createSupabaseAdminClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          cache: "no-store",
        });
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Client-side Supabase client (when needed for public operations)
// **PERBAIKAN: Menambahkan opsi untuk tidak menyimpan sesi**
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          cache: "no-store",
        });
      },
    },
    auth: {
      persistSession: false, // <-- Perubahan di sini
    },
  });
}
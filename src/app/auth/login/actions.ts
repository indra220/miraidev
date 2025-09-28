// src/app/auth/login/actions.ts

'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface FormState {
  error: string | null;
}

export async function loginClient(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Error ini diharapkan terjadi di Server Action dan bisa diabaikan.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Error ini diharapkan terjadi di Server Action dan bisa diabaikan.
          }
        },
      },
    }
  );

  // Langkah 1: Lakukan autentikasi pengguna
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { error: 'Email atau kata sandi yang Anda masukkan salah.' };
  }

  // Langkah 2: Periksa 'role' dari user_metadata yang dikembalikan setelah login berhasil.
  // Ini lebih cepat dan terintegrasi langsung dengan sistem Auth Supabase.
  const userRole = data.user?.user_metadata?.role;

  if (userRole === 'admin') {
    // Langkah 3: Jika pengguna adalah admin, segera logout untuk membatalkan sesi
    await supabase.auth.signOut();
    return { error: 'Akun admin tidak dapat login di sini. Silakan gunakan halaman login admin.' };
  }

  // Langkah 4: Jika pengguna bukan admin, arahkan ke halaman beranda
  redirect('/beranda');
}
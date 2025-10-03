import { ReactNode } from 'react';
import SessionTimeoutWrapper from '@/components/SessionTimeoutWrapper';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProfileLayout({ 
  children 
}: { 
  children: ReactNode 
}) {
  // Periksa apakah user sudah login
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
            // Error ini diharapkan terjadi di Server Component, bisa diabaikan
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Error ini diharapkan terjadi di Server Component, bisa diabaikan
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Jika tidak ada user, redirect ke halaman login
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        {children}
        <SessionTimeoutWrapper />
      </div>
    </div>
  );
}
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: '', ...options })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();

  const isAuthPage = req.nextUrl.pathname.startsWith('/auth') || req.nextUrl.pathname.startsWith('/admin/login');

  // Jika belum login dan mencoba akses halaman terproteksi
  if (!session && (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/admin/'))) {
    if (!isAuthPage) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  // Jika sudah login dan mencoba akses halaman auth (login/register)
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Proteksi halaman admin
  if (req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/admin/login')) {
    if (!session || user?.user_metadata?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
}
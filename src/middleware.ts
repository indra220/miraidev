import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Buat Supabase client dengan cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: Record<string, unknown>) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Proteksi route user dashboard
  if (req.nextUrl.pathname.startsWith('/user/dashboard')) {
    if (!session) {
      // Redirect ke halaman login user
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/user/login'
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Proteksi route admin dashboard
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      // Redirect ke halaman login admin
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      return NextResponse.redirect(redirectUrl)
    }
    
    // Cek apakah user adalah admin (ini bisa disesuaikan dengan implementasi nyata)
    // Untuk sekarang kita asumsikan semua user yang login bisa mengakses admin
  }

  // Redirect user yang sudah login saat mencoba mengakses halaman login/register user
  if (session && (req.nextUrl.pathname === '/user/login' || req.nextUrl.pathname === '/user/register')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/user/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect admin yang sudah login saat mencoba mengakses halaman login admin
  if (session && req.nextUrl.pathname === '/admin/login') {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/admin/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    '/user/dashboard/:path*',
    '/user/login',
    '/user/register',
    '/admin/:path*',
    '/admin/login'
  ]
}
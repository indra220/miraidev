import { NextResponse } from "next/server";

// Middleware untuk mengatur header keamanan dan redirect
export function middleware() {
  const response = NextResponse.next();
  
  // Tambahkan security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware untuk mengatur header keamanan
export function middleware(_request: NextRequest) { // eslint-disable-line @typescript-eslint/no-unused-vars
  const response = NextResponse.next();
  
  // Tambahkan security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export const config = {
  matcher: ["/((?!.*\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
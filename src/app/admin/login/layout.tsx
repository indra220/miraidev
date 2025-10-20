// src/app/admin/login/layout.tsx
import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginLayout({ 
  children 
}: { 
  children: ReactNode 
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
       <header className="absolute top-0 left-0 p-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
          <Image
            src="/images/logo-rebg.png"
            alt="MiraiDev Logo"
            width={48}
            height={48}
            priority
          />
          <span className="text-xl font-bold text-white">MiraiDev</span>
        </Link>
      </header>
      <main className="w-full max-w-md">
        {children}
      </main>
    </div>
  );
}
// src/components/auth/auth-storage-handler.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { clearAuthInfoFromStorage } from '@/utils/auth-utils';

export default function AuthStorageHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Cek apakah ini adalah redirect setelah login
    const isTimeout = searchParams.get('timeout') === 'true';
    
    // Hapus data sessionStorage jika terjadi timeout
    if (isTimeout) {
      clearAuthInfoFromStorage();
    }
  }, [pathname, searchParams]);

  return null; // Komponen ini tidak merender apa-apa
}
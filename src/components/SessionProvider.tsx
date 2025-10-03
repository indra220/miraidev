"use client";

import { useAuth } from "@/hooks/useAuth";
import SessionTimeoutHandler from "@/components/SessionTimeoutHandler";

export default function SessionProvider() {
  const { session, loading } = useAuth();

  // Jangan tampilkan apa pun saat status otentikasi sedang diperiksa
  if (loading) {
    return null;
  }

  // Hanya jalankan SessionTimeoutHandler jika ada sesi (pengguna sudah login)
  if (session) {
    return <SessionTimeoutHandler />;
  }

  // Jika tidak ada sesi, jangan lakukan apa-apa
  return null;
}
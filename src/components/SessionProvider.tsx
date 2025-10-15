"use client";

import { useAuth } from "@/hooks/useAuth";
import SessionTimeoutHandler from "@/components/SessionTimeoutHandler";

export default function SessionProvider() {
  const { user, loading } = useAuth();

  // Jangan tampilkan apa pun saat status otentikasi sedang diperiksa
  if (loading) {
    return null;
  }

  // Hanya jalankan SessionTimeoutHandler jika ada user (pengguna sudah login)
  if (user) {
    return <SessionTimeoutHandler />;
  }

  // Jika tidak ada sesi, jangan lakukan apa-apa
  return null;
}
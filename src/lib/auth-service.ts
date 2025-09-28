// src/lib/auth-service.ts

import { createSupabaseClient } from "./supabase";

// Cache di sisi klien untuk mengurangi panggilan API yang berulang
const roleCache = {
  role: null as string | null,
  timestamp: 0,
};
const CACHE_DURATION = 2 * 60 * 1000; // 2 menit

// Fungsi untuk mendapatkan peran dari API server kita yang aman
async function getRoleFromServer(): Promise<string | null> {
  try {
    // Panggilan ini terjadi di browser, memanggil API route kita
    const response = await fetch('/api/auth/get-my-role', { cache: 'no-store' });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.role || null;
  } catch (error) {
    console.error("Gagal mengambil peran dari server:", error);
    return null;
  }
}

// Fungsi utama untuk memeriksa apakah pengguna adalah admin
export async function isAdmin(): Promise<boolean> {
  const supabase = createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Jika tidak ada sesi, sudah pasti bukan admin
  if (!session) {
    return false;
  }

  // Periksa cache terlebih dahulu
  if (roleCache.role !== null && Date.now() - roleCache.timestamp < CACHE_DURATION) {
    return roleCache.role === 'admin';
  }

  // Jika cache kosong atau sudah kedaluwarsa, panggil API
  const role = await getRoleFromServer();
  
  // Simpan hasil ke cache
  roleCache.role = role;
  roleCache.timestamp = Date.now();
  
  return role === 'admin';
}

// Fungsi untuk mendapatkan user saat ini
export async function getCurrentUser() {
  const supabase = createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return null;
  }
  
  // Dapatkan informasi user dari session
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    console.error("Gagal mengambil informasi user:", error);
    return null;
  }
  
  return user;
}

// Fungsi untuk logout
export async function logout() {
  const supabase = createSupabaseClient();
  await supabase.auth.signOut();
  // Kosongkan cache saat logout
  roleCache.role = null;
  roleCache.timestamp = 0;
}
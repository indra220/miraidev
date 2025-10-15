// src/lib/auth-management.ts

import { createClient } from './supabase/client';

/**
 * Fungsi untuk mengatur role pengguna di tabel profiles
 * @param userId - ID pengguna
 * @param role - Role yang akan diatur ('admin', 'klien', 'pegawai')
 * @returns Promise<boolean> - Berhasil atau tidak
 */
export async function setUserRole(userId: string, role: 'admin' | 'klien' | 'pegawai' | 'user'): Promise<boolean> {
  try {
    const supabase = createClient();
    
    // Update role di tabel profiles
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        role: role,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' }); // Gunakan upsert agar membuat profil jika belum ada

    if (error) {
      console.error('Error setting user role:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in setUserRole:', error);
    return false;
  }
}

/**
 * Fungsi untuk mendapatkan role pengguna dari tabel profiles
 * @param userId - ID pengguna
 * @returns Promise<string | null> - Role pengguna atau null jika tidak ditemukan
 */
export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error getting user role:', error);
      return null;
    }
    
    return data?.role || null;
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return null;
  }
}

/**
 * Fungsi untuk memeriksa apakah pengguna adalah admin
 * @param userId - ID pengguna
 * @returns Promise<boolean> - Apakah pengguna adalah admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const role = await getUserRole(userId);
    return role === 'admin';
  } catch (error) {
    console.error('Error in isUserAdmin:', error);
    return false;
  }
}

/**
 * Fungsi untuk menyinkronkan role dari user_metadata ke tabel profiles
 * Ini digunakan untuk migrasi data lama
 * @returns Promise<boolean> - Berhasil atau tidak
 */
export async function syncRoleToProfile(): Promise<boolean> {
  try {
    const supabase = createClient();
    
    // Dapatkan sesi pengguna
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return false;
    }
    
    // Dapatkan role dari user_metadata
    const userMetadataRole = session.user.user_metadata?.role as string;
    
    if (userMetadataRole) {
      // Update role di tabel profiles
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          role: userMetadataRole,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      
      if (error) {
        console.error('Error syncing role to profile:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in syncRoleToProfile:', error);
    return false;
  }
}

/**
 * Fungsi untuk memastikan profil pengguna ada di tabel profiles
 * @param userId - ID pengguna
 * @param email - Email pengguna
 * @returns Promise<boolean> - Berhasil atau tidak
 */
export async function ensureUserProfile(userId: string, email?: string): Promise<boolean> {
  try {
    const supabase = createClient();
    
    // Periksa apakah profil sudah ada
    const { data: existingProfile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 berarti tidak ditemukan
      console.error('Error checking profile existence:', error);
      return false;
    }
    
    // Jika profil belum ada, buat profil baru dengan role default 'user'
    if (!existingProfile) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          role: 'user',
          updated_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('Error creating user profile:', insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in ensureUserProfile:', error);
    return false;
  }
}
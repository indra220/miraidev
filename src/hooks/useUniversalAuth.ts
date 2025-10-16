import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { setAuthInfoToStorage, getAuthInfoFromStorage, clearAuthInfoFromStorage } from "@/utils/auth-utils";

interface UniversalAuthState {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  role: string | null;
  error: string | null;
}

export const useUniversalAuth = (): UniversalAuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const checkUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          setUser(session.user);
          
          // Cek apakah role sudah tersimpan di sessionStorage
          const { role: storedRole } = getAuthInfoFromStorage();
          if (storedRole) {
            setRole(storedRole);
            setIsAdmin(storedRole === 'admin');
            setIsLoading(false);
            return;
          }
          
          // Ambil role dari user_metadata terlebih dahulu (lebih cepat)
          const userRole = session.user.user_metadata?.role as string || 'user';
          setRole(userRole);
          setIsAdmin(userRole === 'admin');
          
          // Simpan role ke sessionStorage
          setAuthInfoToStorage(userRole, session.user.id);
          
          // Jika role di user_metadata tidak valid atau kosong, ambil dari tabel profiles
          if (!userRole || userRole === 'user') {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            if (!profileError && profileData?.role) {
              const profileRole = profileData.role;
              setRole(profileRole);
              setIsAdmin(profileRole === 'admin');
              // Perbarui role di sessionStorage
              setAuthInfoToStorage(profileRole, session.user.id);
            }
          }
        } else {
          setUser(null);
          setRole(null);
          setIsAdmin(false);
          clearAuthInfoFromStorage(); // Bersihkan sessionStorage saat logout
        }
      } catch (err) {
        console.error('Error during auth check:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setUser(null);
        setRole(null);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Set up real-time listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          // Cek apakah role sudah tersimpan di sessionStorage
          const { role: storedRole } = getAuthInfoFromStorage();
          if (storedRole) {
            setRole(storedRole);
            setIsAdmin(storedRole === 'admin');
            setIsLoading(false);
            return;
          }
          
          // Ambil role dari user_metadata terlebih dahulu (lebih cepat)
          const userRole = session.user.user_metadata?.role as string || 'user';
          setRole(userRole);
          setIsAdmin(userRole === 'admin');
          
          // Simpan role ke sessionStorage
          setAuthInfoToStorage(userRole, session.user.id);
          
          // Jika role di user_metadata tidak valid atau kosong, ambil dari tabel profiles
          if (!userRole || userRole === 'user') {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            if (!profileError && profileData?.role) {
              const profileRole = profileData.role;
              setRole(profileRole);
              setIsAdmin(profileRole === 'admin');
              // Perbarui role di sessionStorage
              setAuthInfoToStorage(profileRole, session.user.id);
            }
          }
        } else {
          setUser(null);
          setRole(null);
          setIsAdmin(false);
          clearAuthInfoFromStorage(); // Bersihkan sessionStorage saat logout
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading, isAdmin, role, error };
};
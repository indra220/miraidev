import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // PERBAIKAN: Path import diubah ke file yang benar
import { User } from "@supabase/supabase-js";
import { setAuthInfoToStorage, getAuthInfoFromStorage, clearAuthInfoFromStorage } from "@/utils/auth-utils";

interface AuthState {
  user: User | null;
  loading: boolean;
  role: string | null;
  isAdmin: boolean;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Buat client di dalam useEffect untuk memastikan hanya berjalan di sisi client
    const supabase = createClient();

    const checkUser = async (session: { user: User } | null) => {
      if (session?.user) {
        setUser(session.user);
        
        // Cek apakah role sudah tersimpan di sessionStorage
        const { role: storedRole } = getAuthInfoFromStorage();
        if (storedRole) {
          setRole(storedRole);
          setIsAdmin(storedRole === 'admin');
          setLoading(false);
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
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (!error && profileData?.role) {
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
      setLoading(false);
    };

    // onAuthStateChange sudah cukup untuk menangani sesi awal dan perubahannya
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await checkUser(session);
      }
    );

    // Cek sesi awal
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await checkUser(session);
    };
    
    checkInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Cukup dijalankan sekali saat komponen mount

  return { user, loading, role, isAdmin };
};
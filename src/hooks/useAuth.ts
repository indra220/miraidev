import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // PERBAIKAN: Path import diubah ke file yang benar
import { User } from "@supabase/supabase-js";

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
        
        // Ambil role dari tabel profiles
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          // Jika gagal mengambil dari profiles, default ke user biasa
          setRole('user');
          setIsAdmin(false);
        } else {
          const userRole = profileData?.role || 'user';
          setRole(userRole);
          setIsAdmin(userRole === 'admin');
        }
      } else {
        setUser(null);
        setRole(null);
        setIsAdmin(false);
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
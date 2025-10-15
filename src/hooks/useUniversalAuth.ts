import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

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
          
          // Ambil role dari tabel profiles, bukan dari user_metadata
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            // Jika gagal mengambil dari profiles, coba dari user_metadata sebagai fallback
            const fallbackRole = session.user.user_metadata?.role as string;
            setRole(fallbackRole || 'user');
            setIsAdmin(fallbackRole === 'admin');
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
          
          // Ambil role dari tabel profiles
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            // Jika gagal mengambil dari profiles, coba dari user_metadata sebagai fallback
            const fallbackRole = session.user.user_metadata?.role as string;
            setRole(fallbackRole || 'user');
            setIsAdmin(fallbackRole === 'admin');
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
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading, isAdmin, role, error };
};
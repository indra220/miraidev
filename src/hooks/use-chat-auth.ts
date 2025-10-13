import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';

// Hook khusus untuk manajemen otentikasi chat
export const useChatAuth = () => {
  const [supabase] = useState(() => 
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user;
        
        if (currentUser) {
          setUser(currentUser);
          
          // Periksa apakah pengguna adalah admin
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentUser.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            // Coba periksa dari user metadata sebagai fallback
            const isAdminFromMetadata = currentUser.user_metadata?.role === 'admin';
            setIsAdmin(isAdminFromMetadata);
          } else {
            const isAdminFromProfile = profileData?.role === 'admin';
            setIsAdmin(isAdminFromProfile);
          }
        }
      } catch (error) {
        console.error('Error during auth check:', error);
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
          
          // Periksa apakah pengguna adalah admin
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            // Coba periksa dari user metadata sebagai fallback
            const isAdminFromMetadata = session.user.user_metadata?.role === 'admin';
            setIsAdmin(isAdminFromMetadata);
          } else {
            const isAdminFromProfile = profileData?.role === 'admin';
            setIsAdmin(isAdminFromProfile);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, isLoading, isAdmin, supabase };
};
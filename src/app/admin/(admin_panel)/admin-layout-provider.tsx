"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@/lib/supabase/client';
import AdminSidebar from '@/components/admin-sidebar';
import AdminHeader from '@/components/admin-header';
import { SidebarProvider } from '@/contexts/sidebar-provider';

interface AdminLayoutProviderProps {
  children: React.ReactNode;
}

export default function AdminLayoutProvider({ children }: AdminLayoutProviderProps) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>('user'); // Default role
  const [loading, setLoading] = useState(true);

  // Ambil informasi user dan role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Ambil role dari tabel profiles, bukan dari user_metadata
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            // Jika gagal mengambil dari profiles, default ke user biasa
            setUserRole('user');
          } else {
            setUserRole(data?.role || 'user');
          }
        } else {
          // Jika tidak ada user, redirect ke login
          router.push('/admin/login');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user info:', error);
        router.push('/admin/login');
      }
    };

    fetchUserRole();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 flex">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Memuat...</div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 overflow-y-hidden">
        <AdminSidebar userRole={userRole} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader userRole={userRole} />
          <main className="flex-1 overflow-y-auto hide-scrollbar p-4 sm:p-6 md:pr-8 md:pt-8 md:pb-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
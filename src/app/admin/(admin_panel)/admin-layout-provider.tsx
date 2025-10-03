"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';
import { 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { AdminMenuItem, getUserMenu } from '@/constants/admin-menu';

interface AdminLayoutProviderProps {
  children: React.ReactNode;
}

export default function AdminLayoutProvider({ children }: AdminLayoutProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('admin'); // Default role
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil informasi user dan role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Ambil role dari user_metadata atau gunakan default
          const role = user.user_metadata?.role || 'admin';
          setUserRole(role);
          setMenuItems(getUserMenu(role));
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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Memuat...</div>
        </div>
      </div>
    );
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-8 pt-4">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
          <span className="font-bold text-white">M</span>
        </div>
        <div>
          <h1 className="text-xl font-bold">MiraiDev Admin</h1>
          <p className="text-sm text-gray-400">Role: {userRole}</p>
        </div>
      </div>
      <nav className="flex-grow">
        {menuItems.map((item) => {
          const ItemIcon = item.icon;
          return (
            <Link 
              key={item.id}
              href={item.href}
              onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-colors ${
                pathname === item.href 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <ItemIcon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 bg-red-600/20 text-red-400 hover:bg-red-600/30 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white p-4 border-r border-gray-700 fixed h-full">
        {sidebarContent}
      </aside>

      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-gray-800/80 backdrop-blur-sm text-white border border-gray-700/50"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out p-4 border-r border-gray-700
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}
      >
        {sidebarContent}
      </aside>
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto md:ml-64">
        {children}
      </main>
    </div>
  );
}
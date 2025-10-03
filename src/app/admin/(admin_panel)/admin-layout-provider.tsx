"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutDashboard as Dashboard,
  FolderOpen, 
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Users,
  BarChart3
} from "lucide-react";

interface AdminLayoutProviderProps {
  children: React.ReactNode;
}

export default function AdminLayoutProvider({ children }: AdminLayoutProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const menuItems = [
    { href: "/admin/dashboard", label: "Dasbor", icon: Dashboard },
    { href: "/admin/analytics", label: "Analitik", icon: BarChart3 },
    { href: "/admin/portfolio", label: "Portofolio", icon: FolderOpen },
    { href: "/admin/services", label: "Layanan", icon: FolderOpen },
    { href: "/admin/contact", label: "Kontak", icon: MessageSquare },
    { href: "/admin/clients", label: "Klien", icon: Users },
    { href: "/admin/seo", label: "SEO", icon: BarChart3 },
    { href: "/admin/settings", label: "Pengaturan", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-8 pt-4">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
          <span className="font-bold text-white">M</span>
        </div>
        <h1 className="text-xl font-bold">MiraiDev Admin</h1>
      </div>
      <nav className="flex-grow">
        {menuItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}
            className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-colors ${
              pathname === item.href 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.label}</span>
          </Link>
        ))}
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
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white p-4 border-r border-gray-700">
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
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
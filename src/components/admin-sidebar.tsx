"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';
import { 
  LogOut,
  Menu,
  X,
  Home,
  BarChart,
  Users,
  MessageCircle,
  Settings,
  FileText,
  Briefcase,
  Globe,
  Tag,
  Mail
} from "lucide-react";
import { AdminMenuItem, getUserMenu } from '@/constants/admin-menu';
import { useSidebar } from '@/contexts/useSidebar';

interface AdminSidebarProps {
  userRole: string;
}

// Komponen loading sederhana untuk lazy loading
const SidebarLoading = () => (
  <div className="p-4 space-y-3">
    <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
    <div className="h-4 bg-slate-700 rounded animate-pulse w-5/6"></div>
    <div className="h-4 bg-slate-700 rounded animate-pulse w-4/6"></div>
  </div>
);

export default function AdminSidebar({ userRole }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { width } = useSidebar(); // Gunakan context sidebar

  // Ambil menu berdasarkan role
  useEffect(() => {
    setMenuItems(getUserMenu(userRole));
    setIsClient(true);
  }, [userRole]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  // Mapping icon berdasarkan ID menu
  const getMenuIcon = (id: string) => {
    switch(id) {
      case 'dashboard':
        return Home;
      case 'analytics':
        return BarChart;
      case 'clients':
        return Users;
      case 'pesan':
        return MessageCircle;
      case 'template':
        return Briefcase;
      case 'services':
        return Briefcase;
      case 'support':
        return Mail;
      case 'seo':
        return Globe;
      case 'pricing':
        return Tag;
      case 'projects':
        return FileText;
      case 'settings':
        return Settings;
      default:
        return Menu;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-8 pt-4 px-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mr-3">
          <span className="font-bold text-white">M</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">MiraiDev Admin</h1>
          <p className="text-sm text-slate-400">Role: {userRole}</p>
        </div>
      </div>
      <nav className="flex-grow overflow-y-auto max-h-[calc(100vh-160px)] hide-scrollbar px-2">
        {menuItems.map((item) => {
          const ItemIcon = getMenuIcon(item.id);
          return (
            <Link 
              key={item.id}
              href={item.href}
              onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                pathname === item.href 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <ItemIcon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-red-100 hover:from-red-700 hover:to-red-800 rounded-lg transition-all duration-200 shadow-md"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-slate-800 text-white border border-slate-700 shadow-lg"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out border-r border-slate-700 shadow-2xl
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}
        style={{ width: `${width}px` } as React.CSSProperties}
      >
        {isClient ? (
          <Suspense fallback={<SidebarLoading />}>
            {sidebarContent}
          </Suspense>
        ) : (
          <SidebarLoading />
        )}
      </aside>
      
      {/* Desktop sidebar */}
      <aside 
        className="hidden md:flex flex-col bg-slate-900 text-white border-r border-slate-700 h-full shadow-2xl"
        style={{ width: `${width}px` } as React.CSSProperties}
      >
        {isClient ? (
          <Suspense fallback={<SidebarLoading />}>
            {sidebarContent}
          </Suspense>
        ) : (
          <SidebarLoading />
        )}
      </aside>
    </>
  );
}
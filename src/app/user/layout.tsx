"use client";

import { useState, ReactNode } from "react";
import { 
  LayoutDashboard, 
  User, 
  FolderOpen, 
  CreditCard, 
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell,
  Star,
  FileText,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "@/components/user/NotificationBell";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Profil",
      href: "/user/profile",
      icon: User,
    },
    {
      name: "Proyek Saya",
      href: "/user/projects",
      icon: FolderOpen,
    },
    {
      name: "Kalender",
      href: "/user/calendar",
      icon: Calendar,
    },
    {
      name: "File Manager",
      href: "/user/files",
      icon: FileText,
    },
    {
      name: "Ulasan & Rating",
      href: "/user/reviews",
      icon: Star,
    },
    {
      name: "Pembayaran",
      href: "/user/payments",
      icon: CreditCard,
    },
    {
      name: "Notifikasi",
      href: "/user/notifications",
      icon: Bell,
    },
    {
      name: "Bantuan",
      href: "/user/support",
      icon: HelpCircle,
    },
  ];

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logout clicked");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {sidebarOpen ? (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                <span className="font-bold text-white">M</span>
              </div>
              <span className="text-xl font-bold">MiraiDev User</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="font-bold text-white">M</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <div className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}>
                      <Icon className="h-5 w-5" />
                      {sidebarOpen && (
                        <span className="ml-3 font-medium">{item.name}</span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-start text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && (
              <span className="ml-3 font-medium">Logout</span>
            )}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700 mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              {navigation.find(item => item.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              {sidebarOpen && (
                <span className="ml-2 text-sm font-medium text-gray-700">John Doe</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
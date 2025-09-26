"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  ArrowRight,
  LogOut,
  User
} from "lucide-react";
import dynamic from "next/dynamic";

const GlobalSearch = dynamic(() => import("@/components/GlobalSearch"), {
  loading: () => <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">...</div>,
  ssr: false
});

const navigation = [
  { name: "Beranda", href: "/" },
  { name: "Layanan", href: "/layanan" },
  { name: "Portofolio", href: "/portofolio" },
  { name: "Tentang Kami", href: "/tentang" },
  { name: "Kontak", href: "/kontak" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const openMenuButtonRef = useRef<HTMLButtonElement>(null);
  
  // Check if we're on an admin page
  const isAdminPage = pathname.startsWith('/admin');

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = (await import('@/lib/supabase')).createSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        openMenuButtonRef.current?.focus();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Focus the mobile menu when opened
      mobileMenuRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
        openMenuButtonRef.current?.focus();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href={isAdminPage ? "/admin/dashboard" : "/"} className="-m-1.5 p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
            <span className="sr-only">MiraiDev</span>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                <span className="font-bold text-white">M</span>
              </div>
              <span className="text-xl font-bold">MiraiDev</span>
            </div>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            ref={openMenuButtonRef}
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Buka menu utama</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-8">
          {isAdminPage ? (
            <>
              <Link
                href="/admin/dashboard"
                className={`text-sm font-semibold leading-6 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1 ${
                  pathname === "/admin/dashboard"
                    ? "text-blue-400"
                    : "text-white hover:text-blue-300"
                }`}
                aria-current={pathname === "/admin/dashboard" ? "page" : undefined}
              >
                Dasbor
              </Link>
              <Link
                href="/admin/portfolio"
                className={`text-sm font-semibold leading-6 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1 ${
                  pathname === "/admin/portfolio"
                    ? "text-blue-400"
                    : "text-white hover:text-blue-300"
                }`}
                aria-current={pathname === "/admin/portfolio" ? "page" : undefined}
              >
                Portofolio
              </Link>
              <Link
                href="/admin/settings"
                className={`text-sm font-semibold leading-6 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1 ${
                  pathname === "/admin/settings"
                    ? "text-blue-400"
                    : "text-white hover:text-blue-300"
                }`}
                aria-current={pathname === "/admin/settings" ? "page" : undefined}
              >
                Pengaturan
              </Link>
            </>
          ) : (
            navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold leading-6 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1 ${
                  pathname === item.href
                    ? "text-blue-400"
                    : "text-white hover:text-blue-300"
                }`}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))
          )}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-4">
          {!isAdminPage && <GlobalSearch />}
          {!isAdminPage && !isAuthenticated && (
            <Link href="/user/login">
              <Button 
                variant="outline" 
                className="border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-sm font-semibold flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <User className="mr-2 h-4 w-4" />
                Masuk
              </Button>
            </Link>
          )}
          {!isAdminPage && isAuthenticated && (
            <Link href="/user/dashboard">
              <Button 
                variant="outline" 
                className="border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-sm font-semibold flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <User className="mr-2 h-4 w-4" />
                Masuk
              </Button>
            </Link>
          )}
          {isAdminPage ? (
            // Admin logout button
            <button
              onClick={async () => {
                const supabase = (await import('@/lib/supabase')).createSupabaseClient();
                await supabase.auth.signOut();
                window.location.href = "/admin/login";
              }}
              className="border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-sm font-semibold flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </button>
          ) : (
            <Link href="/kontak">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-semibold flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div 
        ref={mobileMenuRef}
        id="mobile-menu"
        className={`lg:hidden ${mobileMenuOpen ? "block" : "hidden"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        tabIndex={-1}
      >
        <div className="fixed inset-0 z-50"></div>
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href={isAdminPage ? "/admin/dashboard" : "/"} className="-m-1.5 p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
              <span className="sr-only">MiraiDev</span>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                  <span className="font-bold text-white">M</span>
                </div>
                <span className="text-xl font-bold">MiraiDev</span>
              </div>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Tutup menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {isAdminPage ? (
                  <>
                    <Link
                      href="/admin/dashboard"
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        pathname === "/admin/dashboard"
                          ? "text-blue-400"
                          : "text-white hover:bg-gray-800"
                      }`}
                      aria-current={pathname === "/admin/dashboard" ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dasbor
                    </Link>
                    <Link
                      href="/admin/portfolio"
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        pathname === "/admin/portfolio"
                          ? "text-blue-400"
                          : "text-white hover:bg-gray-800"
                      }`}
                      aria-current={pathname === "/admin/portfolio" ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Portofolio
                    </Link>
                    <Link
                      href="/admin/settings"
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        pathname === "/admin/settings"
                          ? "text-blue-400"
                          : "text-white hover:bg-gray-800"
                      }`}
                      aria-current={pathname === "/admin/settings" ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pengaturan
                    </Link>
                  </>
                ) : (
                  navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        pathname === item.href
                          ? "text-blue-400"
                          : "text-white hover:bg-gray-800"
                      }`}
                      aria-current={pathname === item.href ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))
                )}
              </div>
              
              <div className="py-6 space-y-4">
                {!isAdminPage && (
                  <div className="pb-4 border-b border-gray-700">
                    <GlobalSearch />
                  </div>
                )}
                {!isAdminPage && !isAuthenticated && (
                  <Link href="/user/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Masuk
                    </Button>
                  </Link>
                )}
                {!isAdminPage && isAuthenticated && (
                  <Link href="/user/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Masuk
                    </Button>
                  </Link>
                )}
                {isAdminPage ? (
                  <button
                    onClick={async () => {
                      const supabase = (await import('@/lib/supabase')).createSupabaseClient();
                      await supabase.auth.signOut();
                      window.location.href = "/admin/login";
                    }}
                    className="w-full border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </button>
                ) : (
                  <Link href="/kontak" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
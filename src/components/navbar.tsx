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
import { createSupabaseClient } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth-service";

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Gunakan null untuk status loading
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const openMenuButtonRef = useRef<HTMLButtonElement>(null);
  
  // Check if we're on an admin page
  const isAdminPage = pathname.startsWith('/admin');
  
  // Check if we just came from logout
  const cameFromLogout = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('logged_out') === 'true';

  // Check authentication status on mount and update as needed
  useEffect(() => {
    const checkAuthStatus = async () => {
      const supabase = createSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      // Setelah cek auth pertama kali, baru set state
      setIsAuthenticated(!!session);
      
      if (session) {
        // Hanya panggil isAdmin jika benar-benar diperlukan
        // Misalnya, hanya di halaman admin atau saat benar-benar perlu memeriksa status admin
        if (isAdminPage && isAdminUser === null) {
          const admin = await isAdmin();
          setIsAdminUser(admin);
        } else if (!isAdminPage) {
          // Untuk halaman publik, kita tidak perlu memeriksa apakah user adalah admin
          // Kita hanya perlu tahu bahwa user terautentikasi
          setIsAdminUser(false);
        }
      } else {
        // Jika tidak ada session, pastikan tidak admin
        setIsAdminUser(false);
      }
    };
    
    checkAuthStatus();
    
    // Listen for auth changes
    const { data: { subscription } } = createSupabaseClient().auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        checkAuthStatus();
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [isAdminUser, isAdminPage]);
  
  // Bersihkan parameter logged_out dari URL setelah digunakan
  useEffect(() => {
    if (cameFromLogout && typeof window !== 'undefined') {
      // Hapus parameter logged_out dari URL
      const url = new URL(window.location.href);
      url.searchParams.delete('logged_out');
      window.history.replaceState({}, '', url.toString());
    }
  }, [cameFromLogout]);

  // Bersihkan state ketika komponen di-unmount
  useEffect(() => {
    return () => {
      // Bersihkan state ketika komponen di-unmount
      console.log("Navbar unmounting, cleaning up state");
      setIsAuthenticated(null);
      setIsAdminUser(null);
    };
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

  // Function to handle logout
  const handleLogout = async () => {
    const supabase = createSupabaseClient();
    
    // Lakukan signOut dan tunggu hasilnya
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during logout:", error);
      } else {
        console.log("User logged out successfully");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
    
    // Tunggu sebentar untuk memastikan session benar-benar dihapus
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Bersihkan state lokal secara langsung
    setIsAuthenticated(false);
    setIsAdminUser(false);
    
    // Redirect ke halaman login dengan parameter logged_out=true
    window.location.href = "/auth/login?logged_out=true";
  };

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
          {isAdminPage ? (
            // Admin logout button
            <button
              onClick={handleLogout}
              className="border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-sm font-semibold flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </button>
          ) : (
            // Tampilkan loading state sementara status belum diketahui
            isAuthenticated === null ? (
              // Tampilkan placeholder atau loading state
              <div className="flex items-center gap-x-4">
                <Button variant="outline" className="border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-sm font-semibold" disabled>
                  Memuat...
                </Button>
              </div>
            ) : isAuthenticated ? (
              // User is authenticated - show logout or navigate to user area
              <div className="flex items-center gap-x-4">
                {isAdminUser ? (
                  <Link href="/admin">
                    <Button variant="outline" className="border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-sm font-semibold flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                      <User className="mr-2 h-4 w-4" />
                      Panel Admin
                    </Button>
                  </Link>
                ) : (
                  <span className="text-white">Halo, User</span>
                )}
                <button
                  onClick={handleLogout}
                  className="border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-sm font-semibold flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </button>
              </div>
            ) : (
              // User is not authenticated - show login/register buttons
              <div className="flex items-center gap-x-4">
                <Link href="/auth/login">
                  <Button variant="outline" className="border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-sm font-semibold">
                    Masuk
                  </Button>
                </Link>
                <Link href="/kontak">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-semibold flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )
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
                {isAdminPage ? (
                  <button
                    onClick={handleLogout}
                    className="w-full border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </button>
                ) : (
                  // Tampilkan loading state sementara status belum diketahui
                  isAuthenticated === null ? (
                    <div className="space-y-4">
                      <Button className="w-full border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900" disabled>
                        Memuat...
                      </Button>
                    </div>
                  ) : isAuthenticated ? (
                    // User is authenticated - show logout or navigate to user area
                    <div className="space-y-4">
                      {isAdminUser && (
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                            <User className="mr-2 h-4 w-4" />
                            Panel Admin
                          </Button>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Keluar
                      </button>
                    </div>
                  ) : (
                    // User is not authenticated - show login/register buttons
                    <div className="space-y-4">
                      <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full border border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                          Masuk
                        </Button>
                      </Link>
                      <Link href="/kontak" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
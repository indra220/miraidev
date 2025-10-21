// src/components/navbar.tsx
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
import { createClient } from "@/lib/supabase/client";
import { isAdmin, getCurrentUser } from "@/lib/auth-service";
import { Session } from "@/types/dashboard";
import Image from "next/image";

const GlobalSearch = dynamic(() => import("@/components/GlobalSearch"), {
  loading: () => <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">...</div>,
  ssr: false
});

const navigation = [
  { name: "Beranda", href: "/" },
  { name: "Layanan", href: "/layanan" },
  { name: "Portofolio", href: "/portofolio" },
  { name: "Harga", href: "/harga" },
  { name: "Tentang Kami", href: "/tentang" },
  { name: "Kontak", href: "/kontak" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<Session["user"] | null>(null);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const openMenuButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null); // Ref for desktop user menu
  const [userMenuOpen, setUserMenuOpen] = useState(false); // State for desktop user menu

  const isAdminPage = pathname.startsWith('/admin');

  const cameFromLogout = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('logged_out') === 'true';

  useEffect(() => {
    const checkAuthStatus = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      setIsAuthenticated(!!session);

      if (session) {
        const user = await getCurrentUser();
        setCurrentUser(user);

        // Always check role from auth service for consistency
        const admin = await isAdmin();
        setIsAdminUser(admin);

      } else {
        setIsAdminUser(false);
        setCurrentUser(null);
      }
    };

    checkAuthStatus();

    const { data: { subscription } } = createClient().auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        checkAuthStatus();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Removed isAdminPage and isAdminUser from dependencies

  useEffect(() => {
    if (cameFromLogout && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('logged_out');
      window.history.replaceState({}, '', url.toString());
    }
  }, [cameFromLogout]);

  useEffect(() => {
    return () => {
      setIsAuthenticated(null);
      setIsAdminUser(null);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false); // Close user menu on navigation
  }, [pathname]);

  // Close menus on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mobileMenuOpen) {
            setMobileMenuOpen(false);
            openMenuButtonRef.current?.focus();
        }
        if (userMenuOpen) {
            setUserMenuOpen(false);
            // Optionally focus the user menu trigger button
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen, userMenuOpen]);


  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        // Close mobile menu
        if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
            setMobileMenuOpen(false);
            openMenuButtonRef.current?.focus();
        }
        // Close desktop user menu
        if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
            setUserMenuOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen, userMenuOpen]);


  const handleLogout = async () => {
    const supabase = createClient();

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during logout:", error);
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    setIsAuthenticated(false);
    setIsAdminUser(false);
    setUserMenuOpen(false); // Close menu after logout

    window.location.href = "/auth/login?logged_out=true";
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href={isAdminPage ? "/admin/dashboard" : "/"} className="-m-1.5 p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
            <span className="sr-only">MiraiDev</span>
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo-rebg.png"
                alt="MiraiDev Logo"
                width={64}
                height={64}
                priority
              />
              <span className="text-xl font-bold text-white">MiraiDev</span>
            </div>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            ref={openMenuButtonRef}
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {/* Admin Menu Items */}
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
              {/* Add other admin menu items if needed */}
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
            <button
              onClick={handleLogout}
              className="border border-slate-600 text-white hover:bg-slate-800 py-2 px-4 rounded-md text-sm font-semibold flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </button>
          ) : (
            isAuthenticated === null ? (
              <div className="flex items-center gap-x-4">
                <Button variant="outline" className="border border-slate-600 text-white hover:bg-slate-800 py-2 px-4 rounded-md text-sm font-semibold" disabled>
                  Memuat...
                </Button>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-x-4">
                {/* --- DESKTOP USER DROPDOWN --- */}
                <div ref={userMenuRef} className="relative inline-block text-left">
                  <div>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-slate-700 hover:bg-slate-700"
                      id="user-menu-button-desktop"
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                    >
                      <User className="h-5 w-5" />
                    </button>
                  </div>

                  {userMenuOpen && (
                    <div
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-slate-800 shadow-lg ring-1 ring-slate-700 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button-desktop"
                        tabIndex={-1}
                    >
                        <div className="py-1 px-4" role="none">
                        <div className="flex flex-col space-y-1 pb-2 border-b border-slate-700">
                            <p className="text-sm font-medium leading-none text-white">
                            {currentUser?.email || "Nama Pengguna"}
                            </p>
                            <p className="text-xs leading-none text-slate-400">
                            {isAdminUser ? "Admin" : "Klien"}
                            </p>
                        </div>
                        </div>

                        <div className="py-1" role="none">
                        <Link href="/dashboard" className="block px-4 py-2 text-sm text-white hover:bg-slate-700" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                            <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect width="7" height="9" x="3" y="3" rx="1" />
                                <rect width="7" height="5" x="3" y="14" rx="1" />
                                <rect width="7" height="5" x="14" y="14" rx="1" />
                                <rect width="7" height="9" x="14" y="3" rx="1" />
                            </svg>
                            <span>Dashboard</span>
                            </div>
                        </Link>
                        {/* --- PERUBAHAN LINK PROFIL --- */}
                        <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-white hover:bg-slate-700" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                            <div className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profil</span>
                            </div>
                        </Link>
                        {/* --- AKHIR PERUBAHAN LINK PROFIL --- */}
                        </div>

                        <div className="py-1 border-t border-slate-700" role="none">
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-700"
                            role="menuitem"
                        >
                            <div className="flex items-center">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Keluar</span>
                            </div>
                        </button>
                        </div>
                    </div>
                  )}
                </div>
                 {/* --- AKHIR DESKTOP USER DROPDOWN --- */}
              </div>
            ) : (
              <div className="flex items-center gap-x-4">
                <Link href="/auth/login">
                  <Button variant="outline" className="border border-slate-600 text-white hover:bg-slate-800 py-2 px-4 rounded-md text-sm font-semibold">
                    Masuk
                  </Button>
                </Link>
                <Link href="/kontak">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-semibold flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
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
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-slate-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-slate-900/10">
          <div className="flex items-center justify-between">
            <Link href={isAdminPage ? "/admin/dashboard" : "/"} className="-m-1.5 p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
              <span className="sr-only">MiraiDev</span>
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logo-rebg.png"
                  alt="MiraiDev Logo"
                  width={64}
                  height={64}
                />
                <span className="text-xl font-bold text-white">MiraiDev</span>
              </div>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Tutup menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-slate-500/10">
              <div className="space-y-2 py-6">
                {isAdminPage ? (
                  <>
                    {/* Admin Mobile Menu Items */}
                    <Link
                      href="/admin/dashboard"
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        pathname === "/admin/dashboard"
                          ? "text-blue-400"
                          : "text-white hover:bg-slate-800"
                      }`}
                      aria-current={pathname === "/admin/dashboard" ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dasbor
                    </Link>
                    {/* Add other admin menu items if needed */}
                  </>
                ) : (
                  navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        pathname === item.href
                          ? "text-blue-400"
                          : "text-white hover:bg-slate-800"
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
                  <div className="pb-4 border-b border-slate-700">
                    <GlobalSearch />
                  </div>
                )}
                {isAdminPage ? (
                  <button
                    onClick={handleLogout}
                    className="w-full border border-slate-600 text-white hover:bg-slate-800 py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </button>
                ) : (
                  isAuthenticated === null ? (
                    <div className="space-y-4">
                      <Button className="w-full border border-slate-600 text-white hover:bg-slate-800 py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900" disabled>
                        Memuat...
                      </Button>
                    </div>
                  ) : isAuthenticated ? (
                    <div className="space-y-4">
                      {/* --- MOBILE USER DROPDOWN ITEMS --- */}
                      <div className="relative inline-block text-left w-full">
                        <div className="py-1 px-4 border-b border-slate-700 mb-2">
                            <p className="text-sm font-medium leading-none text-white">
                            {currentUser?.email || "Nama Pengguna"}
                            </p>
                            <p className="text-xs leading-none text-slate-400">
                            {isAdminUser ? "Admin" : "Klien"}
                            </p>
                        </div>
                        <div className="py-1" role="none">
                          <Link href="/dashboard" className="block px-4 py-2 text-base text-white hover:bg-slate-700" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect width="7" height="9" x="3" y="3" rx="1" />
                                <rect width="7" height="5" x="3" y="14" rx="1" />
                                <rect width="7" height="5" x="14" y="14" rx="1" />
                                <rect width="7" height="9" x="14" y="3" rx="1" />
                              </svg>
                              <span>Dashboard</span>
                            </div>
                          </Link>
                          {/* --- PERUBAHAN LINK PROFIL --- */}
                          <Link href="/dashboard/profile" className="block px-4 py-2 text-base text-white hover:bg-slate-700" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              <span>Profil</span>
                            </div>
                          </Link>
                          {/* --- AKHIR PERUBAHAN LINK PROFIL --- */}
                        </div>
                        <div className="py-1 border-t border-slate-700 mt-2" role="none">
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-base text-white hover:bg-slate-700"
                            role="menuitem"
                          >
                            <div className="flex items-center">
                              <LogOut className="mr-2 h-4 w-4" />
                              <span>Keluar</span>
                            </div>
                          </button>
                        </div>
                      </div>
                      {/* --- AKHIR MOBILE USER DROPDOWN ITEMS --- */}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full border border-slate-600 text-white hover:bg-slate-800 py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                          Masuk
                        </Button>
                      </Link>
                      <Link href="/kontak" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900">
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
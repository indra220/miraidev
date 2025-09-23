"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  ArrowRight,
  User
} from "lucide-react";

const navigation = [
  { name: "Beranda", href: "/" },
  { name: "Layanan", href: "/layanan" },
  { name: "Portofolio", href: "/portofolio" },
  { name: "Tentang Kami", href: "/tentang" },
  { name: "Kontak", href: "/kontak" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
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
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Buka menu utama</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-semibold leading-6 transition-colors ${
                pathname === item.href
                  ? "text-blue-400"
                  : "text-white hover:text-blue-300"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-4">
          <Link href="/auth/login">
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-sm font-semibold flex items-center mr-2">
              Masuk
            </Button>
          </Link>
          <Link href="/kontak">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-semibold flex items-center">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 z-50"></div>
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
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
              className="-m-2.5 rounded-md p-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Tutup menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors ${
                      pathname === item.href
                        ? "text-blue-400"
                        : "text-white hover:bg-gray-800"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              <div className="py-6 space-y-4">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800 py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center">
                    <User className="mr-2 h-4 w-4" />
                    Masuk
                  </Button>
                </Link>
                <Link href="/kontak">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-base font-semibold flex items-center justify-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
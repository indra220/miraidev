'use client';

import { useState, useEffect } from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Search } from 'lucide-react';
import { AdminMenuItem, getUserMenu } from '@/constants/admin-menu';

interface QuickSearchProps {
  userRole: string;
}

export default function QuickSearch({ userRole }: QuickSearchProps) {
  const [open, setOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);

  // Ambil menu berdasarkan role
  useEffect(() => {
    setMenuItems(getUserMenu(userRole));
  }, [userRole]);

  // Fungsi untuk menangani pencarian
  const handleSelect = (href: string) => {
    window.location.href = href;
    setOpen(false);
  };

  // Setup keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Cari halaman...</span>
        <kbd className="ml-auto hidden h-5 w-8 items-center justify-center rounded bg-gray-700 text-xs text-gray-400 sm:flex">
          ⌘K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Cari halaman atau fitur..." />
        <CommandList>
          <CommandEmpty>Halaman tidak ditemukan.</CommandEmpty>
          <CommandGroup heading="Navigasi Utama">
            {menuItems.map((item) => (
              <CommandItem 
                key={item.id} 
                onSelect={() => handleSelect(item.href)}
                className="cursor-pointer"
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Aksi Cepat">
            <CommandItem onSelect={() => handleSelect('/admin/chat')} className="cursor-pointer">
              <Search className="mr-2 h-4 w-4" />
              <span>Buka Chat</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('/admin/projects')} className="cursor-pointer">
              <Search className="mr-2 h-4 w-4" />
              <span>Proyek Baru</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('/admin/clients')} className="cursor-pointer">
              <Search className="mr-2 h-4 w-4" />
              <span>Tambah Klien</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
// src/components/dashboard/UserNav.tsx
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserIcon, LogOutIcon } from "lucide-react";
import { logout } from "@/lib/auth-service";
import { Session } from "@/types/dashboard";
import Link from "next/link"; // Import Link

interface UserNavProps {
  session: Session | null;
}

export function UserNav({ session }: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" /> {/* Ganti placeholder jika perlu */}
            <AvatarFallback>
              <UserIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.email || "Nama Pengguna"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              Klien
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => window.location.href = '/'}>
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Beranda</span>
          </DropdownMenuItem>
          {/* --- PERUBAHAN DI SINI --- */}
          <Link href="/dashboard/profile" passHref legacyBehavior>
            <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profil</span>
            </DropdownMenuItem>
          </Link>
          {/* --- AKHIR PERUBAHAN --- */}
        </DropdownMenuGroup>

        <DropdownMenuItem onClick={async () => {
          await logout();
          window.location.href = '/';
        }}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
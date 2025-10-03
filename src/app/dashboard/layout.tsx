"use client";

import React from "react";
import { redirect, usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/loading-spinner";
import SessionTimeoutHandler from "@/components/SessionTimeoutHandler"; // <-- Impor komponen baru

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return redirect("/auth/login");
  }

  return (
    // Hapus SessionTimeoutProvider yang lama
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <SessionTimeoutHandler /> {/* <-- Tambahkan handler di sini */}
      <Sidebar pathname={pathname} />
      <div className="flex flex-col flex-1 min-h-screen">
        <Header session={session} />
        <main className="flex-1 p-6 mt-16">{children}</main>
      </div>
    </div>
  );
}
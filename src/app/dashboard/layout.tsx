"use client";

import React from "react";
import { redirect, usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/loading-spinner";
import SessionTimeoutHandler from "@/components/SessionTimeoutHandler";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 overflow-y-hidden">
      <SessionTimeoutHandler />
      <Sidebar pathname={pathname} />
      <div className="flex flex-col flex-1 min-h-screen overflow-y-auto">
        <Header session={{ user }} />
        <main className="flex-1 px-6 pt-4 pb-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
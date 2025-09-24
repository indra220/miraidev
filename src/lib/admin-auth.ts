"use client";

import { createSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export async function adminLogout() {
  const supabase = createSupabaseClient();
  await supabase.auth.signOut();
}

export function useAdminAuth() {
  const router = useRouter();
  
  const logout = async () => {
    await adminLogout();
    router.push("/admin/login");
    router.refresh();
  };
  
  return { logout };
}
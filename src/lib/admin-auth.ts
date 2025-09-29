"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export async function adminLogout() {
  const supabase = createClient();
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
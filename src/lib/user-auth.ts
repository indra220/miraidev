/**
 * File ini berisi fungsi-fungsi untuk mengelola autentikasi pengguna
 * menggunakan Supabase dalam lingkungan server component Next.js.
 * 
 * Fungsi-fungsi ini memungkinkan:
 * - Mendapatkan informasi pengguna yang sedang login
 * - Memeriksa apakah pengguna sudah login
 * - Memeriksa apakah pengguna adalah admin
 */

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Interface untuk data pengguna terotentikasi
 */
interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
}

/**
 * Mendapatkan informasi pengguna yang sedang login
 * @returns Data pengguna atau null jika tidak ada pengguna yang login
 */
export async function getUser(): Promise<AuthUser | null> {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return null;
  }
  
  // Ambil role dari user_metadata atau default ke 'user'
  const role = session.user.user_metadata?.role || "user";
  
  return {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.user_metadata?.name,
    role: role === "admin" ? "admin" : "user"
  };
}

/**
 * Memeriksa apakah pengguna sudah login, jika tidak akan redirect ke halaman login
 * @returns Data pengguna yang terotentikasi
 */
export async function requireUserAuth(): Promise<AuthUser> {
  const user = await getUser();
  
  if (!user) {
    redirect("/user/login");
  }
  
  return user;
}

/**
 * Memeriksa apakah pengguna sudah login dan memiliki role admin
 * @returns Data pengguna admin yang terotentikasi
 */
export async function requireAdminAuth(): Promise<AuthUser> {
  const user = await getUser();
  
  if (!user) {
    redirect("/admin/login");
  }
  
  if (user.role !== "admin") {
    redirect("/unauthorized");
  }
  
  return user;
}
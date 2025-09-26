"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { createSupabaseClient } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/loading-spinner";
import Link from "next/link";
import { Eye, EyeOff, User, Lock } from "lucide-react";

export default function UserLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Cek role pengguna setelah login berhasil
      const user = data.user;
      const userRole = user?.user_metadata?.role;

      // Redirect berdasarkan role
      if (userRole === 'admin' || userRole === 'superadmin') {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
      router.refresh();
    } catch (error) {
        console.error("Error during login:", error);
        setError("Terjadi kesalahan saat login. Silakan coba lagi.");
        setLoading(false);
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-blue-500/10 overflow-hidden">
          <div className="p-8 relative">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/5 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/5 rounded-full"></div>
            
            <div className="text-center mb-8 relative z-10">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                Selamat Datang Kembali
              </h1>
              <p className="text-gray-400 text-sm">
                Masuk ke akun Anda untuk melanjutkan
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 text-red-200 rounded-xl flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-300 text-sm font-medium mb-2 block">
                  Alamat Email
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="masukkan email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 pl-10 py-5 h-14 text-base focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-300 text-sm font-medium mb-2 block">
                  Kata Sandi
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 pl-10 pr-12 py-5 h-14 text-base focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Ingat saya
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                    Lupa kata sandi?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-500/30"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Masuk ke Akun
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <div className="text-center text-sm text-gray-400">
                <p>
                  Belum punya akun?{" "}
                  <Link 
                    href="/user/register" 
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link 
                href="/" 
                className="text-sm text-gray-500 hover:text-gray-400 transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke beranda
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
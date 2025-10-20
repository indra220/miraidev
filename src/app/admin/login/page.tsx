// src/app/admin/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import { setAuthInfoToStorage } from "@/utils/auth-utils";

export default function AdminLoginPage() {
  useEffect(() => {
    document.title = "Admin Login";
  }, []);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email atau kata sandi yang Anda masukkan salah.");
      setIsLoading(false);
      return;
    }

    if (data.user) {
      setAuthInfoToStorage('admin', data.user.id);
    }

    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <div className="w-full max-w-md">
       <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-800/70 flex items-center justify-center mb-4 ring-1 ring-slate-700">
          <Lock className="w-7 h-7 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
        <p className="text-gray-400 mt-2">Masuk untuk mengelola situs</p>
      </div>

      <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-xl rounded-xl overflow-hidden">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-200">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email Admin</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="admin@contoh.com"
                className="bg-slate-700/50 border-slate-600 focus:border-blue-500 h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
               <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                  className="bg-slate-700/50 border-slate-600 focus:border-blue-500 h-12 text-base"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white">
                  {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-base">
              {isLoading ? <LoadingSpinner /> : "Masuk sebagai Admin"}
            </Button>
          </form>
           <div className="mt-6 text-center text-sm">
             <p className="text-gray-400">
               Bukan admin? <Link href="/auth/login" className="font-semibold text-blue-400 hover:underline">Login sebagai klien</Link>
             </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button variant="ghost" asChild>
          <Link href="/beranda" className="text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </Button>
      </div>
    </div>
  );
}
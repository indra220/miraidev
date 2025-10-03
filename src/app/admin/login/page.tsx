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

export default function AdminLoginPage() {
  useEffect(() => {
    document.title = "Admin Login | MiraiDev";
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email atau kata sandi yang Anda masukkan salah.");
      setIsLoading(false);
      return;
    }

    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <div className="w-full max-w-md">
       <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center">
            <Lock className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
        <p className="text-gray-400 mt-2">Masuk untuk mengelola situs</p>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border border-gray-700 shadow-xl rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-200">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email Admin</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
               <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <LoadingSpinner /> : "Masuk sebagai Admin"}
            </Button>
          </form>
           <div className="mt-6 text-center text-sm">
             <p>Bukan admin? <a href="/auth/login" className="underline">Login sebagai klien</a></p>
          </div>
        </CardContent>
      </Card>

      {/* Tombol Kembali ke Beranda */}
      <div className="mt-6 text-center">
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
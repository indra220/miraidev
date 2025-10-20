// src/app/auth/register/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FormError } from "@/components/form-error";
import { LoadingSpinner } from "@/components/loading-spinner";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, User, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; general?: string }>({});
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Register | MiraiDev";
  }, []);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};
    if (!name) newErrors.name = "Nama harus diisi";
    if (!email) newErrors.email = "Email harus diisi";
    if (!password) newErrors.password = "Kata sandi harus diisi";
    else if (password.length < 6) newErrors.password = "Kata sandi minimal 6 karakter";
    if (password !== confirmPassword) newErrors.confirmPassword = "Konfirmasi kata sandi tidak cocok";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(null);
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'klien'
          },
          emailRedirectTo: `${window.location.origin}/auth/login`
        }
      });

      if (signUpError) throw new Error(signUpError.message);

      if (data.user) {
        setSuccess("Registrasi berhasil! Silakan periksa email Anda untuk verifikasi. Anda akan dialihkan ke halaman login...");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("User already registered")) {
          setErrors({ general: "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk." });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: "Terjadi kesalahan yang tidak diketahui." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-800/70 flex items-center justify-center mb-4 ring-1 ring-slate-700">
          <User className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">Buat Akun Baru</h1>
        <p className="text-gray-400 mt-2">Daftar untuk memulai perjalanan digital Anda</p>
      </div>

      <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-xl rounded-xl overflow-hidden">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-sm text-green-200">
                {success}
              </div>
            )}
            
            {errors.general && <FormError error={errors.general} />}

            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-slate-700/50 border-slate-600 focus:border-blue-500 h-12 text-base"
                placeholder="Nama lengkap Anda"
              />
              <FormError error={errors.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="bg-slate-700/50 border-slate-600 focus:border-blue-500 h-12 text-base"
                placeholder="email@contoh.com"
              />
              <FormError error={errors.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="bg-slate-700/50 border-slate-600 focus:border-blue-500 h-12 text-base"
                  placeholder="Minimal 6 karakter"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white">
                  {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <FormError error={errors.password} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 focus:border-blue-500 h-12 text-base"
                  placeholder="Ulangi kata sandi"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white">
                  {showConfirmPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <FormError error={errors.confirmPassword} />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-base">
              {isLoading ? <LoadingSpinner /> : "Daftar"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              Sudah punya akun? <Link href="/auth/login" className="font-semibold text-blue-400 hover:underline">Masuk di sini</Link>
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
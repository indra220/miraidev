// src/app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FormError } from "@/components/form-error";
import { LoadingSpinner } from "@/components/loading-spinner";
import { createSupabaseClient } from "@/lib/supabase";
import { Eye, EyeOff, User, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};
    if (!name) newErrors.name = "Nama harus diisi";
    if (!email) newErrors.email = "Email harus diisi";
    if (!password) newErrors.password = "Kata sandi harus diisi";
    else if (password.length < 6) newErrors.password = "Kata sandi minimal 6 karakter";
    if (password !== confirmPassword) newErrors.confirmPassword = "Kata sandi tidak cocok";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const supabase = createSupabaseClient();
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: 'klien'
          }
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: name,
            role: 'klien'
          });

        if (profileError) {
          console.error("Gagal membuat profil pengguna:", profileError.message);
          throw new Error("Gagal menyelesaikan pendaftaran. Silakan coba lagi.");
        }
      }
      
      alert("Registrasi berhasil! Silakan periksa email Anda untuk verifikasi.");
      router.push("/auth/login");

    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Terjadi kesalahan yang tidak diketahui." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
       <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">Buat Akun Baru</h1>
        <p className="text-gray-400 mt-2">Daftar untuk memulai</p>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border border-gray-700 shadow-xl rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
             {errors.general && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-200">
                {errors.general}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
               <FormError error={errors.name} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
               <FormError error={errors.email} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
               <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5" />}
                </button>
              </div>
               <FormError error={errors.password} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
               <FormError error={errors.confirmPassword} />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <LoadingSpinner /> : "Daftar"}
            </Button>
          </form>
           <div className="mt-4 text-center text-sm">
             <p>Sudah punya akun? <a href="/auth/login" className="underline">Masuk di sini</a></p>
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
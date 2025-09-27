"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FormError } from "@/components/form-error";
import { LoadingSpinner } from "@/components/loading-spinner";
import { createSupabaseClient } from "@/lib/supabase";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid";
    }
    
    if (!password) {
      newErrors.password = "Kata sandi harus diisi";
    } else if (password.length < 6) {
      newErrors.password = "Kata sandi minimal 6 karakter";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous messages
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const supabase = createSupabaseClient();
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setErrors({ general: error.message || "Terjadi kesalahan saat login" });
      } else {
        // Redirect to admin dashboard after successful login
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors({ general: error.message || "Terjadi kesalahan saat login" });
      } else {
        setErrors({ general: "Terjadi kesalahan saat login" });
      }
    } finally {
      setIsLoading(false);
    }
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
        <p className="text-gray-400 mt-2">
          Masuk ke akun admin untuk mengelola situs
        </p>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border border-gray-700 shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Masuk ke Panel Admin</h2>
          <p className="text-gray-300 text-sm mt-1">
            Gunakan akun admin yang telah terdaftar
          </p>
        </div>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-200 flex items-start">
                <span className="mr-2">⚠️</span> {errors.general}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email Admin
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 pl-10 py-6 ${
                    errors.email ? "border-red-500 focus:ring-red-500/30" : "focus:ring-blue-500/30"
                  }`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              <FormError id="email-error" error={errors.email} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 flex items-center">
                <Lock className="w-4 h-4 mr-2" />
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
                  className={`bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 pl-10 pr-12 py-6 ${
                    errors.password ? "border-red-500 focus:ring-red-500/30" : "focus:ring-blue-500/30"
                  }`}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <FormError id="password-error" error={errors.password} />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 mt-4 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center shadow-lg"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk sebagai Admin
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-gray-500 mt-6">
        <p>Hanya untuk pengguna admin terdaftar</p>
      </div>
    </div>
  );
}
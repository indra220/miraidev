"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="text-gray-400 mt-2">
            Masuk ke akun admin untuk mengelola situs
          </p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login Admin</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Gunakan akun admin yang telah terdaftar
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-destructive/20 border border-destructive/30 rounded-md p-3 text-sm text-destructive">
                  {errors.general}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Admin
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 py-6 px-4 ${
                    errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""
                  }`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                <FormError id="email-error" error={errors.email} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Kata Sandi
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 py-6 px-4 pr-12 ${
                      errors.password ? "border-destructive focus-visible:ring-destructive/20" : ""
                    }`}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
                <FormError id="password-error" error={errors.password} />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 mt-6 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center"
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
    </div>
  );
}
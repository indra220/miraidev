"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Home, User, Mail, Lock } from "lucide-react";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulasi proses registrasi
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    // Di sini nanti akan ada logika registrasi sesungguhnya
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold">Buat Akun Baru</h1>
          <p className="text-gray-400 mt-2">
            Daftar untuk mendapatkan akses penuh
          </p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Daftar</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Isi formulir di bawah ini untuk membuat akun baru
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 py-6 px-4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 py-6 px-4"
                />
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
                    required
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 py-6 px-4 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300 flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Konfirmasi Kata Sandi
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 py-6 px-4 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 mt-6 transition-all duration-200 hover:scale-[1.02]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Daftar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800/50 px-2 text-gray-400">
                  Atau
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button asChild variant="outline" className="flex-1 border-gray-600 text-white hover:bg-gray-800 transition-all">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Kembali ke Beranda
                </Link>
              </Button>
              <Button asChild variant="ghost" className="flex-1 text-blue-400 hover:text-blue-300 hover:bg-gray-800/50">
                <Link href="/auth/login">
                  Masuk
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <div className="text-center text-sm text-gray-500 mt-6">
          <p>Dengan mendaftar, Anda menyetujui <Link href="/terms" className="text-blue-400 hover:underline">Syarat dan Ketentuan</Link> kami.</p>
          <p className="mt-2">© 2025 MiraiDev. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </div>
  );
}
// src/app/auth/login/page.tsx
"use client";

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import { loginClient } from './actions';

const initialState: { error: string | null } = {
  error: null,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <LoadingSpinner /> : "Masuk"}
        </Button>
    );
}

export default function LoginPage() {
  useEffect(() => {
    document.title = "Login | MiraiDev";
  }, []);

  const [state, formAction] = useActionState(loginClient, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center">
            <Lock className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white">Masuk ke Akun Anda</h1>
        <p className="text-gray-400 mt-2">Gunakan akun yang telah terdaftar untuk masuk</p>
      </div>
      <Card className="bg-white/10 backdrop-blur-md border border-gray-700 shadow-xl rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-200">
                {state.error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <SubmitButton />
          </form>
          <div className="mt-6 text-center text-sm">
            <p>Belum punya akun? <a href="/auth/register" className="underline">Daftar</a></p>
            <p>Admin? <a href="/admin/login" className="underline">Login di sini</a></p>
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
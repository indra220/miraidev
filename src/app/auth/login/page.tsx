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
import Translate from "@/i18n/Translate";
import { useLanguage } from "@/i18n/useLanguage";

const initialState: { error: string | null } = {
  error: null,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-base">
            {pending ? <LoadingSpinner /> : <Translate i18nKey="auth.signIn" fallback="Masuk" />}
        </Button>
    );
}

export default function LoginPage() {
  const { locale } = useLanguage();
  const [emailPlaceholder, setEmailPlaceholder] = useState("email@contoh.com");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("••••••••");

  useEffect(() => {
    document.title = `Login | MiraiDev`;

    // Update placeholders when locale changes
    setEmailPlaceholder(locale === 'en' ? "email@example.com" : "email@contoh.com");
    setPasswordPlaceholder(locale === 'en' ? "••••••••" : "••••••••");
  }, [locale]);

  const [state, formAction] = useActionState(loginClient, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-800/70 flex items-center justify-center mb-4 ring-1 ring-slate-700">
          <Lock className="w-7 h-7 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">
          <Translate i18nKey="auth.loginTitle" fallback="Masuk ke Akun Anda" />
        </h1>
        <p className="text-gray-400 mt-2">
          <Translate i18nKey="auth.loginSubtitle" fallback="Gunakan akun yang telah terdaftar untuk masuk" />
        </p>
      </div>
      <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-xl rounded-xl overflow-hidden">
        <CardContent className="p-8">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-200">
                {state.error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">
                <Translate i18nKey="auth.email" fallback="Email" />
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder={emailPlaceholder}
                className="bg-slate-700/50 border-slate-600 focus:border-blue-500 h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                <Translate i18nKey="auth.password" fallback="Kata Sandi" />
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={passwordPlaceholder}
                  className="bg-slate-700/50 border-slate-600 focus:border-blue-500 h-12 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <SubmitButton />
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              <Translate i18nKey="auth.noAccount" fallback="Belum punya akun?" />
              <Link href="/auth/register" className="font-semibold text-blue-400 hover:underline ml-1">
                <Translate i18nKey="auth.registerHere" fallback="Daftar di sini" />
              </Link>
            </p>
            <p className="text-gray-400 mt-2">
              <Translate i18nKey="auth.notAdmin" fallback="Admin?" />
              <Link href="/admin/login" className="font-semibold text-blue-400 hover:underline ml-1">
                <Translate i18nKey="auth.clientLogin" fallback="Login di sini" />
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button variant="ghost" asChild>
          <Link href="/beranda" className="text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <Translate i18nKey="auth.backToHome" fallback="Kembali ke Beranda" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
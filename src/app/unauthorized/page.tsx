"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Akses Ditolak</h1>
        <p className="text-gray-400 mb-8">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan kembali ke halaman sebelumnya atau login dengan akun yang sesuai.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 px-8">
            <Link href="/">
              Kembali ke Beranda
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700/50 py-6 px-8">
            <Link href="/user/login">
              Login User
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
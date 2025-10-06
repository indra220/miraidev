"use client";

import React, { useEffect } from "react";
import DynamicPriceCalculator from "@/components/DynamicPriceCalculator";
import OptimizedMotion from "@/components/OptimizedMotion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HargaPage() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Harga | MiraiDev";
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <OptimizedMotion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Estimasi <span className="text-blue-400">Harga</span>
              </h1>
            </OptimizedMotion>
            <OptimizedMotion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Dapatkan estimasi harga proyek Anda secara real-time berdasarkan kebutuhan spesifik
              </p>
            </OptimizedMotion>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <DynamicPriceCalculator />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <OptimizedMotion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Memulai Proyek Anda?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Setelah mendapatkan estimasi harga, konsultasikan proyek Anda dengan tim kami untuk penawaran yang lebih akurat
              </p>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 transition-all duration-150 hover:scale-105"
                onClick={() => router.push('/kontak')}
              >
                Konsultasi Sekarang
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </OptimizedMotion>
          </div>
        </div>
      </div>
    </div>
  );
}
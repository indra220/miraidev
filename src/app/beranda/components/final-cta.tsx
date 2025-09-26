"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import OptimizedMotion from "@/components/OptimizedMotion";

export function FinalCtaSection() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <OptimizedMotion 
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-gray-700 transition-all duration-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Punya Website Profesional untuk Bisnis Anda?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Diskusikan kebutuhan Anda dengan developer independen yang fokus pada solusi terjangkau dan berkualitas untuk UMKM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 transition-all duration-150 hover:scale-105">
              <Link href="/kontak">
                Konsultasi Gratis Sekarang
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-lg py-6 px-8 transition-all duration-150">
              <Link href="/kontak">
                Hubungi Kami
              </Link>
            </Button>
          </div>
        </OptimizedMotion>
      </div>
    </div>
  );
}
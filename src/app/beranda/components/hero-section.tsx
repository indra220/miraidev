"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import OptimizedMotion from "@/components/OptimizedMotion";

interface Feature {
  icon: React.ReactNode;
  text: string;
}

export function HeroSection() {
  const features: Feature[] = [
    {
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>,
      text: "Harga Terjangkau"
    },
    {
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
      </svg>,
      text: "Proses Transparan"
    },
    {
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>,
      text: "Revisi Gratis"
    },
    {
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.753-2.969 1 1 0 10-1.496.001A5.972 5.972 0 0013 15v3h-2v-3a5.972 5.972 0 00-.753-2.969 1 1 0 10-1.496.001A5.972 5.972 0 007 15v3H5v-3a5.972 5.972 0 00-.753-2.969 1 1 0 10-1.496.001A5.972 5.972 0 002 15v3H0v2h20v-2h-2v-3z" />
      </svg>,
      text: "Dukungan Personal"
    }
  ];

  return (
    <div className="relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
      <div className="container mx-auto px-4 py-24 sm:py-32 relative">
        <div className="max-w-3xl">
          <OptimizedMotion 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          >
            Wujudkan <span className="text-blue-400">Website Impian</span> Bisnis Anda dengan Solusi yang Terjangkau
          </OptimizedMotion>
          <OptimizedMotion 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl"
          >
            Website modern dan responsif yang dirancang khusus untuk membantu bisnis Anda tumbuh di era digital, dengan harga yang terjangkau untuk UMKM dan startup.
          </OptimizedMotion>
          <OptimizedMotion 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 transition-all duration-150 hover:scale-105">
              <Link href="/kontak">
                Konsultasi Gratis Sekarang
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg py-6 px-8 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-150">
              <Link href="/portofolio">
                Lihat Portofolio
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </OptimizedMotion>
          
          {/* Feature Highlights */}
          <OptimizedMotion 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-12 flex flex-wrap gap-4"
          >
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
                <div className="text-blue-400">
                  {feature.icon}
                </div>
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </OptimizedMotion>
        </div>
      </div>
    </div>
  );
}
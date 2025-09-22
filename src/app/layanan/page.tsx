"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Globe, 
  Wrench,
  RefreshCw,
  Search,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function LayananPage() {
  const services = [
    {
      icon: <Globe className="w-12 h-12 text-blue-400" />,
      title: "Pengembangan Website Kustom",
      description: "Website yang dirancang khusus untuk memenuhi kebutuhan unik bisnis Anda dengan teknologi terkini.",
      features: [
        "Desain responsif untuk semua perangkat",
        "Optimasi kecepatan dan performa",
        "Integrasi dengan sistem lain",
        "Dukungan SEO dasar"
      ]
    },
    {
      icon: <RefreshCw className="w-12 h-12 text-green-400" />,
      title: "Desain Ulang Website (Website Redesign)",
      description: "Modernisasi tampilan dan fungsionalitas website Anda yang sudah ada untuk meningkatkan pengalaman pengguna.",
      features: [
        "Audit dan analisis website saat ini",
        "Desain ulang dengan pendekatan modern",
        "Migrasi konten yang aman",
        "Testing kompatibilitas browser"
      ]
    },
    {
      icon: <Wrench className="w-12 h-12 text-purple-400" />,
      title: "Paket Pemeliharaan Website",
      description: "Solusi pemeliharaan rutin untuk menjaga website Anda tetap aman, terupdate, dan berjalan optimal.",
      features: [
        "Update keamanan berkala",
        "Backup data otomatis",
        "Monitoring kinerja",
        "Dukungan teknis 24/7"
      ]
    },
    {
      icon: <Search className="w-12 h-12 text-yellow-400" />,
      title: "Optimasi SEO & Performa",
      description: "Layanan tambahan untuk meningkatkan peringkat website Anda di mesin pencari dan mempercepat waktu muat.",
      features: [
        "Audit SEO komprehensif",
        "Optimasi kata kunci",
        "Peningkatan Core Web Vitals",
        "Laporan bulanan performa"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Layanan <span className="text-blue-400">Kami</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Solusi komprehensif untuk memenuhi semua kebutuhan pengembangan website dan digital Anda
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 p-8 hover:border-blue-500 transition-all duration-300">
                <div className="mb-6">
                  {service.icon}
                </div>
                <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                <p className="text-gray-300 mb-6">{service.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Pelajari Lebih Lanjut
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-gray-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Butuh Solusi Khusus?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Setiap proyek memiliki kebutuhan yang unik. Diskusikan kebutuhan spesifik Anda dengan tim ahli kami untuk solusi yang disesuaikan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8">
                Konsultasi Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-lg py-6 px-8">
                Hubungi Kami
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
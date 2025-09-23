"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Code, 
  Smartphone, 
  Globe, 
  Palette, 
  Rocket, 
  Wrench,
  RefreshCw,
  Search,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import Link from "next/link";

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
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Layanan <span className="text-blue-400">Kami</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Solusi komprehensif untuk memenuhi semua kebutuhan pengembangan website dan digital Anda
            </motion.p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="transition-all duration-200"
              >
                <Card className="bg-gray-800/50 border-gray-700 p-8 hover:border-blue-500 transition-all duration-200 h-full">
                  <div className="mb-6">
                    {service.icon}
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                  >
                    <Link href="/kontak">
                      Pelajari Lebih Lanjut
                    </Link>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-gray-700">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              Butuh Solusi Khusus?
            </motion.h2>
            <motion.p 
              className="text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Setiap proyek memiliki kebutuhan yang unik. Diskusikan kebutuhan spesifik Anda dengan tim ahli kami untuk solusi yang disesuaikan.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 transition-all duration-150 hover:scale-105"
              >
                <Link href="/kontak">
                  Konsultasi Gratis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-lg py-6 px-8 transition-all duration-150"
              >
                <Link href="/kontak">
                  Hubungi Kami
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
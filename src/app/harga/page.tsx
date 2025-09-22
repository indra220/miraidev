"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function HargaPage() {
  const pricingPlans = [
    {
      name: "Basic",
      price: "Rp 3.000.000",
      description: "Solusi ideal untuk bisnis kecil yang baru memulai kehadiran digital",
      features: [
        "Website landing page 5 halaman",
        "Desain responsif (mobile-friendly)",
        "Hosting dan domain (1 tahun)",
        "Formulir kontak dasar",
        "Integrasi media sosial",
        "Optimasi SEO dasar",
        "Email bisnis (@namabisnis.com)",
        "Dukungan 1 bulan"
      ],
      popular: false
    },
    {
      name: "Business",
      price: "Rp 7.500.000",
      description: "Solusi komprehensif untuk bisnis menengah yang ingin berkembang",
      features: [
        "Website kustom hingga 10 halaman",
        "Desain responsif premium",
        "Hosting dan domain (1 tahun)",
        "Formulir kontak canggih",
        "Integrasi media sosial & blog",
        "Optimasi SEO lanjutan",
        "Email bisnis (@namabisnis.com) 5 akun",
        "Google Analytics & Search Console",
        "Dukungan 3 bulan",
        "Training manajemen konten"
      ],
      popular: true
    },
    {
      name: "E-Commerce",
      price: "Rp 15.000.000",
      description: "Solusi lengkap untuk toko online dengan fitur e-commerce profesional",
      features: [
        "Website e-commerce lengkap",
        "Desain responsif premium",
        "Hosting dan domain (1 tahun)",
        "Sistem keranjang belanja",
        "Integrasi pembayaran (Bank Transfer, QRIS)",
        "Manajemen produk & inventaris",
        "Sistem pengelolaan pesanan",
        "Optimasi SEO e-commerce",
        "Email bisnis (@namabisnis.com) 10 akun",
        "Google Analytics & Search Console",
        "Dukungan 6 bulan",
        "Training manajemen produk"
      ],
      popular: false
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
              Paket <span className="text-blue-400">Harga</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Pilihan paket yang fleksibel untuk memenuhi kebutuhan bisnis Anda. Setiap proyek unik, penawaran kustom tersedia.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`bg-gray-800/50 border-gray-700 overflow-hidden relative ${
                  plan.popular ? "border-blue-500 border-2" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    POPULER
                  </div>
                )}
                
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">/proyek</span>
                  </div>
                  <p className="text-gray-400 mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    Pilih Paket
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12 max-w-3xl mx-auto">
            <Card className="bg-gray-800/50 border-gray-700 p-8">
              <h3 className="text-2xl font-bold mb-4">Butuh Solusi yang Disesuaikan?</h3>
              <p className="text-gray-300 mb-6">
                Setiap bisnis memiliki kebutuhan yang unik. Kami menawarkan penawaran kustom yang disesuaikan dengan kebutuhan spesifik proyek Anda.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Minta Penawaran Kustom
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Pertanyaan yang Sering Diajukan</h2>
            
            <div className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-3">Apakah domain dan hosting sudah termasuk?</h3>
                <p className="text-gray-400">
                  Ya, semua paket sudah termasuk domain .com dan hosting selama 1 tahun. Perpanjangan tahun berikutnya akan dikenakan biaya terpisah.
                </p>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-3">Berapa lama waktu pengerjaan proyek?</h3>
                <p className="text-gray-400">
                  Waktu pengerjaan tergantung kompleksitas proyek: Paket Basic (2-3 minggu), Paket Business (4-6 minggu), Paket E-Commerce (6-8 minggu).
                </p>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-3">Apakah bisa merevisi desain setelah proyek dimulai?</h3>
                <p className="text-gray-400">
                  Kami menyediakan 2x revisi desain gratis untuk setiap paket. Revisi tambahan akan dikenakan biaya terpisah sesuai kompleksitasnya.
                </p>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-3">Apakah website saya akan SEO-friendly?</h3>
                <p className="text-gray-400">
                  Ya, semua website yang kami bangun sudah dioptimasi untuk SEO dasar. Untuk optimasi lanjutan, kami menawarkan paket SEO terpisah.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-gray-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Memulai Proyek Anda?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Hubungi kami hari ini untuk konsultasi gratis dan penawaran khusus untuk proyek Anda.
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
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Globe, 
  Smartphone, 
  Palette, 
  Rocket, 
  ArrowRight,
  Star,
  Zap,
  Shield,
  Database
} from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function HomePage() {
  const services = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Pengembangan Website",
      description: "Website kustom yang modern dan responsif untuk bisnis Anda"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Desain UI/UX",
      description: "Antarmuka pengguna yang menarik dan pengalaman pengguna yang optimal"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Aplikasi Mobile",
      description: "Aplikasi mobile yang canggih untuk iOS dan Android"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Optimasi SEO",
      description: "Meningkatkan visibilitas website Anda di mesin pencari"
    }
  ];

  const portfolio = [
    {
      id: 1,
      title: "E-Commerce Fashion",
      category: "E-Commerce",
      image: "/placeholder-portfolio-1.jpg"
    },
    {
      id: 2,
      title: "Dashboard Perusahaan",
      category: "Sistem Informasi",
      image: "/placeholder-portfolio-2.jpg"
    },
    {
      id: 3,
      title: "Aplikasi Keuangan",
      category: "FinTech",
      image: "/placeholder-portfolio-3.jpg"
    }
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "CEO, TechStartup Indonesia",
      content: "MiraiDev membantu kami membangun website yang luar biasa dengan desain modern dan performa cepat.",
      avatar: "/placeholder-avatar-1.jpg"
    },
    {
      name: "Siti Rahmawati",
      role: "Pemilik Toko Online",
      content: "Proses kerja yang transparan dan hasil akhir yang melebihi ekspektasi kami. Sangat direkomendasikan!",
      avatar: "/placeholder-avatar-2.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Wujudkan <span className="text-blue-400">Website Masa Depan</span> Bisnis Anda Bersama MiraiDev
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Desain modern, performa cepat, dan SEO-friendly untuk membantu bisnis Anda berkembang di dunia digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8">
                Konsultasi Gratis Sekarang
              </Button>
              <Button size="lg" variant="outline" className="text-lg py-6 px-8 border-white text-white hover:bg-white hover:text-gray-900">
                Lihat Portofolio
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Client Trust Section */}
      <div className="py-12 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-gray-400 mb-8">Dipercaya oleh klien-klien kami</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 w-32 bg-gray-700 rounded flex items-center justify-center opacity-70">
                <span className="text-gray-400 font-medium">Klien {i+1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Layanan Kami</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Solusi komprehensif untuk kebutuhan digital Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 p-6 hover:border-blue-500 transition-all duration-300">
                <div className="text-blue-400 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Portfolio */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Portofolio Unggulan</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Proyek-proyek terbaik kami yang telah membantu klien mencapai kesuksesan
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolio.map((item) => (
              <Card key={item.id} className="bg-gray-800/50 border-gray-700 overflow-hidden group">
                <div className="h-48 bg-gray-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-blue-600 text-xs px-2 py-1 rounded">{item.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <Button variant="link" className="p-0 text-blue-400 hover:text-blue-300">
                    Lihat Detail
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
              Lihat Semua Portofolio
            </Button>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Alasan mengapa klien memilih MiraiDev sebagai mitra pengembangan digital mereka
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Teknologi Terkini</h3>
              <p className="text-gray-400">
                Kami menggunakan teknologi dan framework terbaru untuk memastikan performa dan keamanan terbaik.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Proses Transparan</h3>
              <p className="text-gray-400">
                Komunikasi yang jelas dan transparan sepanjang proses pengembangan untuk memastikan kepuasan klien.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Dukungan Purna Jual</h3>
              <p className="text-gray-400">
                Dukungan berkelanjutan setelah peluncuran untuk memastikan website Anda tetap berjalan optimal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Apa Kata Klien Kami</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Pengalaman nyata dari klien yang telah bekerja sama dengan kami
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mr-4">
                    <span className="text-lg font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">&quot;{testimonial.content}&quot;</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-gray-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Mewujudkan Website Impian Anda?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Diskusikan proyek Anda dengan tim ahli kami dan dapatkan penawaran khusus hari ini.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8">
                Konsultasi Gratis Sekarang
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
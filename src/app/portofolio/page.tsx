"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Globe, 
  ShoppingCart, 
  Building, 
  Smartphone,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function PortofolioPage() {
  const categories = [
    { id: "all", name: "Semua", icon: <Globe className="w-4 h-4" /> },
    { id: "ecommerce", name: "E-Commerce", icon: <ShoppingCart className="w-4 h-4" /> },
    { id: "company", name: "Company Profile", icon: <Building className="w-4 h-4" /> },
    { id: "mobile", name: "Aplikasi Mobile", icon: <Smartphone className="w-4 h-4" /> },
  ];

  const projects = [
    {
      id: 1,
      title: "Toko Online Fashionista",
      category: "E-Commerce",
      description: "Platform e-commerce lengkap untuk toko fashion dengan sistem pembayaran terintegrasi.",
      image: "/placeholder-portfolio-1.jpg",
      tags: ["React", "Node.js", "MongoDB"]
    },
    {
      id: 2,
      title: "Dashboard Perusahaan TechCorp",
      category: "Company Profile",
      description: "Sistem informasi internal untuk manajemen proyek dan sumber daya manusia.",
      image: "/placeholder-portfolio-2.jpg",
      tags: ["Next.js", "PostgreSQL", "Tailwind CSS"]
    },
    {
      id: 3,
      title: "Aplikasi Keuangan FinApp",
      category: "Aplikasi Mobile",
      description: "Aplikasi mobile untuk manajemen keuangan pribadi dengan fitur pelacakan pengeluaran.",
      image: "/placeholder-portfolio-3.jpg",
      tags: ["React Native", "Firebase", "Redux"]
    },
    {
      id: 4,
      title: "Portal Berita Nusantara",
      category: "Company Profile",
      description: "Website portal berita dengan sistem manajemen konten dan fitur personalisasi.",
      image: "/placeholder-portfolio-4.jpg",
      tags: ["Vue.js", "Express", "MongoDB"]
    },
    {
      id: 5,
      title: "Marketplace UMKM Lokal",
      category: "E-Commerce",
      description: "Platform marketplace untuk pelaku UMKM lokal dengan fitur multi-vendor.",
      image: "/placeholder-portfolio-5.jpg",
      tags: ["Angular", "NestJS", "PostgreSQL"]
    },
    {
      id: 6,
      title: "Aplikasi Fitness GoFit",
      category: "Aplikasi Mobile",
      description: "Aplikasi mobile untuk pelacakan kebugaran dengan integrasi wearable devices.",
      image: "/placeholder-portfolio-6.jpg",
      tags: ["Flutter", "Firebase", "TensorFlow"]
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
              Portofolio <span className="text-blue-400">Kami</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Kumpulan proyek terbaik kami yang telah membantu klien mencapai kesuksesan di dunia digital
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="py-8 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button 
                key={category.id}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="bg-gray-800/50 border-gray-700 overflow-hidden group">
                <div className="h-48 bg-gray-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-xs px-2 py-1 rounded">{project.category}</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-900/50 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <Button variant="link" className="p-0 text-blue-400 hover:text-blue-300">
                    Lihat Studi Kasus
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
              Muat Lebih Banyak
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-gray-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Membawa Bisnis Anda ke Level Berikutnya?</h2>
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
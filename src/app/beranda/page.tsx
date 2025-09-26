"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { 
  Globe, 
  Palette, 
  Rocket, 
  ArrowRight,
  Star,
  Zap,
  Shield,
  Database,
  CheckCircle,
  TrendingUp,
  Users
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import OptimizedMotion from "@/components/OptimizedMotion";
import Link from "next/link";

export default function HomePage() {
  const services = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Website untuk UMKM",
      description: "Website profesional yang terjangkau untuk usaha kecil dan menengah"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Desain Responsif",
      description: "Website yang tampil sempurna di semua perangkat - desktop, tablet, dan mobile"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Optimasi Kecepatan",
      description: "Website yang cepat dimuat untuk pengalaman pengguna yang optimal"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Maintenance & Support",
      description: "Dukungan berkelanjutan untuk memastikan website Anda tetap berjalan lancar"
    }
  ];

  const portfolio = [
    {
      id: 1,
      title: "Website Kedai Kopi Lokal",
      category: "UMKM",
      image: "/placeholder-portfolio-1.jpg"
    },
    {
      id: 2,
      title: "Portofolio Fotografer Freelance",
      category: "Personal Branding",
      image: "/placeholder-portfolio-2.jpg"
    },
    {
      id: 3,
      title: "Website Konsultan Finansial Independen",
      category: "Profesional Jasa",
      image: "/placeholder-portfolio-3.jpg"
    }
  ];

  const testimonials = [
    {
      name: "Andi Prasetyo",
      role: "Pemilik Kedai Kopi",
      content: "Website yang dibuat sangat membantu bisnis saya. Sekarang pelanggan bisa melihat menu dan lokasi kami dengan mudah. Prosesnya juga cepat dan harga terjangkau.",
      avatar: "/placeholder-avatar-1.jpg"
    },
    {
      name: "Rina Sari",
      role: "Freelance Designer",
      content: "Portofolio online saya akhirnya terwujud dengan tampilan yang profesional. Developer sangat ramah dan mudah diajak komunikasi. Rekomendasi banget untuk UMKM!",
      avatar: "/placeholder-avatar-2.jpg"
    }
  ];

  const features = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: "Harga Terjangkau"
    },
    {
      trendingUp: <TrendingUp className="w-6 h-6" />,
      text: "Proses Transparan"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      text: "Revisi Gratis"
    },
    {
      icon: <Users className="w-6 h-6" />,
      text: "Dukungan Personal"
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

      {/* Client Trust Section */}
      <OptimizedMotion 
        className="py-12 bg-gray-800/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
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
      </OptimizedMotion>

      {/* Services Overview */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <OptimizedMotion 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Layanan Kami</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Solusi komprehensif untuk kebutuhan digital Anda
            </p>
          </OptimizedMotion>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <OptimizedMotion
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="transition-all duration-200"
              >
                <Card className="bg-gray-800/50 border-gray-700 p-6 hover:border-blue-500 transition-all duration-200 h-full cursor-pointer">
                  <Link href="/layanan" className="block h-full">
                    <div className="text-blue-400 mb-4">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-400">{service.description}</p>
                  </Link>
                </Card>
              </OptimizedMotion>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Portfolio */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <OptimizedMotion 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Portofolio Unggulan</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Proyek-proyek terbaik kami yang telah membantu klien mencapai kesuksesan
            </p>
          </OptimizedMotion>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolio.map((item, index) => (
              <OptimizedMotion
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="transition-all duration-200"
              >
                <Card className="bg-gray-800/50 border-gray-700 overflow-hidden group h-full cursor-pointer">
                  <Link href="/portofolio" className="block h-full">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-blue-600 text-xs px-2 py-1 rounded">{item.category}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <Button variant="link" className="p-0 text-blue-400 hover:text-blue-300">
                        <span className="flex items-center">
                          Lihat Detail
                          <ArrowRight className="ml-1 w-4 h-4" />
                        </span>
                      </Button>
                    </div>
                  </Link>
                </Card>
              </OptimizedMotion>
            ))}
          </div>
          
          <OptimizedMotion 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <Button asChild size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-150">
              <Link href="/portofolio">
                Lihat Semua Portofolio
              </Link>
            </Button>
          </OptimizedMotion>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <OptimizedMotion 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Alasan mengapa klien memilih MiraiDev sebagai mitra pengembangan digital mereka
            </p>
          </OptimizedMotion>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <OptimizedMotion 
              className="text-center p-6 transition-all duration-200"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Teknologi Terkini</h3>
              <p className="text-gray-400">
                Kami menggunakan teknologi dan framework terbaru untuk memastikan performa dan keamanan terbaik.
              </p>
            </OptimizedMotion>
            
            <OptimizedMotion 
              className="text-center p-6 transition-all duration-200"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Proses Transparan</h3>
              <p className="text-gray-400">
                Komunikasi yang jelas dan transparan sepanjang proses pengembangan untuk memastikan kepuasan klien.
              </p>
            </OptimizedMotion>
            
            <OptimizedMotion 
              className="text-center p-6 transition-all duration-200"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Dukungan Purna Jual</h3>
              <p className="text-gray-400">
                Dukungan berkelanjutan setelah peluncuran untuk memastikan website Anda tetap berjalan optimal.
              </p>
            </OptimizedMotion>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <OptimizedMotion 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Apa Kata Klien Kami</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Pengalaman nyata dari klien yang telah bekerja sama dengan kami
            </p>
          </OptimizedMotion>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <OptimizedMotion
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-800/50 border-gray-700 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mr-4">
                      <span className="text-lg font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.content}"</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </Card>
              </OptimizedMotion>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
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
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Globe, 
  ArrowRight,
  CheckCircle
} from "lucide-react";
import OptimizedMotion from "@/components/OptimizedMotion";
import Link from "next/link";
import { ServiceItem } from "@/lib/types";

export default function LayananPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Layanan Kami | MiraiDev";
    
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        
        if (!response.ok) {
          throw new Error(`Error fetching services: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        const fetchedServices = result.data as ServiceItem[];
        
        // Jika tidak ada data dari database, gunakan template default
        if (!fetchedServices || fetchedServices.length === 0) {
          setServices(getDefaultServices());
        } else {
          setServices(fetchedServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Jika terjadi error, gunakan template default
        setServices(getDefaultServices());
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <OptimizedMotion 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Layanan <span className="text-blue-400">Kami</span>
            </OptimizedMotion>
            <OptimizedMotion 
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Solusi komprehensif untuk memenuhi semua kebutuhan pengembangan website dan digital Anda
            </OptimizedMotion>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <OptimizedMotion
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="transition-all duration-200"
              >
                <Card className="bg-gray-800/50 border-gray-700 p-8 hover:border-blue-500 transition-all duration-200 h-full">
                  <div className="mb-6">
                    {service.icon ? (
                      <div dangerouslySetInnerHTML={{ __html: service.icon }} className="w-12 h-12 text-blue-400" />
                    ) : (
                      <div className="w-12 h-12 text-blue-400 bg-gray-700 rounded-full flex items-center justify-center">
                        <Globe className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features && Array.isArray(service.features) ? 
                      (service.features as string[]).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      )) : 
                      <li className="text-gray-300">Tidak ada fitur spesifik yang tercantum</li>
                    }
                  </ul>
                  
                  <Button 
                    asChild
                    variant="outline"
                    className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white w-full transition-all duration-150"
                  >
                    <Link href="/kontak">
                      Pelajari Lebih Lanjut
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </Card>
              </OptimizedMotion>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-gray-700">
            <OptimizedMotion
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Memulai Proyek Anda?</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Setiap proyek memiliki kebutuhan yang unik. Diskusikan kebutuhan spesifik Anda dengan tim ahli kami untuk solusi yang disesuaikan.
              </p>
            </OptimizedMotion>
            <OptimizedMotion 
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
            </OptimizedMotion>
          </div>
        </div>
      </div>
    </div>
  );
}

// Template default untuk layanan jika tidak ada data dari database
function getDefaultServices(): ServiceItem[] {
  return [
    {
      id: 1,
      title: "Pengembangan Website Kustom",
      category: "Web Development",
      description: "Website yang dirancang khusus untuk memenuhi kebutuhan unik bisnis Anda dengan teknologi terkini.",
      price: 0,
      features: [
        "Desain responsif untuk semua perangkat",
        "Optimasi kecepatan dan performa",
        "Integrasi dengan sistem lain",
        "Dukungan SEO dasar"
      ],
      icon: "",
      order: 1,
      is_active: true,
      user_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as ServiceItem,
    {
      id: 2,
      title: "Desain Ulang Website (Website Redesign)",
      category: "Web Development",
      description: "Modernisasi tampilan dan fungsionalitas website Anda yang sudah ada untuk meningkatkan pengalaman pengguna.",
      price: 0,
      features: [
        "Audit dan analisis website saat ini",
        "Desain ulang dengan pendekatan modern",
        "Migrasi konten yang aman",
        "Testing kompatibilitas browser"
      ],
      icon: "",
      order: 2,
      is_active: true,
      user_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as ServiceItem,
    {
      id: 3,
      title: "Paket Pemeliharaan Website",
      category: "Web Development",
      description: "Solusi pemeliharaan rutin untuk menjaga website Anda tetap aman, terupdate, dan berjalan optimal.",
      price: 0,
      features: [
        "Update keamanan berkala",
        "Backup data otomatis",
        "Monitoring kinerja",
        "Dukungan teknis 24/7"
      ],
      icon: "",
      order: 3,
      is_active: true,
      user_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as ServiceItem,
    {
      id: 4,
      title: "Optimasi SEO & Performa",
      category: "Web Development",
      description: "Layanan tambahan untuk meningkatkan peringkat website Anda di mesin pencari dan mempercepat waktu muat.",
      price: 0,
      features: [
        "Audit SEO komprehensif",
        "Optimasi kata kunci",
        "Peningkatan Core Web Vitals",
        "Laporan bulanan performa"
      ],
      icon: "",
      order: 4,
      is_active: true,
      user_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as ServiceItem
  ];
}
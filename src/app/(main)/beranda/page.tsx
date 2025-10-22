"use client";

import { useEffect, useState } from "react"; // DIUBAH: Menambahkan useState
import { HeroSection } from "./components/hero-section";
import { ClientTrustSection } from "./components/client-trust";
import { ServicesOverview } from "./components/services-overview";
import { FeaturedPortfolio } from "./components/featured-portfolio";
import { WhyChooseUsSection } from "./components/why-choose-us";
import { FinalCtaSection } from "./components/final-cta";
import { createClient } from "@supabase/supabase-js";
import { PortfolioItem, ServiceItem } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth"; // Import hook auth untuk mendapatkan informasi user

// Fungsi untuk mengambil semua data halaman utama dalam satu panggilan
async function getAllHomeData(): Promise<{
  portfolio: PortfolioItem[];
  services: ServiceItem[];
}> {
  try {
    // Eksekusi semua permintaan data secara paralel
    const [portfolioData, servicesData] = await Promise.all([
      // Ambil data portfolio
      (async () => {
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
          const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
          
          const supabase = createClient(supabaseUrl, supabaseAnonKey);
          
          const { data, error } = await supabase
            .from('portfolio')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3); // Ambil 3 item terbaru
          
          if (error) {
            console.error('Error fetching portfolio:', error);
            return [];
          }
          
          return data as PortfolioItem[];
        } catch (error) {
          console.error('Error in getPortfolioData:', error);
          return [];
        }
      })(),
      
      // Ambil data services
      (async () => {
        try {
          // Ambil data dari API services
          const response = await fetch('/api/services');
          
          if (!response.ok) {
            throw new Error(`Error fetching services: ${response.status} ${response.statusText}`);
          }
          
          const result = await response.json();
          const services = result.data as ServiceItem[];
          
          // Jika tidak ada data dari database, gunakan template default
          if (!services || services.length === 0) {
            return getDefaultServices();
          }
          
          // Ambil 4 layanan pertama
          return services.slice(0, 4).map(service => ({
            ...service,
            is_featured: false
          }));
        } catch (error) {
          console.error('Error in getServicesData:', error);
          // Jika terjadi error, kembalikan template default
          return getDefaultServices();
        }
      })()
    ]);

    return {
      portfolio: portfolioData,
      services: servicesData
    };
  } catch (error) {
    console.error('Error in getAllHomeData:', error);
    // Kembalikan data kosong jika terjadi error
    return {
      portfolio: [],
      services: getDefaultServices()
    };
  }
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

export default function HomePage() {
  const { user } = useAuth(); // Mendapatkan informasi user saat ini
  const [showTrustSection, setShowTrustSection] = useState(false); // State untuk menentukan apakah menampilkan trust section, default false

  // State untuk menyimpan data
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);

  // State untuk status loading
  const [loading, setLoading] = useState(true);

  // Mengatur judul halaman secara dinamis di sisi klien
  useEffect(() => {
    // Baris di bawah ini dihapus untuk menggunakan judul default dari metadata
    // document.title = "Beranda | MiraiDev";

    // Fetch semua data dalam satu panggilan untuk mengoptimalkan pemuatan
    async function fetchData() {
      setLoading(true); // Set loading ke true saat mulai mengambil data
      
      try {
        const { portfolio: portfolioData, services: servicesData } = await getAllHomeData();
        
        // Update state dengan semua data yang diambil
        setPortfolio(portfolioData);
        setServices(servicesData);
        
        // Periksa apakah user saat ini telah memberikan testimonial
        // (untuk sekarang, kita langsung set ke false karena akan menggunakan tabel baru nanti)
        setShowTrustSection(false); // Kita tetapkan ke false karena sistem testimonial baru belum siap
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false); // Set loading ke false setelah semua data diambil
      }
    }

    fetchData();
  }, [user]);

  // Tampilkan loading state sementara
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>

      <div>
        <HeroSection />
        
        {showTrustSection && <ClientTrustSection />}
        
        <ServicesOverview services={services} />
        
        <FeaturedPortfolio portfolio={portfolio} />
        
        <WhyChooseUsSection />
        
        <FinalCtaSection />
      </div>
    </>
  );
}
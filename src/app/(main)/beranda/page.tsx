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
import { useLanguage } from "@/i18n/useLanguage";
import { t } from "@/i18n/t";

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
          let services = result.data as ServiceItem[];

          // Jika tidak ada data dari database, gunakan template default
          if (!services || services.length === 0) {
            return await getDefaultServices();
          }

          // Ambil 4 layanan pertama
          services = services.slice(0, 4).map(service => ({
            ...service,
            is_featured: false
          }));

          // Kita bisa menambahkan logika untuk menerjemahkan services jika diperlukan
          // Misalnya dengan membuat fungsi terjemahan untuk item layanan
          return services;
        } catch (error) {
          console.error('Error in getServicesData:', error);
          // Jika terjadi error, kembalikan template default yang sudah diterjemahkan
          return await getDefaultServices();
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
      services: await getDefaultServices()
    };
  }
}

// Template default untuk layanan jika tidak ada data dari database
async function getDefaultServices(): Promise<ServiceItem[]> {
  // Dapatkan fungsi terjemahan
  const { t } = await import("@/i18n/t");

  // Karena fungsi ini dipanggil dari server component, kita tidak bisa menggunakan hook useLanguage
  // Jadi kita akan menggunakan bahasa default (en) atau bisa ditentukan berdasarkan konteks tertentu
  // Dalam kasus ini, kita asumsikan locale adalah "en" untuk server-side default
  const defaultLocale = "id"; // Gunakan bahasa Indonesia sebagai default

  // Gunakan terjemahan atau default dalam bahasa Indonesia
  return [
    {
      id: 1,
      title: await t("home.services.customDev.title", defaultLocale, "Pengembangan Website Kustom"),
      category: await t("services.category.webDevelopment", defaultLocale, "Pengembangan Web"),
      description: await t("home.services.customDev.description", defaultLocale, "Website yang dirancang khusus untuk memenuhi kebutuhan unik bisnis Anda dengan teknologi terkini."),
      price: 0,
      features: [
        await t("home.services.customDev.features.responsive", defaultLocale, "Desain responsif untuk semua perangkat"),
        await t("home.services.customDev.features.optimization", defaultLocale, "Optimasi kecepatan dan kinerja"),
        await t("home.services.customDev.features.integration", defaultLocale, "Integrasi dengan sistem lain"),
        await t("home.services.customDev.features.seo", defaultLocale, "Dukungan SEO dasar")
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
      title: await t("home.services.redesign.title", defaultLocale, "Redesain Website"),
      category: await t("services.category.webDevelopment", defaultLocale, "Pengembangan Web"),
      description: await t("home.services.redesign.description", defaultLocale, "Pembaruan tampilan dan fungsionalitas website Anda saat ini untuk meningkatkan pengalaman pengguna."),
      price: 0,
      features: [
        await t("home.services.redesign.features.audit", defaultLocale, "Audit dan analisis website saat ini"),
        await t("home.services.redesign.features.modern", defaultLocale, "Redesain dengan pendekatan modern"),
        await t("home.services.redesign.features.migration", defaultLocale, "Migrasi konten dengan aman"),
        await t("home.services.redesign.features.testing", defaultLocale, "Pengujian kompatibilitas browser")
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
      title: await t("home.services.maintenance.title", defaultLocale, "Paket Perawatan Website"),
      category: await t("services.category.webDevelopment", defaultLocale, "Pengembangan Web"),
      description: await t("home.services.maintenance.description", defaultLocale, "Solusi perawatan rutin untuk menjaga website Anda tetap aman, terbaru, dan berjalan optimal."),
      price: 0,
      features: [
        await t("home.services.maintenance.features.security", defaultLocale, "Pembaruan keamanan rutin"),
        await t("home.services.maintenance.features.backup", defaultLocale, "Pencadangan data otomatis"),
        await t("home.services.maintenance.features.monitoring", defaultLocale, "Pemantauan kinerja"),
        await t("home.services.maintenance.features.support", defaultLocale, "Dukungan teknis 24/7")
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
      title: await t("home.services.seo.title", defaultLocale, "Optimasi SEO & Kinerja"),
      category: await t("services.category.webDevelopment", defaultLocale, "Pengembangan Web"),
      description: await t("home.services.seo.description", defaultLocale, "Layanan tambahan untuk meningkatkan peringkat website Anda di mesin pencari dan mempercepat waktu muat."),
      price: 0,
      features: [
        await t("home.services.seo.features.audit", defaultLocale, "Audit SEO menyeluruh"),
        await t("home.services.seo.features.keywords", defaultLocale, "Optimasi kata kunci"),
        await t("home.services.seo.features.vitals", defaultLocale, "Peningkatan Core Web Vitals"),
        await t("home.services.seo.features.report", defaultLocale, "Laporan kinerja bulanan")
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
  const { locale } = useLanguage();
  const [showTrustSection, setShowTrustSection] = useState(false); // State untuk menentukan apakah menampilkan trust section, default false

  // State untuk menyimpan data
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);

  // State untuk status loading
  const [loading, setLoading] = useState(true);

  // Mengatur judul halaman secara dinamis di sisi klien
  useEffect(() => {
    // Atur judul dengan terjemahan sesuai bahasa
    const setTitle = async () => {
      const title = await t('common.homepageTitle', locale, locale === 'en' ? "MiraiDev - Modern Website Development Solutions" : "MiraiDev - Solusi Pengembangan Website Modern");
      document.title = title;
    };

    setTitle();

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
  }, [user, locale]);

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
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
  
  // Gunakan terjemahan atau default dalam bahasa Inggris
  return [
    {
      id: 1,
      title: await t("home.services.customDev.title", "en", "Custom Website Development"),
      category: "Web Development",
      description: await t("home.services.customDev.description", "en", "A website designed specifically to meet your business's unique needs with the latest technology."),
      price: 0,
      features: [
        await t("home.services.customDev.features.responsive", "en", "Responsive design for all devices"),
        await t("home.services.customDev.features.optimization", "en", "Speed and performance optimization"),
        await t("home.services.customDev.features.integration", "en", "Integration with other systems"),
        await t("home.services.customDev.features.seo", "en", "Basic SEO support")
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
      title: await t("home.services.redesign.title", "en", "Website Redesign"),
      category: "Web Development",
      description: await t("home.services.redesign.description", "en", "Modernization of your existing website's appearance and functionality to improve user experience."),
      price: 0,
      features: [
        await t("home.services.redesign.features.audit", "en", "Current website audit and analysis"),
        await t("home.services.redesign.features.modern", "en", "Redesign with modern approach"),
        await t("home.services.redesign.features.migration", "en", "Secure content migration"),
        await t("home.services.redesign.features.testing", "en", "Browser compatibility testing")
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
      title: await t("home.services.maintenance.title", "en", "Website Maintenance Package"),
      category: "Web Development",
      description: await t("home.services.maintenance.description", "en", "Regular maintenance solution to keep your website secure, updated, and running optimally."),
      price: 0,
      features: [
        await t("home.services.maintenance.features.security", "en", "Regular security updates"),
        await t("home.services.maintenance.features.backup", "en", "Automatic data backup"),
        await t("home.services.maintenance.features.monitoring", "en", "Performance monitoring"),
        await t("home.services.maintenance.features.support", "en", "24/7 technical support")
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
      title: await t("home.services.seo.title", "en", "SEO & Performance Optimization"),
      category: "Web Development",
      description: await t("home.services.seo.description", "en", "Additional service to improve your website's ranking in search engines and speed up loading time."),
      price: 0,
      features: [
        await t("home.services.seo.features.audit", "en", "Comprehensive SEO audit"),
        await t("home.services.seo.features.keywords", "en", "Keyword optimization"),
        await t("home.services.seo.features.vitals", "en", "Core Web Vitals improvement"),
        await t("home.services.seo.features.report", "en", "Monthly performance report")
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
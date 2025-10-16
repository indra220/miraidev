"use client";

import { useEffect, useState } from "react"; // DIUBAH: Menambahkan useState
import { HeroSection } from "./components/hero-section";
import { ClientTrustSection } from "./components/client-trust";
import { ServicesOverview } from "./components/services-overview";
import { FeaturedPortfolio } from "./components/featured-portfolio";
import { WhyChooseUsSection } from "./components/why-choose-us";
import { Testimonials } from "./components/testimonials";
import { FinalCtaSection } from "./components/final-cta";
import { createClient } from "@supabase/supabase-js";
import { PortfolioItem, ServiceItem, ContactSubmission } from "@/lib/types";

// Fungsi untuk mengambil data portfolio dari API
async function getPortfolioData(): Promise<PortfolioItem[]> {
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
}

// Fungsi untuk mengambil data services dari API
async function getServicesData(): Promise<ServiceItem[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true })
      .limit(4); // Ambil 4 layanan utama
    
    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }
    
    // Tambahkan is_featured: false ke setiap item untuk memenuhi tipe ServiceDetails
    return data.map(service => ({
      ...service,
      is_featured: false
    })) as ServiceItem[];
  } catch (error) {
    console.error('Error in getServicesData:', error);
    return [];
  }
}

// Fungsi untuk mengambil data testimonial dari API
async function getTestimonialsData(): Promise<ContactSubmission[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('status', 'dibaca')
      .order('created_at', { ascending: false })
      .limit(2); // Ambil 2 testimonial
    
    if (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
    
    // Filter untuk hanya testimonial yang valid
    return data.filter(submission => 
      submission.message.length > 50
    ) as ContactSubmission[];
  } catch (error) {
    console.error('Error in getTestimonialsData:', error);
    return [];
  }
}

export default function HomePage() {
  // Mengatur judul halaman secara dinamis di sisi klien
  useEffect(() => {
    // Baris di bawah ini dihapus untuk menggunakan judul default dari metadata
    // document.title = "Beranda | MiraiDev";

    // Fetch data inside useEffect for client component
    async function fetchData() {
        const portfolioData = await getPortfolioData();
        const servicesData = await getServicesData();
        const testimonialsData = await getTestimonialsData();
        
        // Update state dengan data yang diambil
        setPortfolio(portfolioData);
        setServices(servicesData);
        setTestimonials(testimonialsData.map(submission => ({
            name: submission.name,
            role: submission.name, // Use name as role if not available
            content: submission.message,
            avatar: undefined // Avatar is not available in contact submission
        })));
    }

    fetchData();
  }, []);

  // State untuk menyimpan data
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [testimonials, setTestimonials] = useState<{name: string, role: string, content: string, avatar?: string}[]>([]);

  return (
    <>

      <div>
        <HeroSection />
        
        <ClientTrustSection />
        
        <ServicesOverview services={services} />
        
        <FeaturedPortfolio portfolio={portfolio} />
        
        <WhyChooseUsSection />
        
        <Testimonials testimonials={testimonials} />
        
        <FinalCtaSection />
      </div>
    </>
  );
}
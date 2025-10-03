import { Navbar } from "@/components/navbar";
import { PortfolioItem, ContactSubmission, ServiceItem } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";
import { HeroSection } from "./components/hero-section";
import { ClientTrustSection } from "./components/client-trust";
import { ServicesOverview } from "./components/services-overview";
import { FeaturedPortfolio } from "./components/featured-portfolio";
import { WhyChooseUsSection } from "./components/why-choose-us";
import { Testimonials } from "./components/testimonials";
import { FinalCtaSection } from "./components/final-cta";
import type { Metadata } from "next";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "Beranda",
};

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

export default async function HomePage() {
  // Ambil data real dari database
  const portfolio = await getPortfolioData();
  const services = await getServicesData();
  const contactSubmissions = await getTestimonialsData();
  
  // Konversi contact submissions ke format testimonial
  const testimonials = contactSubmissions.map(submission => ({
    name: submission.name,
    role: submission.name, // Gunakan nama sebagai role jika tidak tersedia
    content: submission.message,
    avatar: undefined // Avatar tidak tersedia di contact submission
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />
      
      <HeroSection />
      
      <ClientTrustSection />
      
      <ServicesOverview services={services} />
      
      <FeaturedPortfolio portfolio={portfolio} />
      
      <WhyChooseUsSection />
      
      <Testimonials testimonials={testimonials} />
      
      <FinalCtaSection />
    </div>
  );
}
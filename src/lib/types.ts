// =================================================================
// Tipe Definisi untuk Skema Database Proyek MiraiDev
// =================================================================

/**
 * Merepresentasikan sebuah item dalam tabel 'portfolio'.
 * Digunakan di halaman Portofolio dan dasbor admin.
 */
export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description?: string | null;
  image_url?: string | null;
  tags?: string[] | null;
  client?: string | null;
  date?: string | null; // Tipe DATE di SQL menjadi string di JS/TS (format: 'YYYY-MM-DD')
  views?: number;
  case_study_url?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Merepresentasikan sebuah layanan dalam tabel 'services'.
 * Digunakan di halaman Layanan dan dasbor admin.
 */
export interface ServiceItem {
  id: number;
  title: string;
  category: string;
  description?: string | null;
  features?: string[] | null;
  icon?: string | null;
  order?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Merepresentasikan informasi klien atau pengguna dalam tabel 'clients'.
 * Digunakan di dasbor admin untuk manajemen pengguna.
 */
export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  role: 'klien' | 'pegawai' | 'admin'; // Tipe enum di SQL
  status: 'aktif' | 'tidak aktif' | 'pending'; // Tipe enum di SQL
  join_date: string; // Tipe DATE di SQL menjadi string di JS/TS (format: 'YYYY-MM-DD')
  project_count?: number;
  rating?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Merepresentasikan data dari formulir di halaman Kontak.
 * Sesuai dengan tabel 'contact_submissions'.
 */
export interface ContactSubmission {
  id: string; // UUID
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  project_type?: string | null;
  budget?: string | null;
  timeline?: string | null;
  message: string;
  status: 'baru' | 'dibaca' | 'diarsipkan'; // Tipe enum di SQL
  priority: 'rendah' | 'sedang' | 'tinggi'; // Tipe enum di SQL
  created_at: string;
}

/**
 * Merepresentasikan data SEO untuk halaman-halaman tertentu dalam tabel 'seo_settings'.
 * Digunakan untuk mengelola meta tags dan Open Graph data.
 */
export interface SeoSetting {
  id: number;
  page_path: string; // Contoh: '/', '/layanan', '/portofolio'
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: string | null;
  canonical_url?: string | null;
  robots_index?: boolean;
  robots_follow?: boolean;
  sitemap_priority?: number; // Nilai antara 0.0 dan 1.0
  last_modified?: string; // Tipe DATE di SQL menjadi string di JS/TS (format: 'YYYY-MM-DD')
  created_at: string;
  updated_at: string;
}

/**
 * Merepresentasikan data statistik analitik dalam tabel 'analytics_data'.
 * Digunakan untuk menyimpan data pengunjung dan kinerja website.
 */
export interface AnalyticsData {
  id: number;
  date: string; // Tipe DATE di SQL menjadi string di JS/TS (format: 'YYYY-MM-DD')
  visitors_count: number;
  page_views: number;
  bounce_rate?: number;
  avg_session_duration?: number; // Dalam detik
  created_at: string;
  updated_at: string;
}

/**
 * Merepresentasikan data dari formulir langganan buletin.
 * Sesuai dengan tabel 'newsletter_subscriptions'.
 */
export interface NewsletterSubscription {
  id: string; // UUID
  email: string;
  created_at: string;
  confirmed?: boolean;
}

/**
 * Merepresentasikan informasi pengguna dalam tabel 'users' (untuk autentikasi Supabase Auth)
 * Ini sesuai dengan struktur internal Supabase Auth
 */
export interface User {
  id: string; // UUID dari Supabase Auth
  email: string;
  user_metadata: {
    name?: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
}
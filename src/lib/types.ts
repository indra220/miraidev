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
 * Merepresentasikan data dari formulir di halaman Kontak.
 * Sesuai dengan tabel 'contact_submissions'.
 */
export interface ContactSubmission {
  id: string; // UUID
  name: string;
  email: string;
  phone?: string | null;
  project_type?: string | null;
  budget?: string | null;
  timeline?: string | null;
  message: string;
  created_at: string;
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
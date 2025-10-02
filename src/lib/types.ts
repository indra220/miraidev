// Di file types.ts Anda
// Kode perbaikan dengan path yang jelas dan tidak ambigu
import type { Database } from './supabase-types/supabase';

// --- TIPE DASAR (ROW ALIASES) ---
// Membuat alias untuk setiap tipe 'Row' agar lebih mudah digunakan.
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ServiceRow = Database['public']['Tables']['services']['Row'];
type PortfolioRow = Database['public']['Tables']['portfolio']['Row'];
type ClientRow = Database['public']['Tables']['clients']['Row'];
type ProjectRow = Database['public']['Tables']['projects']['Row'];
type ContactSubmissionRow = Database['public']['Tables']['contact_submissions']['Row'];
type AnalyticsDataRow = Database['public']['Tables']['analytics_data']['Row'];
type SeoSettingRow = Database['public']['Tables']['seo_settings']['Row'];
type NewsletterSubscriptionRow = Database['public']['Tables']['newsletter_subscriptions']['Row'];
type UserSessionRow = Database['public']['Tables']['user_sessions']['Row'];
type NotificationRow = Database['public']['Tables']['notifications']['Row'];

// --- PROFILES ---
// Tipe untuk data profil pengguna yang diperkaya dengan state di sisi klien.
export interface UserProfile extends ProfileRow {
  is_logged_in: boolean;
  last_activity: Date;
}

// --- SERVICES ---
// Tipe dasar untuk daftar layanan.
// Tipe ini sekarang secara otomatis memiliki properti 'is_active' dan 'price'.
export type ServiceItem = ServiceRow;

// Tipe untuk detail layanan, misalnya saat ditampilkan di halaman detail.
// Tipe ini juga otomatis memiliki 'is_active' dan 'price'.
export interface ServiceDetails extends ServiceRow {
  is_featured: boolean;
}

// --- PORTFOLIO ---
// Tipe untuk item portofolio yang diperkaya dengan state UI.
export interface PortfolioItem extends PortfolioRow {
  is_highlighted: boolean;
}

// --- CLIENTS ---
// Tipe dasar untuk data klien, langsung dari database.
export type Client = ClientRow;

// Tipe data klien yang diperkaya dengan metadata untuk CRM atau manajemen.
export interface ClientData extends ClientRow {
    last_contacted: Date | null;
}

// --- PROJECTS ---
// Tipe dasar untuk data proyek.
export type Project = ProjectRow;

// Tipe data proyek yang diperkaya dengan state sisi klien.
export interface ProjectDetails extends ProjectRow {
    progress: number; // Contoh: progress dalam persentase (0-100)
    is_archived: boolean;
}

// --- NOTIFICATIONS ---
// Tipe dasar untuk data notifikasi, langsung dari database.
export type Notification = NotificationRow;

// Tipe data notifikasi yang diperkaya dengan data sisi klien.
export interface NotificationDetails extends NotificationRow {
    relative_time: string; // Contoh: "5 menit yang lalu"
}

// --- CONTACT SUBMISSIONS ---
// Tipe untuk data formulir kontak, tidak memerlukan properti tambahan.
export type ContactSubmission = ContactSubmissionRow;

// --- ANALYTICS ---
// Tipe untuk data analitik, biasanya hanya untuk ditampilkan.
export type AnalyticsData = AnalyticsDataRow;

// --- SEO SETTINGS ---
// Tipe untuk pengaturan SEO, tidak perlu properti tambahan di klien.
export type SeoSetting = SeoSettingRow;

// --- NEWSLETTER SUBSCRIPTIONS ---
// Tipe untuk pelanggan newsletter.
export type NewsletterSubscription = NewsletterSubscriptionRow;

// --- USER SESSIONS ---
// Tipe untuk sesi pengguna, diperkaya untuk menandai sesi yang aktif.
export interface UserSession extends UserSessionRow {
    is_current_session: boolean;
}
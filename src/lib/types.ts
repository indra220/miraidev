// Di file types.ts Anda
// Kode perbaikan dengan path yang jelas dan tidak ambigu
import type { Database } from './supabase-types/supabase';

// 2. Alias untuk Tipe Baris (Row) dari Setiap Tabel
// Ini membuat penggunaan tipe dari Supabase menjadi lebih singkat dan rapi.
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ServiceRow = Database['public']['Tables']['services']['Row'];
type PortfolioRow = Database['public']['Tables']['portfolio']['Row'];
type ClientRow = Database['public']['Tables']['clients']['Row'];
type ProjectRow = Database['public']['Tables']['projects']['Row'];
type ReportRow = Database['public']['Tables']['reports']['Row'];
type SupportTicketRow = Database['public']['Tables']['support_tickets']['Row'];
type ContactSubmissionRow = Database['public']['Tables']['contact_submissions']['Row'];
type AnalyticsDataRow = Database['public']['Tables']['analytics_data']['Row'];
type SettingRow = Database['public']['Tables']['settings']['Row'];
type SeoSettingRow = Database['public']['Tables']['seo_settings']['Row'];
type NewsletterSubscriptionRow = Database['public']['Tables']['newsletter_subscriptions']['Row'];
type UserSessionRow = Database['public']['Tables']['user_sessions']['Row'];
type NotificationRow = Database['public']['Tables']['notifications']['Row'];


// 3. Alias untuk Tipe Enum
// Mengambil definisi ENUM langsung dari skema database.
export type AppRole = Database['public']['Enums']['app_role'];
export type ReportType = Database['public']['Enums']['report_type'];
export type TicketStatus = Database['public']['Enums']['ticket_status'];
export type TicketPriority = Database['public']['Enums']['ticket_priority'];


// 4. Tipe yang Diekspor untuk Digunakan di Seluruh Aplikasi
// Di sini kita bisa memilih untuk langsung mengekspor tipe baris,
// atau memperkayanya dengan properti khusus sisi klien.

// --- PROFILES ---
// Tipe untuk data profil pengguna yang diperkaya dengan state di sisi klien.
export interface UserProfile extends ProfileRow {
  is_logged_in?: boolean; // Properti khusus UI
}

// --- PROJECTS ---
// Tipe dasar untuk proyek, langsung dari database.
export type Project = ProjectRow;

// --- SERVICES ---
// Tipe dasar untuk layanan, langsung dari database.
export type ServiceItem = ServiceRow;

// Interface untuk data layanan dengan properti tambahan
export interface ServiceDetails extends ServiceRow {
  is_featured?: boolean; // Properti tambahan untuk UI
}

// --- REPORTS ---
// Tipe dasar untuk laporan, langsung dari database.
export type Report = ReportRow;

// --- SUPPORT TICKETS ---
// Tipe dasar untuk tiket dukungan, langsung dari database.
export type SupportTicket = SupportTicketRow;

// --- CLIENTS ---
// Tipe dasar untuk klien, langsung dari database.
export type Client = ClientRow;

// Interface untuk data klien dengan properti tambahan
export interface ClientData extends ClientRow {
  last_contacted?: string | null; // Properti tambahan untuk UI
}

// --- NOTIFICATIONS ---
// Tipe notifikasi yang diperkaya dengan properti UI
export interface NotificationDetails extends NotificationRow {
  relative_time?: string; // Contoh: "5 menit yang lalu"
}

// --- Tipe Lainnya (langsung ekspor dari database) ---
export type PortfolioItem = PortfolioRow;
export type ContactSubmission = ContactSubmissionRow;
export type AnalyticsData = AnalyticsDataRow;
export type Setting = SettingRow;
export type SeoSetting = SeoSettingRow;
export type NewsletterSubscription = NewsletterSubscriptionRow;
export type UserSession = UserSessionRow;
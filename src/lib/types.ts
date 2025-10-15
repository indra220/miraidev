// src/lib/types.ts
//
// File ini berfungsi sebagai pusat definisi tipe TypeScript untuk seluruh aplikasi.
// Tipe-tipe ini diimpor dari skema database yang dihasilkan secara otomatis oleh Supabase (`supabase-types/supabase.ts`)
// dan diperkaya dengan tipe kustom atau properti tambahan untuk kebutuhan sisi klien (UI/UX).
// CATATAN: Perubahan pada skema DB memerlukan regenerasi tipe Supabase, yang akan otomatis memperbarui tipe 'Row' di bawah ini.

import type { Database } from './supabase-types/supabase';

// =================================================================
// 1. ALIAS TIPE DASAR (ROW & ENUM) DARI SKEMA DATABASE
// =================================================================
// Tujuannya adalah untuk membuat alias yang lebih pendek dan mudah digunakan
// di seluruh aplikasi, alih-alih menulis path tipe yang panjang.

// --- Alias untuk Tipe Baris (Row) dari Setiap Tabel ---

// Manajemen Inti
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ClientRow = Database['public']['Tables']['clients']['Row'];
type ProjectRow = Database['public']['Tables']['projects']['Row'];
type ServiceRow = Database['public']['Tables']['services']['Row'];
type PortfolioRow = Database['public']['Tables']['portfolio']['Row'];
type ContactSubmissionRow = Database['public']['Tables']['contact_submissions']['Row'];
type SupportTicketRow = Database['public']['Tables']['support_tickets']['Row'];
type ProjectUpdateRow = Database['public']['Tables']['project_updates']['Row'];
type ChatMessageRow = Database['public']['Tables']['chat_messages']['Row'];
type ContactMessageThreadRow = Database['public']['Tables']['contact_message_threads']['Row'];
type SupportTicketReplyRow = Database['public']['Tables']['support_ticket_replies']['Row'];
type ConversationRow = Database['public']['Tables']['conversations']['Row'];
type ConversationMessageRow = Database['public']['Tables']['conversation_messages']['Row'];

// Sistem Harga Dinamis
type ProjectTypeRow = Database['public']['Tables']['project_types']['Row'];
type FeaturePriceRow = Database['public']['Tables']['feature_prices']['Row'];
type PagePriceRow = Database['public']['Tables']['page_prices']['Row'];
type TimelinePriceRow = Database['public']['Tables']['timeline_prices']['Row'];
type ComplexityPriceRow = Database['public']['Tables']['complexity_prices']['Row'];
type PricingPackageRow = Database['public']['Tables']['pricing_packages']['Row'];
type PackageFeatureRow = Database['public']['Tables']['package_features']['Row'];
type PricingLogRow = Database['public']['Tables']['pricing_logs']['Row'];

// Pengaturan & Utilitas
type SettingRow = Database['public']['Tables']['settings']['Row'];
type SeoSettingRow = Database['public']['Tables']['seo_settings']['Row'];
type NotificationRow = Database['public']['Tables']['notifications']['Row'];
type ReportRow = Database['public']['Tables']['reports']['Row'];
type AnalyticsDataRow = Database['public']['Tables']['analytics_data']['Row'];
type NewsletterSubscriptionRow = Database['public']['Tables']['newsletter_subscriptions']['Row'];
type UserSessionRow = Database['public']['Tables']['user_sessions']['Row']; // Tipe ini akan otomatis diperbarui setelah regenerasi

// --- Alias untuk Tipe Enum ---
export type AppRole = Database['public']['Enums']['app_role'];
export type ClientRole = Database['public']['Enums']['client_role'];
export type ClientStatus = Database['public']['Enums']['client_status'];
export type ChatSenderType = Database['public']['Enums']['chat_sender_type'];
export type MessageSenderType = Database['public']['Enums']['message_sender_type'];
export type NotificationType = Database['public']['Enums']['notification_type'];
export type ReportType = Database['public']['Enums']['report_type'];
export type SubmissionPriority = Database['public']['Enums']['submission_priority'];
export type SubmissionStatus = Database['public']['Enums']['submission_status'];
export type TicketPriority = Database['public']['Enums']['ticket_priority'];
export type TicketStatus = Database['public']['Enums']['ticket_status'];
export type TicketSenderType = Database['public']['Enums']['ticket_sender_type'];

// =================================================================
// 2. TIPE YANG DIEKSPOR UNTUK DIGUNAKAN DI APLIKASI
// =================================================================
// Tipe-tipe ini bisa merupakan alias langsung dari tipe Row, atau interface
// yang diperkaya (`extends`) dengan properti tambahan untuk kebutuhan state management di sisi klien.

// --- Pengguna & Profil ---
/**
 * Tipe untuk data profil pengguna yang diperkaya dengan state di sisi klien.
 */
export interface UserProfile extends ProfileRow {
  is_logged_in?: boolean; // Properti UI untuk menandakan status login
}

// --- Klien ---
/**
 * Tipe dasar untuk data klien.
 */
export type Client = ClientRow;

/**
 * Interface untuk data klien dengan properti tambahan untuk UI.
 */
export interface ClientData extends ClientRow {
  last_contacted?: string | null; // Properti UI untuk melacak kontak terakhir
}

// --- Proyek ---
/**
 * Tipe dasar untuk proyek, dengan relasi opsional ke jenis proyek di sisi klien.
 */
export interface Project extends ProjectRow {
  project_type?: ProjectType; // Relasi opsional yang di-populate di client-side
}

// --- Laporan/Update Proyek ---
/**
 * Tipe untuk laporan atau pembaruan proyek.
 */
export type ProjectUpdate = ProjectUpdateRow;

// --- Pesan Chat Proyek ---
/**
 * Tipe untuk pesan dalam fitur chat proyek.
 */
export type ChatMessage = ChatMessageRow;

// --- Thread Balasan Kontak ---
/**
 * Tipe untuk pesan dalam thread balasan dari formulir kontak.
 */
export type ContactMessageThread = ContactMessageThreadRow;

// --- Percakapan Umum ---
/**
 * Tipe untuk sebuah thread percakapan umum.
 */
export type Conversation = ConversationRow;

/**
 * Tipe untuk sebuah pesan dalam percakapan umum.
 */
export type ConversationMessage = ConversationMessageRow;


// --- Layanan ---
/**
 * Tipe dasar untuk item layanan.
 */
export type ServiceItem = ServiceRow;

/**
 * Tipe untuk detail layanan yang diperkaya dengan properti UI.
 */
export interface ServiceDetails extends ServiceRow {
  is_featured?: boolean; // Properti UI untuk menandai layanan unggulan
}

// --- Notifikasi ---
/**
 * Tipe notifikasi yang diperkaya dengan properti UI.
 */
export interface NotificationDetails extends NotificationRow {
  relative_time?: string; // Contoh: "5 menit yang lalu"
}

// --- Sistem Harga Dinamis ---

/** Tipe untuk jenis proyek. */
export type ProjectType = ProjectTypeRow;

/** Tipe untuk harga per fitur. */
export type FeaturePrice = FeaturePriceRow;

/** Tipe untuk harga per halaman. */
export type PagePrice = PagePriceRow;

/** Tipe untuk pengganda harga berdasarkan timeline. */
export type TimelinePrice = TimelinePriceRow;

/** Tipe untuk pengganda harga berdasarkan kompleksitas. */
export type ComplexityPrice = ComplexityPriceRow;

/** Tipe untuk fitur dalam sebuah paket harga (tabel pivot). */
export type PackageFeature = PackageFeatureRow;

/**
 * Tipe untuk paket harga yang diperkaya dengan daftar fiturnya.
 */
export interface PricingPackage extends PricingPackageRow {
  featureDetails?: (PackageFeature & { feature_prices: FeaturePrice | null })[]; // Daftar fitur yang sudah di-populate
}

/** Tipe untuk log audit perubahan harga. */
export type PricingLog = PricingLogRow;

// --- Tipe Lainnya (Ekspor Langsung) ---

/** Tipe untuk item dalam portofolio. */
export type PortfolioItem = PortfolioRow;

/**
 * Tipe untuk data dari formulir kontak.
 */
export type ContactSubmission = ContactSubmissionRow;

/** Tipe untuk data analitik. */
export type AnalyticsData = AnalyticsDataRow;

/** Tipe untuk pengaturan situs global. */
export type Setting = SettingRow;

/** Tipe untuk pengaturan SEO per halaman. */
export type SeoSetting = SeoSettingRow;

/** Tipe untuk pelanggan buletin. */
export type NewsletterSubscription = NewsletterSubscriptionRow;

/** * Tipe untuk sesi pengguna yang aktif.
 * Tipe ini secara otomatis mencerminkan skema tabel 'user_sessions'.
 */
export type UserSession = UserSessionRow;

/** Tipe untuk laporan. */
export type Report = ReportRow;

/**
 * Tipe untuk tiket dukungan.
 */
export type SupportTicket = SupportTicketRow;

/**
 * Tipe untuk balasan pada sebuah tiket dukungan.
 */
export type SupportTicketReply = SupportTicketReplyRow;
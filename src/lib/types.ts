// Di file types.ts Anda
// Kode perbaikan dengan path yang jelas dan tidak ambigu
import type { Database } from './supabase-types/supabase';

// --- PROFILES ---
// Mengambil tipe 'Row' dari tabel 'profiles'
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

// Membuat tipe baru dengan menambahkan properti lain
export interface UserProfile extends ProfileRow {
  is_logged_in: boolean;
  last_activity: Date;
}

// --- SERVICES ---
// Mengambil tipe 'Row' dari tabel 'services'
type ServiceRow = Database['public']['Tables']['services']['Row'];

// Membuat tipe dasar untuk layanan dari tabel supabase
export type ServiceItem = ServiceRow;

// Membuat tipe baru untuk detail layanan dengan properti tambahan di sisi klien
// Contoh: untuk menandai layanan unggulan di UI
export interface ServiceDetails extends ServiceRow {
  is_featured: boolean;
}

// --- PORTFOLIO ---
// Mengambil tipe 'Row' dari tabel 'portfolio'
type PortfolioRow = Database['public']['Tables']['portfolio']['Row'];

// Membuat tipe baru untuk item portofolio dengan properti tambahan di sisi klien
// Contoh: untuk menandai item yang ingin ditonjolkan
export interface PortfolioItem extends PortfolioRow {
  is_highlighted: boolean;
}

// --- CLIENTS ---
// Mengambil tipe 'Row' dari tabel 'clients'
type ClientRow = Database['public']['Tables']['clients']['Row'];

// Membuat tipe dasar untuk klien dari tabel supabase
export type Client = ClientRow;

// Membuat tipe baru untuk data klien dengan properti tambahan di sisi klien
// Contoh: untuk melacak kapan klien terakhir dihubungi
export interface ClientData extends ClientRow {
    last_contacted: Date | null;
}

// --- CONTACT SUBMISSIONS ---
// Mengambil tipe 'Row' dari tabel 'contact_submissions'
type ContactSubmissionRow = Database['public']['Tables']['contact_submissions']['Row'];

// Anda bisa langsung mengekspor tipe baris jika tidak ada properti tambahan
export type ContactSubmission = ContactSubmissionRow;
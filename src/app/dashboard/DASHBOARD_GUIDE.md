# Dashboard Klien - Dokumentasi

Dashboard klien adalah fitur utama yang memungkinkan pengguna untuk mengelola proyek dan layanan mereka dengan efisien. Dashboard ini menyediakan antarmuka yang intuitif untuk memantau status proyek, mengelola layanan, berkomunikasi dengan tim, serta mengakses laporan dan dukungan.

## Struktur Dashboard

Dashboard terdiri dari beberapa bagian utama:

### 1. Sidebar Navigasi
- Berisi menu navigasi untuk berpindah antar bagian dashboard
- Dilengkapi dengan ikon untuk memudahkan identifikasi
- Desain responsif untuk berbagai ukuran layar

### 2. Header
- Menampilkan informasi pengguna dan akses ke pengaturan
- Tombol toggle mode gelap/terang
- Menu dropdown untuk manajemen akun

### 3. Konten Utama
- Menggunakan sistem tabs untuk mengorganisasi informasi
- Responsif dan mendukung berbagai ukuran layar
- Dilengkapi dengan komponen UI konsisten

## Bagian-bagian Dashboard

### 1. Ringkasan (Overview)
- Menampilkan statistik proyek secara keseluruhan
- Progress bar untuk proyek-proyek aktif
- Informasi penting dalam satu tampilan

### 2. Proyek (Projects)
- Daftar proyek dengan status masing-masing
- Filter untuk proyek aktif, selesai, dan ditunda
- Timeline dan milestone proyek

### 3. Layanan (Services)
- Riwayat layanan yang telah digunakan
- Status layanan aktif dan masa berlaku
- Informasi harga dan jenis layanan

### 4. Pesan (Messages)
- Notifikasi penting dari tim
- Forum diskusi proyek
- Riwayat komunikasi

### 5. Laporan (Reports)
- Grafik traffic dan penggunaan
- Statistik kinerja website/aplikasi
- Akses ke dokumen laporan

### 6. Dukungan (Support)
- Formulir pengajuan tiket dukungan
- Daftar tiket dukungan yang sedang diproses
- Status dan prioritas tiket

### 7. Akun (Account)
- Informasi profil pengguna
- Pengaturan keamanan
- Preferensi pribadi

## Komponen Utama

### Komponen Reusabel
- `ProjectOverview.tsx` - Ringkasan proyek dan statistik
- `ServiceHistory.tsx` - Riwayat dan status layanan
- `Communication.tsx` - Sistem pesan dan notifikasi
- `Reports.tsx` - Visualisasi data dan analitik
- `SupportTicket.tsx` - Sistem pengajuan tiket dukungan
- `UserProfile.tsx` - Manajemen profil pengguna

### Struktur Navigasi
- `Sidebar.tsx` - Sidebar navigasi kiri
- `Header.tsx` - Header atas dengan informasi pengguna
- `UserNav.tsx` - Dropdown menu untuk akun pengguna

## Teknologi yang Digunakan

Dashboard dibangun dengan teknologi berikut:
- Next.js 15 dengan App Router
- TypeScript untuk type safety
- Tailwind CSS untuk styling
- shadcn/ui untuk komponen UI
- Recharts untuk visualisasi data
- Lucide React untuk ikon
- Supabase untuk otentikasi

## Otentikasi

Dashboard dilindungi oleh sistem otentikasi:
- Hook `useAuth.ts` untuk mengelola status login
- Middleware untuk proteksi route
- Otentikasi menggunakan Supabase
- Redirect otomatis jika tidak login

## Panduan Pengembangan

### Menambah Fitur Baru
1. Buat komponen baru di `src/components/dashboard/`
2. Tambahkan route di folder `src/app/dashboard/`
3. Update navigasi di `src/constants/dashboard.ts`
4. Pastikan komponen menggunakan tipe yang sesuai dari `src/types/dashboard.ts`

### Styling
- Gunakan komponen shadcn/ui untuk konsistensi
- Ikuti sistem warna dan tipografi yang ada
- Gunakan utility className dari Tailwind CSS
- Pastikan mendukung mode gelap dan terang

### Testing
- Pastikan semua komponen responsif
- Test di berbagai ukuran layar
- Verifikasi fungsionalitas otentikasi
- Pastikan build tidak menghasilkan error
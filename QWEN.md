# Konteks Proyek

## Informasi Proyek
- **Nama Proyek**: miraidev
- **Judul Proyek**: mirai-dev-website
- **Versi**: 0.5.26
- **Direktori**: D:\Kerjaan\Contoh\miraidev
- **Tanggal**: Rabu, 15 Oktober 2025

## Struktur Proyek
Ini adalah aplikasi Next.js 15.5.4 dengan TypeScript, menggunakan arsitektur App Router. File dan direktori penting meliputi:

### Direktori Root
- `next.config.ts` - Konfigurasi Next.js dengan redirect, optimasi gambar, dan output mandiri
- `package.json` - Dependensi, skrip, dan metadata proyek
- `tsconfig.json` - Konfigurasi TypeScript dengan alias path (`@/*` mengarah ke `./src/*`)
- `postcss.config.mjs` - Konfigurasi PostCSS dengan plugin Tailwind CSS
- `eslint.config.mjs` - Konfigurasi ESLint dengan dukungan React Hooks dan TypeScript
- `components.json` - Konfigurasi pustaka komponen Shadcn UI
- `middleware.ts` - Terletak di src/, menangani middleware aplikasi
- `public/` - Direktori aset statis
- `src/` - Direktori kode sumber utama
- `supabase/` - Konfigurasi dan setup lokal Supabase
- `.env.local` - Variabel lingkungan

### Struktur Direktori Sumber (`src/`)
- `app/` - Halaman dan tata letak Next.js App Router
- `components/` - Komponen React yang dapat digunakan kembali
- `constants/` - Konstanta dan nilai konfigurasi aplikasi
- `hooks/` - Hook React kustom
- `lib/` - Pustaka utilitas dan fungsi pembantu
- `types/` - Definisi tipe TypeScript
- `utils/` - Fungsi utilitas

### Struktur App Router (`src/app/`)
- `(main)` - Rute aplikasi utama
- `admin/` - Antarmuka administrasi
- `api/` - Rute API
- `auth/` - Alur otentikasi
- `dashboard/` - Fungsionalitas dashboard
- `profile/` - Halaman profil pengguna
- `globals.css` - Gaya global
- `layout.tsx` - Komponen tata letak root
- `metadata.ts` - Metadata aplikasi
- `page.tsx` - Komponen halaman beranda

## Lingkungan Pengembangan
- Sistem Operasi: Windows (win32)
- Node.js: Diperlukan untuk pengembangan
- Manajer Paket: npm (berdasarkan package-lock.json)
- Bahasa: TypeScript dengan mode ketat diaktifkan
- Framework: Next.js 15.5.4 dengan App Router
- Kompilator: React Compiler (babel-plugin-react-compiler)
- Styling: Tailwind CSS dengan tw-animate-css untuk animasi
- Komponen UI: Primitif Radix UI dengan integrasi shadcn
- Database: Integrasi Supabase (@supabase/supabase-js)

## Dependensi
### Dependensi Utama
- Next.js 15.5.4 dengan React 19.1.0 dan React DOM 19.1.0
- TypeScript 5+ dengan pemeriksaan tipe ketat
- Tailwind CSS 4 untuk styling
- Supabase untuk database dan otentikasi
- SDK AI untuk integrasi Anthropic dan OpenAI
- Framer Motion untuk animasi
- Zod untuk validasi skema
- React Hook Form dengan resolver Zod untuk formulir
- Recharts untuk visualisasi data
- Lucide React untuk ikon
- Date-fns untuk manipulasi tanggal

### Dependensi Dev Utama
- ESLint 9+ dengan TypeScript ESLint
- @next/bundle-analyzer untuk analisis performa
- TypeScript 5+ dengan pemeriksaan tipe

## Detail Konfigurasi
### Konfigurasi Next.js (`next.config.ts`)
- Redirect: Jalur root `/` diarahkan ke `/beranda`
- Gambar: Pola remote dikonfigurasi untuk localhost, mirai.dev, Discord, GitHub, dan raw.githubusercontent.com
- Output: Mode mandiri untuk deployment produksi
- Entri on-demand: Usia tidak aktif maksimal 60 detik
- Kompilator React: Dinonaktifkan di pengaturan eksperimental
- Format gambar: Mendukung AVIF dan WebP dengan TTL cache 24 jam

### Konfigurasi TypeScript (`tsconfig.json`)
- Target: ES2017
- Mode ketat: Diaktifkan
- Alias path: `@/*` mengarah ke `./src/*`
- JSX: Dipertahankan untuk kompatibilitas Next.js
- Plugin Next.js: Diaktifkan untuk pemeriksaan tipe

### Konfigurasi ESLint (`eslint.config.mjs`)
- Aturan React Hooks yang direkomendasikan
- Plugin React Refresh untuk pengembangan
- Aturan prefer const untuk performa
- Penggunaan console dibatasi untuk warn dan error

### Konfigurasi PostCSS (`postcss.config.mjs`)
- Plugin Tailwind CSS: @tailwindcss/postcss

## Skrip
- `dev` - Mulai server pengembangan dengan Turbopack (`next dev --turbopack`)
- `build` - Bangun aplikasi produksi (`next build`)
- `start` - Mulai server produksi (`next start`)
- `lint` - Jalankan linting (`next lint`)

## Catatan Proyek
- Ini adalah aplikasi Next.js full-stack dengan kemampuan AI terintegrasi
- Menggunakan Supabase untuk layanan backend (database, otentikasi, penyimpanan)
- Menerapkan pola React modern dengan TypeScript
- Menyertakan fitur aksesibilitas melalui Radix UI
- Memiliki bagian admin dan dashboard untuk manajemen pengguna
- Menggunakan React Compiler untuk optimasi performa
- Mencakup pertimbangan internasionalisasi
- Menerapkan desain responsif dengan Tailwind CSS
- Memiliki rute API untuk fungsionalitas backend
- Menggunakan versioning semantik dengan versi saat ini 0.5.7

## Instruksi Agen Qwen
- Selalu gunakan TypeScript untuk komponen dan utilitas baru
- Ikuti pola kode dan struktur komponen yang ada di direktori `components/`
- Saat membuat komponen UI baru, gunakan primitif Radix UI dan pola shadcn
- Jaga standar aksesibilitas (atribut ARIA, navigasi keyboard)
- Gunakan kelas utilitas Tailwind CSS dengan token desain yang konsisten
- Saat bekerja dengan formulir, gunakan React Hook Form dengan validasi Zod
- Untuk animasi, gunakan Framer Motion atau animasi Tailwind
- Saat menambahkan rute API baru, ikuti pola yang ada di `src/app/api/`
- Hormati struktur folder dan konvensi penamaan file yang ada
- Gunakan alias path `@/*` saat mengimpor dari direktori `src/`
- Saat mengimplementasikan fitur baru, pertimbangkan desain responsif sejak awal
- Ikuti pola penanganan error yang ada di seluruh aplikasi
- Gunakan prinsip versioning semantik saat memperbarui dependensi
- Jaga konsistensi dengan pustaka komponen yang ada

## Development Rules
Sebelum memulai proses coding, harap menerapkan dan mematuhi aturan pengembangan proyek berikut ini secara konsisten:

### 1. Sistem Versi (Versioning Rule)
- Setiap kali ada penambahan, perubahan, atau pembaruan fitur, versi proyek wajib diperbarui.
- Pola peningkatan versi mengikuti format vX.Y.Z (semantic versioning sederhana):
  - Z (patch): untuk pembaruan kecil, perbaikan bug, atau optimasi ringan.
  - Y (minor): untuk penambahan fitur baru atau pembaruan besar tanpa mengubah kompatibilitas utama.
  - Contoh urutan versi: v0.4.4 → v0.4.5 → … → v0.4.9 → v0.5.0 dan seterusnya.
- Catatan: Versi hanya boleh diperbarui ketika saya (pengguna) menyatakan bahwa versi baru harus diupdate.

### 2. Bahasa yang Digunakan
- Seluruh komunikasi, komentar, dokumentasi, dan kode (jika memungkinkan) harus menggunakan Bahasa Indonesia secara konsisten.
- Hindari penggunaan campuran bahasa atau istilah asing kecuali istilah teknis yang umum (misalnya: "build", "commit", "component", dll).

### 3. Analisis Sebelum Aksi
- Selalu analisis struktur kode, file terkait, dan dependensi sebelum melakukan perubahan, penambahan, atau pembaruan fitur apa pun yang saya perintahkan.
- Jika ada risiko konflik atau duplikasi fungsi, beri saran terlebih dahulu sebelum mengubah kode.

### 4. Konsistensi Fitur
- Semua fitur yang sudah ada harus dipertahankan kecuali saya memberikan instruksi langsung untuk menghapus atau menggantinya.
- Saat menambahkan fitur baru, pastikan kompatibilitas dengan fitur lama tetap terjaga dan tidak ada bagian sistem yang terganggu.
- Jika ada fitur lama yang perlu disesuaikan, berikan penjelasan detail mengenai dampak dan perubahan yang terjadi.

### 5. Prosedur Pengecekan (Build Validation)
- Setelah setiap perubahan atau pembaruan kode, jalankan perintah `npm run build` untuk memastikan tidak ada error pada tahap build.
- Jangan menjalankan `npm run dev` secara otomatis tanpa instruksi dari saya.
- Laporkan hasil pengecekan build jika ada error atau peringatan.

### 6. Larangan Pengeditan File Tertentu
- Jangan mengedit file berikut dalam kondisi apa pun:
  - `src/lib/supabase-types/supabase.ts`
  - `src/lib/types.ts`
- File tersebut dianggap sebagai file inti (core files) dan tidak boleh diubah tanpa izin eksplisit.

### 7. Pengelolaan CHANGELOG.md
- Setiap kali ada peningkatan versi atau perubahan signifikan pada proyek, file `CHANGELOG.md` harus diperbarui sesuai dengan format yang telah ditetapkan.
- Format penulisan untuk setiap entri dalam `CHANGELOG.md` harus mengikuti standar:
  - Gunakan header tingkat 2 (`##`) untuk versi baru
  - Cantumkan tanggal perilisan versi
  - Kelompokkan perubahan berdasarkan kategori: Added, Changed, Fixed, Removed
  - Gunakan list dengan bullet point (`-`) untuk setiap item perubahan
  - Tautkan ke halaman GitHub releases jika tersedia
- File `CHANGELOG.md` harus selalu diperbarui sebelum menaikkan nomor versi dalam `package.json`.
- Kecuali untuk rancangan pengembangan atau dokumentasi perencanaan, yang tidak perlu mengupdate versi dan tidak perlu dimasukkan ke CHANGELOG.md.
- Karena `src/lib/supabase-types/supabase.ts` merupakan skema database
- File `src/lib/supabase-types/supabase.ts` itu jangan dikategorikan rusak karena file ini merupakan skema langsung dari supabase
- File `src/lib/types.ts` berfungsi sebagai jembatan antara aplikasi dan skema database yang ada pada file `src/lib/supabase-types/supabase.ts`
- File `skema.sql` merupakan copy dari skema database `src/lib/supabase-types/supabase.ts` agar memudahkan anda membaca skema database nya, jadi `skema.sql`dan `src/lib/supabase-types/supabase.ts` pada dasarnya sama, tetapi jika ingin mengambil data nya harus melewati `src/lib/types.ts` 

### 8. Kepatuhan terhadap Aturan
- Semua instruksi di atas bersifat permanen dan wajib dipatuhi selama proses pengembangan berlangsung.
- Jika ada kondisi yang membuat aturan ini sulit diterapkan, berikan penjelasan terlebih dahulu sebelum melakukan tindakan.

### 9. Aturan Update Versi dan CHANGELOG.md
- Jika pengguna memberikan perintah "update versi", maka file `CHANGELOG.md` dan versi dalam `package.json` wajib diperbarui.
- Format versi mengikuti sistem versioning semantik (vX.Y.Z) sesuai aturan nomor 1.
- Entri baru di `CHANGELOG.md` harus mengikuti format standar sesuai aturan nomor 7.
- Nomor versi di `package.json` harus dinaikkan sesuai dengan perubahan yang telah dilakukan.
- Perubahan versi hanya dilakukan ketika secara eksplisit diminta dengan perintah "update versi".
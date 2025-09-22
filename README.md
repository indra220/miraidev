[![MiraiDev](/codeguide-backdrop.svg)](https://miraidev.id)

# MiraiDev Website

Sebuah aplikasi web modern untuk agensi pengembangan website MiraiDev, dibangun dengan Next.js 15, menggunakan Supabase untuk database, dan mendukung mode gelap.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Database:** [Supabase](https://supabase.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/)
- **Theme System:** [next-themes](https://github.com/pacocoursey/next-themes)

## Prerequisites

Sebelum memulai, pastikan Anda memiliki:
- Node.js 18+ terinstal
- Akun [Supabase](https://supabase.com/) untuk database
- Optional: API key [OpenAI](https://platform.openai.com/) atau [Anthropic](https://console.anthropic.com/) untuk fitur AI

## Memulai

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd miraidev
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Setup Environment Variables**
   - Salin file `.env.example` ke `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Isi variabel lingkungan di `.env.local` (lihat bagian Konfigurasi di bawah)

4. **Jalankan server development**
   ```bash
   npm run dev
   # atau
   yarn dev
   # atau
   pnpm dev
   ```

5. **Buka [http://localhost:3000](http://localhost:3000) dengan browser Anda untuk melihat hasilnya.**

## Konfigurasi

### Setup Supabase
1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Buat project baru
3. Pergi ke Project Settings > API
4. Salin `Project URL` sebagai `NEXT_PUBLIC_SUPABASE_URL`
5. Salin `anon` public key sebagai `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Salin `service_role` key sebagai `SUPABASE_SERVICE_ROLE_KEY`

### Setup AI Integration (Opsional)
1. Buka [OpenAI Platform](https://platform.openai.com/) atau [Anthropic Console](https://console.anthropic.com/)
2. Buat API key
3. Tambahkan ke variabel lingkungan Anda

## Variabel Lingkungan

Buat file `.env.local` di direktori root dengan variabel berikut:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Integration (Opsional)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Fitur

- 🗄️ Integrasi Database Supabase
- 🤖 Interface Chat AI dengan dukungan OpenAI/Anthropic
- 🎨 40+ komponen shadcn/ui (gaya New York)
- 🌙 Mode gelap dengan deteksi preferensi sistem
- 🚀 App Router dengan Server Components
- 📱 Desain responsif dengan TailwindCSS v4
- 🎨 Font kustom (Geist Sans, Geist Mono, Parkinsans)

## Struktur Project

```
miraidev/
├── src/
│   ├── app/                    # Halaman Next.js app router
│   │   ├── beranda/           # Halaman beranda
│   │   ├── layanan/           # Halaman layanan
│   │   ├── portofolio/        # Halaman portofolio
│   │   ├── harga/             # Halaman harga
│   │   ├── tentang/           # Halaman tentang kami
│   │   ├── kontak/            # Halaman kontak
│   │   ├── api/chat/          # Endpoint API chat AI
│   │   ├── globals.css        # Style global dengan mode gelap
│   │   ├── layout.tsx         # Layout root dengan providers
│   │   └── page.tsx           # Redirect ke beranda
│   ├── components/            # Komponen React
│   │   ├── ui/                # Komponen shadcn/ui (40+)
│   │   ├── chat.tsx           # Interface chat AI
│   │   ├── navbar.tsx         # Navigasi website
│   │   ├── theme-provider.tsx # Context tema
│   │   └── theme-toggle.tsx   # Toggle mode gelap
│   ├── lib/                   # Fungsi utilitas
│   │   ├── supabase.ts        # Client Supabase
│   │   ├── user.ts            # Utilitas pengguna
│   │   ├── utils.ts           # Utilitas umum
│   │   └── env-check.ts       # Validasi environment
│   └── middleware.ts          # Middleware route protection
├── supabase/
│   └── migrations/            # Migrasi database
├── CLAUDE.md                  # Dokumentasi agen coding AI
├── SUPABASE_CLERK_SETUP.md   # Panduan setup integrasi (deprecated)
└── components.json            # Konfigurasi shadcn/ui
```

## Integrasi Database

Starter ini menggunakan integrasi Supabase modern:

- **Client-side client** untuk akses data publik
- **Server-side client** dengan service role key untuk operasi admin
- **Contoh migrasi** dengan berbagai pola

## AI Coding Agent Integration

Starter ini dioptimalkan untuk agen coding AI:

- **`CLAUDE.md`** - Konteks project dan pola yang komprehensif
- **Panduan setup** dengan langkah integrasi yang detail
- **Contoh migrasi** dengan template kebijakan RLS
- **Struktur file** dan konvensi penamaan yang jelas
- **Integrasi TypeScript** dengan definisi tipe yang tepat

## Dokumentasi Setup

Untuk mengimplementasi dokumentasi yang dihasilkan dari CodeGuide:

1. Buat folder `documentation` di direktori root:
   ```bash
   mkdir documentation
   ```

2. Tempatkan semua file markdown yang dihasilkan dari CodeGuide di direktori ini:
   ```bash
   # Contoh struktur
   documentation/
   ├── project_requirements_document.md             
   ├── app_flow_document.md
   ├── frontend_guideline_document.md
   └── backend_structure_document.md
   ```

3. File dokumentasi ini akan secara otomatis dilacak oleh git dan dapat digunakan sebagai referensi untuk fitur dan detail implementasi project Anda.

## Kontribusi

Kontribusi sangat welcome! Silakan kirim Pull Request.
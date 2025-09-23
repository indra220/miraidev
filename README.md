[![MiraiDev](/codeguide-backdrop.svg)](https://miraidev.id)

# MiraiDev Website

Sebuah aplikasi web modern untuk agensi pengembangan website MiraiDev, dibangun dengan Next.js 15, menggunakan Supabase untuk database, dan mendukung mode gelap.

## Teknologi yang Digunakan

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Bahasa:** TypeScript
- **Database:** [Supabase](https://supabase.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Komponen UI:** [shadcn/ui](https://ui.shadcn.com/)
- **Animasi:** [Framer Motion](https://www.framer.com/motion/)
- **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/)
- **Sistem Tema:** [next-themes](https://github.com/pacocoursey/next-themes)

## Prasyarat

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
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI API (untuk Vercel AI SDK)
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API (opsional, untuk model Claude)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Fitur

- 🗄️ Integrasi Database Supabase
- 🤖 Interface Chat AI dengan dukungan OpenAI/Anthropic
- 🎨 40+ komponen shadcn/ui (gaya New York)
- 🌙 Mode gelap dengan deteksi preferensi sistem
- 🚀 App Router dengan Server Components
- 📱 Desain responsif dengan TailwindCSS v4
- 🎨 Font kustom (Geist Sans, Geist Mono)
- 🎭 Animasi halus dengan Framer Motion

## Struktur Proyek

```
miraidev/
├── src/
│   ├── app/                    # Halaman Next.js app router
│   │   ├── api/chat/          # Endpoint API chat AI
│   │   ├── beranda/           # Halaman beranda
│   │   ├── layanan/           # Halaman layanan
│   │   ├── portofolio/        # Halaman portofolio
│   │   ├── harga/             # Halaman harga
│   │   ├── tentang/          # Halaman tentang kami
│   │   ├── kontak/           # Halaman kontak
│   │   ├── globals.css       # Style global dengan mode gelap
│   │   ├── layout.tsx        # Layout root dengan providers
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
└── components.json            # Konfigurasi shadcn/ui
```

## Integrasi Database

Starter ini menggunakan integrasi Supabase modern:

- **Client-side client** untuk akses data publik
- **Server-side client** dengan service role key untuk operasi admin
- **Contoh migrasi** dengan berbagai pola

## AI Coding Agent Integration

Starter ini dioptimalkan untuk agen coding AI:

- **Setup guides** dengan langkah integrasi yang detail
- **Contoh migrasi** dengan template kebijakan RLS
- **Struktur file** dan konvensi penamaan yang jelas
- **Integrasi TypeScript** dengan definisi tipe yang tepat

## Testing dan Build

Untuk memastikan aplikasi berjalan dengan baik:

1. **Testing Development:**
   ```bash
   npm run dev
   ```

2. **Build Production:**
   ```bash
   npm run build
   ```

3. **Start Server Production:**
   ```bash
   npm start
   ```

## Kontribusi

Kontribusi sangat welcome! Silakan kirim Pull Request.

## Lisensi

MIT License - lihat file [LICENSE](LICENSE) untuk details.
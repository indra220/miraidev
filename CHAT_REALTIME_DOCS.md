# Dokumentasi Implementasi Fitur Chat Real-time

## Ikhtisar
Fitur chat real-time ini memungkinkan komunikasi langsung antara pengguna/klien dan admin dalam aplikasi miraidev, mirip dengan pengalaman WhatsApp. Implementasi ini menggunakan teknologi Supabase Realtime yang berjalan di atas WebSocket untuk pengiriman pesan instan.

## Teknologi yang Digunakan
- **Supabase Realtime**: Untuk koneksi WebSocket dan sinkronisasi data real-time
- **Next.js 15.5.4**: Framework utama aplikasi
- **React 19.1.0**: Library untuk antarmuka pengguna
- **Supabase Auth**: Untuk otentikasi pengguna
- **PostgreSQL**: Database yang digunakan dengan Row Level Security (RLS)

## Struktur File

### Frontend
- `src/components/realtime-chat.tsx`: Komponen chat untuk pengguna/klien
- `src/components/admin-realtime-chat.tsx`: Komponen chat untuk admin
- `src/hooks/use-chat-auth.ts`: Hook khusus untuk otentikasi chat
- `src/app/(main)/chat/page.tsx`: Halaman chat untuk pengguna
- `src/app/admin/chat/page.tsx`: Halaman chat untuk admin

### Backend
- `src/app/api/realtime-chat/route.ts`: Endpoint API untuk pengiriman pesan
- `skema.sql`: Pembaruan pada tabel `chat_messages` dan kebijakan RLS

## Desain Database

### Tabel `chat_messages`
Kolom yang diperbarui:
- `id`: UUID unik untuk setiap pesan
- `project_id`: UUID (opsional) untuk menghubungkan pesan ke proyek tertentu
- `sender_id`: UUID pengirim pesan
- `sender_type`: ENUM ('user' atau 'admin') untuk mengidentifikasi jenis pengirim
- `message`: Teks pesan
- `read_status`: Boolean untuk menandai apakah pesan telah dibaca
- `created_at`: Timestamp pembuatan pesan

### Kebijakan RLS (Row Level Security)
- Pengguna hanya bisa melihat pesan mereka sendiri dan pesan dari admin
- Admin bisa melihat semua pesan
- Hanya pengirim atau admin yang bisa mengedit/menghapus pesan yang belum dibaca

## Fungsionalitas Utama

### 1. Pengiriman Pesan Real-time
- Menggunakan fitur Realtime dari Supabase untuk menyinkronkan pesan
- Tidak perlu refresh halaman untuk melihat pesan baru
- Indikator koneksi menunjukkan status koneksi WebSocket

### 2. Otentikasi dan Otorisasi
- Menggunakan hook `useChatAuth` untuk memverifikasi status pengguna
- Hanya pengguna terotentikasi yang bisa mengakses chat
- Pembatasan akses berdasarkan peran (pengguna vs admin)

### 3. Antarmuka Pengguna
- Desain responsif menggunakan Tailwind CSS
- Tampilan berbeda untuk pesan pengirim dan penerima
- Indikator waktu pada setiap pesan
- Gulir otomatis ke pesan terbaru

## Cara Kerja

1. Pengguna mengakses halaman `/chat` atau admin mengakses `/admin/chat`
2. Komponen chat menginisialisasi koneksi ke database Supabase
3. Realtime subscription diaktifkan untuk mendengarkan perubahan di tabel `chat_messages`
4. Saat pesan baru dikirim, ia disimpan ke database melalui endpoint API
5. Supabase Realtime memberi tahu semua klien yang berlangganan tentang pesan baru
6. Pesan baru langsung muncul di antarmuka pengguna tanpa refresh

## Kekuatan dan Keamanan
- Enkripsi end-to-end (jika dikonfigurasi di Supabase)
- Otentikasi berbasis token
- Pembatasan akses menggunakan RLS
- Validasi input di sisi server

## Keterbatasan
- Koneksi WebSocket bergantung pada dukungan browser
- Kebijakan RLS Supabase berjalan di sisi server, yang mungkin menambah latensi kecil
- Harus memastikan konfigurasi Supabase Realtime aktif di lingkungan produksi

## Pengujian
Lihat file `TESTING.md` untuk panduan pengujian manual fitur ini.

## Troubleshooting
- Jika pesan tidak muncul secara real-time, periksa koneksi internet dan status layanan Supabase
- Jika otentikasi gagal, pastikan konfigurasi Supabase Auth benar
- Untuk masalah RLS, pastikan kebijakan di database sudah diterapkan dengan benar
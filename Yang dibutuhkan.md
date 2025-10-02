# Yang Dibutuhkan untuk Mengganti Data Dummy pada Settings dan SEO Pages

## 1. Persyaratan Umum

Sebelum mengganti data dummy pada halaman **Settings** dan **SEO**, diperlukan beberapa komponen dasar berikut:

### 1.1. Tabel Database Settings
```sql
-- Tabel settings untuk menyimpan konfigurasi situs
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  site_name VARCHAR(255),
  site_description TEXT,
  site_url VARCHAR(255),
  admin_email VARCHAR(255),
  contact_email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  maintenance_mode BOOLEAN DEFAULT false,
  analytics_enabled BOOLEAN DEFAULT true,
  theme VARCHAR(20) DEFAULT 'dark',
  max_upload_size INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 1.2. Tabel Database SEO
```sql
-- Tabel seo_settings untuk menyimpan pengaturan SEO per halaman
CREATE TABLE seo_settings (
  id SERIAL PRIMARY KEY,
  page_url VARCHAR(255) UNIQUE, -- Misal: "/", "/layanan", "/portofolio"
  title VARCHAR(255),
  description TEXT,
  keywords TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  og_image_url TEXT,
  twitter_title VARCHAR(255),
  twitter_description TEXT,
  twitter_image_url TEXT,
  canonical_url VARCHAR(255),
  robots_index BOOLEAN DEFAULT true,
  robots_follow BOOLEAN DEFAULT true,
  sitemap_priority DECIMAL(2,1) DEFAULT 0.5,
  last_modified TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 2. Komponen API yang Dibutuhkan

### 2.1. API Endpoint untuk Settings
```javascript
// Route: /api/admin/settings
// Methods: GET, PUT
// Fungsi: Mengambil dan memperbarui pengaturan situs
```

### 2.2. API Endpoint untuk SEO Settings
```javascript
// Route: /api/admin/seo
// Methods: GET, POST, PUT, DELETE
// Fungsi: CRUD untuk pengaturan SEO per halaman
```

## 3. Service Layer yang Harus Ditambahkan

### 3.1. Service Layer untuk Settings
```typescript
// File: src/lib/admin-service.ts
// Tambahkan:
const settingsAdminService = {
  getAll: async (): Promise<Settings[]> => {
    // Mengambil semua pengaturan
  },
  
  update: async (settings: Settings): Promise<Settings> => {
    // Memperbarui pengaturan
  },
  
  getByKey: async (key: string): Promise<Settings | null> => {
    // Mengambil pengaturan berdasarkan kunci
  }
};
```

### 3.2. Service Layer untuk SEO
```typescript
// File: src/lib/admin-service.ts
// Tambahkan:
const seoAdminService = {
  getAll: async (): Promise<SeoSettings[]> => {
    // Mengambil semua pengaturan SEO
  },
  
  getByPage: async (pageUrl: string): Promise<SeoSettings | null> => {
    // Mengambil pengaturan SEO untuk halaman tertentu
  },
  
  update: async (seoSettings: SeoSettings): Promise<SeoSettings> => {
    // Memperbarui pengaturan SEO
  },
  
  create: async (seoSettings: Omit<SeoSettings, 'id'>): Promise<SeoSettings> => {
    // Membuat pengaturan SEO baru
  },
  
  delete: async (id: number): Promise<void> => {
    // Menghapus pengaturan SEO
  }
};
```

## 4. Komponen UI yang Diperlukan

### 4.1. Untuk Settings Page
- Form validation untuk setiap field pengaturan
- State management untuk menyimpan perubahan sementara
- Loading states saat menyimpan data
- Error handling untuk kasus gagal menyimpan

### 4.2. Untuk SEO Page
- Dynamic form untuk setiap jenis pengaturan SEO
- Preview SEO seperti di hasil pencarian Google
- Validasi URL kanonis dan gambar
- Manajemen keywords dengan tag input
- Priority slider untuk sitemap priority

## 5. Integrasi Backend yang Diperlukan

### 5.1. Authentication & Authorization
- Verifikasi pengguna adalah admin
- Role-based access control

### 5.2. Validasi Data
- Schema validation untuk setiap field
- Sanitasi input untuk mencegah XSS
- Validasi format email, URL, dll.

### 5.3. Caching Strategy
- Cache pengaturan untuk performa
- Invalidasi cache saat ada perubahan

### 5.4. Logging & Audit Trail
- Log setiap perubahan pengaturan
- Tracking siapa yang melakukan perubahan dan kapan

## 6. Implementasi Langkah demi Langkah

### Langkah 1: Buat Tabel Database
```bash
# Jalankan migrasi database untuk membuat tabel settings dan seo_settings
```

### Langkah 2: Buat API Routes
```bash
# Buat file API routes:
# - src/app/api/admin/settings/route.ts
# - src/app/api/admin/seo/route.ts
```

### Langkah 3: Tambahkan Service Functions
```bash
# Update src/lib/admin-service.ts dengan fungsi baru
```

### Langkah 4: Modifikasi Halaman Admin
```bash
# Ganti data dummy dengan pemanggilan API nyata
# Tambahkan state management dan error handling
```

### Langkah 5: Testing
```bash
# Uji semua fungsi:
# - Mengambil data
# - Memperbarui data
# - Menangani error
# - Validasi input
```

## 7. Hasil yang Diharapkan

Setelah semua komponen ini diimplementasikan, maka:

1. **Settings Page** akan dapat:
   - Mengambil pengaturan situs secara real-time dari database
   - Memperbarui pengaturan dengan validasi yang tepat
   - Menyimpan riwayat perubahan pengaturan

2. **SEO Page** akan dapat:
   - Mengelola pengaturan SEO untuk setiap halaman secara individual
   - Memberikan preview SEO yang akurat
   - Mengatur prioritas sitemap dan robot.txt settings
   - Memvalidasi semua input SEO sesuai standar terbaik

Dengan implementasi ini, kedua halaman akan sepenuhnya berfungsi dengan data real-time tanpa lagi menggunakan data dummy.
# Changelog

All notable changes to the MiraiDev Admin Panel will be documented in this file.

## [0.5.47] - 2025-10-21

### Added
- Menambahkan fitur Autentikasi Dua Faktor (2FA/MFA) di halaman profil dashboard klien (`src/app/dashboard/profile/page.tsx`).
- Menambahkan dialog untuk proses *enrollment* 2FA (scan QR code dan verifikasi).
- Menambahkan tombol "Kirim Ulang Verifikasi" di halaman edit profil jika email klien belum terverifikasi (`src/app/dashboard/profile/edit/page.tsx`).

### Changed
- Menggabungkan form edit informasi profil dan ganti kata sandi menjadi satu form di halaman edit profil (`src/app/dashboard/profile/edit/page.tsx`).
- Menambahkan validasi "Kata Sandi Saat Ini" yang wajib diisi untuk menyimpan perubahan apa pun di halaman edit profil.
- Membuka *lock* pada field email di halaman edit profil; sekarang email dapat diubah namun akan memicu proses verifikasi email baru oleh Supabase.
- Memperbaiki logika `useEffect` di halaman edit profil untuk mencegah *reload* konten saat berganti tab browser (`useRef` flag).
- Memperbaiki berbagai masalah layout dan konsistensi UI (jarak label) di halaman edit profil.

### Removed
- Menghapus field "Tanggal Bergabung" dan "Jumlah Proyek" dari tampilan form *edit* profil klien (`src/app/dashboard/profile/edit/page.tsx`).
- Menghapus tombol "Kirim Verifikasi" dari halaman edit profil klien (`src/app/dashboard/profile/edit/page.tsx`) karena verifikasi email baru ditangani otomatis oleh Supabase setelah penyimpanan.

### Fixed
- Memperbaiki tautan "Profil" pada dropdown menu pengguna di dashboard klien (`src/components/dashboard/UserNav.tsx`) agar mengarah ke `/dashboard/profile`.
- Memperbaiki tautan "Profil" pada dropdown menu pengguna di navbar utama (`src/components/navbar.tsx`) agar mengarah ke `/dashboard/profile`.

## [0.5.46] - 2025-10-21

### Removed
- Menghapus halaman konfigurasi (sebelumnya pengaturan) beserta komponen terkait
- Menghapus entri Konfigurasi dari sidebar
- Menghapus item "Pengaturan" dari dropdown user di dashboard klien
- Menghapus item "Pengaturan" dari dropdown user di dashboard admin
- Menghapus link ke halaman setting dari dropdown user di navbar utama

## [0.5.45] - 2025-10-20

### Changed
- Memperbarui tampilan login user dengan desain yang lebih modern dan responsif
- Memperbarui tampilan login admin dengan desain yang lebih konsisten dengan standar admin panel
- Memperbarui tampilan registrasi dengan peningkatan UX dan validasi form yang lebih baik
- Menyesuaikan warna dan elemen UI pada halaman otentikasi agar konsisten dengan desain keseluruhan aplikasi

## [0.5.44] - 2025-10-19

### Added
- Menambahkan halaman profile pengguna di dashboard dengan tampilan detail informasi lengkap
- Membuat halaman edit profile terpisah untuk mengedit informasi pengguna
- Menambahkan navigasi ke halaman profile di sidebar dashboard

### Changed
- Memperbarui tampilan halaman profile agar konsisten dengan gaya dashboard lainnya
- Mengganti input fields dengan label dan teks biasa di halaman profile utama karena fungsi edit sudah tersedia di halaman terpisah
- Menyederhanakan struktur tampilan halaman profile dan edit agar lebih bersih dan informatif
- Memperbarui tata letak avatar, nama, dan email di halaman profile (avatar di tengah, nama di bawah avatar, email di bawah nama)
- Menyesuaikan warna form dan button di halaman profile dan edit agar konsisten dengan halaman lain

### Fixed
- Memperbaiki masalah sidebar ganda dengan menghapus layout profile yang tidak diperlukan
- Menghapus duplikasi elemen dan memperbaiki tata letak informasi pengguna di halaman profile
- Memperbaiki pengambilan data profil pengguna sesuai dengan skema database yang benar

## [0.5.43] - 2025-10-17

### Fixed
- Memperbaiki ketidaksesuaian antara penghitungan pesan unread di manajemen pesan admin dan dashboard
- Memperbaiki logika penghitungan pesan baru di dashboard untuk konsistensi dengan manajemen pesan admin
- Memperbaiki error handling pada fungsi useRealtimeDashboard untuk sepenuhnya mencegah error kosong muncul di console
- Mengganti pendekatan error handling untuk tidak mencatat error kosong sama sekali
- Memperbaiki pendekatan pengecekan error untuk menghindari error ESLint
- Memperbaiki struktur data yang dikembalikan oleh Supabase untuk menghindari type error
- Memperbaiki error pada fungsi useRealtimeDashboard terkait dengan pengambilan data admin
- Memperbaiki logika penghitungan pesan unread di card 'Pesan Baru' agar hanya menghitung pesan dari pengguna ke admin
- Menyempurnakan akurasi jumlah pesan baru di dashboard admin

### Added
- Menambahkan card 'Pesan Baru' di dashboard admin untuk menampilkan jumlah total pesan yang belum dibaca
- Menambahkan fungsi untuk menandai pesan sebagai sudah dibaca ketika admin membuka chat pengguna
- Angka unread pada daftar pengguna di panel admin sekarang akan langsung hilang ketika admin mengklik bubble chat pengguna

### Changed
- Memperbarui dokumentasi sistem chat untuk mencakup catatan penting tentang verifikasi peran pengguna

## [0.5.33] - 2025-10-17

### Fixed
- Memperbaiki masalah di mana admin ditampilkan sebagai pengguna biasa dalam sistem pesan
- Memastikan identitas pengirim pesan (admin atau user) ditentukan berdasarkan peran di tabel profiles
- Memperbarui logika verifikasi peran pengirim pesan di komponen realtime-chat.tsx
- Memperbaiki asumsi awal dalam WebSocket subscription untuk chat umum agar tidak menganggap pesan dari non-user sebagai dari admin

### Changed
- Memperbarui dokumentasi sistem chat untuk mencakup catatan penting tentang verifikasi peran pengguna

## [0.5.32] - 2025-10-17

### Fixed
- Memperbaiki masalah di mana admin ditampilkan sebagai pengguna biasa dalam sistem pesan
- Memastikan identitas pengirim pesan (admin atau user) ditentukan berdasarkan peran di tabel profiles
- Memperbarui logika verifikasi peran pengirim pesan di komponen realtime-chat.tsx

### Changed
- Memperbarui dokumentasi sistem chat untuk mencakup catatan penting tentang verifikasi peran pengguna

## [0.5.31] - 2025-10-16

### Added
- Menambahkan estimasi waktu pengerjaan proyek dari kolom timeline_estimate ke halaman update proyek admin
- Menambahkan deskripsi estimasi waktu pengerjaan proyek dengan ikon jam di halaman update proyek admin

### Changed
- Mengubah tombol "Edit" menjadi "Update" di halaman manajemen proyek admin dan mengarahkannya ke halaman update proyek
- Mengubah struktur tampilan informasi klien di halaman detail proyek admin untuk menangani kasus di mana tidak ada klien terkait dengan proyek
- Memperbaiki query untuk mengambil data proyek dan klien secara terpisah karena tidak adanya relasi yang terdefinisi antara tabel projects dan clients

### Removed
- Menghapus komponen ProjectConversationChat dari halaman detail proyek admin
- Menghapus komponen ProjectConversationChat dari halaman update proyek admin
- Menghapus tombol "Chat Proyek" dari dropdown menu di halaman manajemen proyek admin

## [0.5.30] - 2025-10-15

### Added
- Menambahkan statistik Total Portofolio di dashboard admin
- Memperbarui perhitungan Total Proyek untuk mengambil dari tabel projects bukan portfolio
- Menyesuaikan tampilan dashboard admin untuk menampilkan 5 card statistik

## [0.5.29] - 2025-10-15

### Changed
- Removed user icon dropdown from admin header (UserNav component)

## [0.5.28] - 2025-10-15

### Added
- Rencana pengembangan lanjutan admin panel (rencana_pengembangan_lanjutan_admin.md)
- Dokumentasi untuk sistem peran dan hak akses
- Rencana untuk sistem notifikasi terpadu
- Rencana untuk sistem pelaporan dan audit
- Rencana untuk integrasi AI di admin panel
- Rencana untuk peningkatan keamanan sistem
- Standar desain baru untuk komponen admin (src/constants/admin-design-standards.ts)
- Pedoman penggunaan warna solid menggantikan elemen transparan

### Changed
- Updated tampilan admin panel dengan desain modern dan warna solid
- Modernized admin header dengan warna solid dan efek bayangan
- Modernized admin sidebar dengan gradient, warna solid, dan animasi
- Updated layout admin panel dengan gradient background
- Modernized dashboard admin dengan tampilan baru dan warna solid
- Updated komponen-komponen UI admin dengan standar desain baru
- Updated dokumentasi dan pedoman pengembangan
- Enhanced project documentation dengan standar desain baru
- Removed user icon dropdown from admin header (UserNav component)

## [0.5.26] - 2025-10-15

### Added
- Added rules for CHANGELOG.md management in QWEN.md
- Updated documentation and development guidelines
- Minor structural improvements to the project

### Changed
- Updated version numbers across project files
- Enhanced project documentation with version history

## [0.5.24] - 2025-10-14

### Added
- Enhanced dashboard with improved widget statistics
- Modern chart implementation using Recharts
- Smooth transition animations
- Real-time data updates
- Data filtering by time range
- Data export to CSV, PDF, and image formats
- Improved sidebar navigation with animations
- Breadcrumbs navigation
- Lazy loading components
- Page bookmarking system
- Quick navigation search
- More informative card designs
- Sticky table headers
- Column sorting
- Column filtering
- Configurable pagination
- Virtual scrolling for large datasets
- Data export features
- Intuitive form design
- Advanced form validation system
- Auto-save and draft features
- Rich text editor
- Modern chat UI
- Online/offline status indicators
- Chat real-time notifications
- File and image uploads
- Conversation search
- Emoji and reaction system
- Informative data visualization
- Interactive charts
- Flexible time filters
- Data export to various formats
- Parameter-based data filtering
- Complete SEO forms
- Real-time meta tags preview
- SEO quality indicators
- Basic SEO analysis
- Search result display preview
- Bulk update for multiple pages
- Intuitive pricing management UI
- Package comparison display
- Real-time pricing calculator
- Flexible package system
- Feature-based pricing calculator
- Location-based pricing adjustments
- Visual project timeline
- Gantt chart display
- Milestone and task management system
- Project chat system integration
- Status change notifications
- Project report export
- Real-time notification system
- Clear ticket status system
- In-ticket conversation display
- Assignment and collaboration tools
- Team ticket assignment
- Ticket classification and tagging

### Changed
- Refactored validated-input component to separate utility functions
- Updated virtual-data-table component to remove unused dependencies
- Fixed type errors in various components
- Improved build process to eliminate warnings and errors

### Fixed
- Resolved build errors related to type mismatches
- Fixed unused variable warnings
- Addressed React Hook dependency warnings
- Corrected component import-export issues
- Resolved virtual scrolling implementation problems

### Removed
- Unused imports and variables
- Redundant code in various components

## [0.5.0] - 2025-10-10

### Added
- Initial release of MiraiDev Admin Panel
- Basic dashboard with statistics
- User management system
- Project management system
- Chat system
- SEO management tools
- Pricing management system
- Support ticket system

[0.5.31]: https://github.com/mirai-dev/mirai-dev-website/compare/v0.5.30...v0.5.31
[0.5.30]: https://github.com/mirai-dev/mirai-dev-website/compare/v0.5.29...v0.5.30
[0.5.29]: https://github.com/mirai-dev/mirai-dev-website/compare/v0.5.28...v0.5.29
[0.5.28]: https://github.com/mirai-dev/mirai-dev-website/compare/v0.5.26...v0.5.28
[0.5.26]: https://github.com/mirai-dev/mirai-dev-website/compare/v0.5.24...v0.5.26
[0.5.24]: https://github.com/mirai-dev/mirai-dev-website/compare/v0.5.0...v0.5.24
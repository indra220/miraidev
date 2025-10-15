/**
 * Standar Desain Admin Panel - MiraiDev
 * 
 * File ini berisi pedoman dan standar desain untuk komponen-komponen
 * admin panel MiraiDev. Standar ini mencakup penggunaan warna, 
 * tipografi, spacing, dan komponen UI lainnya.
 */

// Palet Warna
export const AdminColors = {
  // Warna Latar Belakang
  background: {
    primary: 'bg-gradient-to-br from-slate-900 to-slate-800', // Latar utama
    secondary: 'bg-slate-800', // Latar komponen
    card: 'bg-slate-800', // Latar kartu
    sidebar: 'bg-slate-900', // Latar sidebar
    header: 'bg-slate-900', // Latar header
  },
  
  // Warna Teks
  text: {
    primary: 'text-white', // Teks utama
    secondary: 'text-slate-300', // Teks sekunder
    muted: 'text-slate-400', // Teks redup
    disabled: 'text-slate-500', // Teks dinonaktifkan
  },
  
  // Warna Border
  border: {
    primary: 'border-slate-700', // Border utama
    secondary: 'border-slate-600', // Border sekunder
    accent: 'border-slate-500', // Border aksen
  },
  
  // Warna Status
  status: {
    success: 'bg-green-600 text-white',
    info: 'bg-blue-600 text-white',
    warning: 'bg-yellow-600 text-white',
    danger: 'bg-red-600 text-white',
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-slate-700 text-white',
  },
  
  // Warna Aksen
  accent: {
    primary: 'from-blue-600 to-indigo-600', // Gradient utama
    secondary: 'from-slate-800 to-slate-700', // Gradient sekunder
    danger: 'from-red-600 to-red-700', // Gradient bahaya
  }
};

// Tipografi
export const AdminTypography = {
  headings: {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-semibold',
    h3: 'text-xl font-medium',
    h4: 'text-lg font-medium',
  },
  body: {
    large: 'text-base',
    regular: 'text-sm',
    small: 'text-xs',
    muted: 'text-slate-400',
  },
  weight: {
    light: 'font-light',
    regular: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }
};

// Spacing
export const AdminSpacing = {
  padding: {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  },
  margin: {
    xs: 'm-1',
    sm: 'm-2',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8',
  },
  horizontal: {
    sm: 'px-2 py-1',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
    xl: 'px-8 py-4',
  }
};

// Shadow
export const AdminShadows = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner',
};

// Border Radius
export const AdminBorders = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

// Komponen UI
export const AdminComponents = {
  card: {
    base: 'bg-slate-800 border border-slate-700 shadow-md rounded-xl',
    padding: 'p-6',
    header: 'bg-slate-750 border-b border-slate-700 p-4 rounded-t-xl',
    footer: 'bg-slate-750 border-t border-slate-700 p-4 rounded-b-xl',
  },
  button: {
    base: 'rounded-lg px-4 py-2 font-medium transition-all duration-200',
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-red-100 hover:from-red-700 hover:to-red-800',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-700',
    outline: 'border border-slate-600 text-slate-300 hover:bg-slate-700',
  },
  input: {
    base: 'bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
    disabled: 'bg-slate-700 text-slate-500 cursor-not-allowed',
  },
  table: {
    base: 'bg-slate-800 border border-slate-700 rounded-lg overflow-hidden',
    header: 'bg-slate-750 border-b border-slate-700 px-4 py-3 text-left text-slate-300 font-medium',
    row: 'border-b border-slate-700 hover:bg-slate-750 transition-colors',
    cell: 'px-4 py-3',
  }
};

// Layout
export const AdminLayout = {
  sidebar: {
    width: 'w-64', // 256px
    collapsed: 'w-20', // 80px
    base: 'bg-slate-900 text-white border-r border-slate-700 h-full shadow-2xl',
  },
  header: {
    height: 'h-16',
    base: 'bg-slate-900 border-b border-slate-700 shadow-lg',
  },
  main: {
    padding: 'p-4 sm:p-6 md:pr-8 md:pt-8 md:pb-8',
    base: 'flex-1 overflow-y-auto hide-scrollbar',
  }
};

/**
 * Panduan Penggunaan:
 * 
 * 1. Gunakan kelas-kelas dari standar ini secara konsisten di seluruh
 *    komponen admin panel.
 * 
 * 2. Jangan menggunakan warna transparan (opacity) kecuali untuk efek
 *    visual tertentu yang disetujui.
 * 
 * 3. Gunakan gradient dengan hemat dan hanya untuk elemen penting
 *    seperti header atau tombol utama.
 * 
 * 4. Pastikan kontras warna memenuhi standar aksesibilitas (WCAG).
 * 
 * 5. Gunakan shadow untuk memberikan kedalaman dan hierarki visual.
 * 
 * 6. Pertahankan konsistensi dalam penggunaan spacing dan border radius.
 */
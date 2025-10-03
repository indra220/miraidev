import { 
  LayoutDashboard as Dashboard,
  FolderOpen,
  Settings,
  Users,
  BarChart3,
  Briefcase,
  Mail,
  Globe
} from "lucide-react";

// Tipe untuk item menu
export interface AdminMenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[]; // Role yang diizinkan mengakses item ini
  requiresPermission?: string[]; // Izin tambahan yang mungkin diperlukan
}

// Konfigurasi menu admin berdasarkan role
export const adminMenuConfig: AdminMenuItem[] = [
  {
    id: "dashboard",
    label: "Dasbor",
    href: "/admin/dashboard",
    icon: Dashboard,
    roles: ["admin", "pegawai", "klien"],
  },
  {
    id: "analytics",
    label: "Analitik",
    href: "/admin/analytics",
    icon: BarChart3,
    roles: ["admin"],
  },
  {
    id: "portfolio",
    label: "Portofolio",
    href: "/admin/portfolio",
    icon: Briefcase,
    roles: ["admin", "pegawai"],
  },
  {
    id: "services",
    label: "Layanan",
    href: "/admin/services",
    icon: FolderOpen,
    roles: ["admin", "pegawai"],
  },
  {
    id: "contact",
    label: "Kontak",
    href: "/admin/contact",
    icon: Mail,
    roles: ["admin", "pegawai"],
  },
  {
    id: "clients",
    label: "Klien",
    href: "/admin/clients",
    icon: Users,
    roles: ["admin"],
  },
  {
    id: "seo",
    label: "SEO",
    href: "/admin/seo",
    icon: Globe,
    roles: ["admin", "pegawai"],
  },
  {
    id: "settings",
    label: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
    roles: ["admin"],
  },

];

// Fungsi untuk mendapatkan menu berdasarkan role pengguna
export const getUserMenu = (userRole: string): AdminMenuItem[] => {
  return adminMenuConfig.filter(item => 
    item.roles.includes(userRole) || item.roles.includes("admin")
  );
};
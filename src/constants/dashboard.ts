import { 
  LayoutDashboardIcon,
  FileTextIcon,
  MessageSquareIcon,
  BarChartIcon,
  PackageIcon,
  UserIcon
} from "lucide-react";
import { NavItem } from "@/types/dashboard";

export const dashboardNavItems: NavItem[] = [
  {
    title: "Ringkasan",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Proyek",
    href: "/dashboard/projects",
    icon: PackageIcon,
  },
  {
    title: "Pengajuan Proyek",
    href: "/dashboard/services",
    icon: FileTextIcon,
  },
  {
    title: "Pesan",
    href: "/dashboard/messages",
    icon: MessageSquareIcon,
  },
  {
    title: "Dukungan & Bantuan",
    href: "/dashboard/support",
    icon: MessageSquareIcon,
  },
  {
    title: "Laporan",
    href: "/dashboard/reports",
    icon: BarChartIcon,
  },
  {
    title: "Profil",
    href: "/dashboard/profile",
    icon: UserIcon,
  },

];
import { 
  LayoutDashboardIcon,
  FileTextIcon,
  MessageSquareIcon,
  BarChartIcon,
  SettingsIcon,
  PackageIcon
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
    title: "Tanya Jawab",
    href: "/dashboard/support",
    icon: MessageSquareIcon,
  },
  {
    title: "Laporan",
    href: "/dashboard/reports",
    icon: BarChartIcon,
  },
  {
    title: "Akun",
    href: "/dashboard/account",
    icon: SettingsIcon,
  },
];
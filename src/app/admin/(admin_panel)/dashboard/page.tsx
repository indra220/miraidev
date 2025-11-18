"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { 
  FolderOpen, 
  Users, 
  Eye, 
  BarChart3,
  MessageSquare,
  Calendar
} from "lucide-react";
import { useRealtimeDashboard } from "@/hooks/useRealtimeDashboard";
import { PortfolioItem } from "@/lib/types";
import ActivityChart from "@/components/activity-chart";
import { AnimatedCard, AnimatedStatsCard, AnimatedList } from "@/components/animated-components";
import { ExportDashboardData } from "@/components/export-dashboard-data";
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  useEffect(() => {
    document.title = "Dashboard Admin";
  }, []);
  const { stats: realtimeStats, recentProjects, loading, error } = useRealtimeDashboard();
  
  // State untuk filter waktu
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90' | '365'>('7');

  // Convert stats to the format expected by the UI
  const stats = [
    {
      title: "Total Proyek",
      value: realtimeStats.totalProjects.toString(),
      icon: FolderOpen,
      change: "+5.2% dari bulan lalu",
      color: "bg-blue-600"
    },
    {
      title: "Total Template",
      value: realtimeStats.totalPortfolios.toString(),
      icon: FolderOpen,
      change: "+3.1% dari bulan lalu",
      color: "bg-indigo-600"
    },
    {
      title: "Klien Aktif",
      value: realtimeStats.activeClients.toString(),
      icon: Users,
      change: "+2.1% dari bulan lalu",
      color: "bg-green-600"
    },
    {
      title: "Total Views",
      value: realtimeStats.totalViews.toLocaleString(),
      icon: Eye,
      change: "+12.3% dari bulan lalu",
      color: "bg-purple-600"
    },
    {
      title: "Pesan Baru",
      value: realtimeStats.unreadMessages.toString(),
      icon: MessageSquare,
      change: realtimeStats.unreadMessages > 0 ? `+${realtimeStats.unreadMessages} pesan belum dibaca` : "Tidak ada pesan baru",
      color: "bg-yellow-600"
    }
  ];

  // PERBAIKAN: Menghapus 'client' dari data yang akan ditampilkan
  const formattedRecentProjects: Record<string, unknown>[] = recentProjects.map((item: PortfolioItem) => ({
    id: item.id,
    title: item.title,
    status: item.category || "Status Tidak Diketahui",
    date: new Date(item.created_at).toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }),
    views: (item.views || 0).toLocaleString()
  }));

  interface ActivityData {
    name: string;
    visitors: number;
  }

  // Data untuk chart aktivitas
  const activityData: ActivityData[] = [
    { name: 'Sen', visitors: 65 },
    { name: 'Sel', visitors: 80 },
    { name: 'Rab', visitors: 60 },
    { name: 'Kam', visitors: 75 },
    { name: 'Jum', visitors: 90 },
    { name: 'Sab', visitors: 70 },
    { name: 'Min', visitors: 85 }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 rounded-xl shadow-lg border border-slate-600">
          <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
          <p className="text-slate-300 mt-2">Memuat data dashboard real-time...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-6 bg-slate-800 border border-slate-700 shadow-md">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-slate-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-full"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-700 to-red-900 p-6 rounded-xl shadow-lg border border-red-600">
          <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
          <p className="text-red-200 mt-2">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>

      <div className="space-y-6 dashboard-content">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 rounded-xl flex justify-between items-center shadow-lg border border-slate-600">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
            <p className="text-slate-300 mt-2">Selamat datang di panel admin MiraiDev (Real-time)</p>
          </div>
          <div>
            <ExportDashboardData 
              data={formattedRecentProjects} 
              fileName="dashboard-proyek-terbaru" 
              title="Laporan Proyek Terbaru" 
              description="Daftar proyek terbaru dari dashboard admin" 
              columns={[
                { key: 'title', header: 'Judul Proyek' },
                { key: 'status', header: 'Status' },
                { key: 'date', header: 'Tanggal' },
                { key: 'views', header: 'Dilihat' }
              ]} 
            />
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <AnimatedStatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={<Icon className="h-6 w-6 text-white" />}
              color={stat.color}
              delay={index * 0.1}
            />
          );
        })}
      </div>

      {/* Recent Projects and Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedCard className="p-6 bg-slate-800 border border-slate-700 shadow-md" delay={0.2}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Template</h2>
            <button 
              onClick={() => window.location.href = "/admin/template"} 
              className="text-sm text-slate-400 hover:text-slate-300 hover:underline"
            >
              Lihat Semua
            </button>
          </div>
          <AnimatedList className="space-y-4">
            {formattedRecentProjects.length > 0 ? (
              formattedRecentProjects.map((project, index) => (
                <motion.div 
                  key={String(project.id)} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-slate-750 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-white">{String(project.title)}</h3>
                     {/* PERBAIKAN: Baris yang menampilkan nama klien dihapus */}
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      String(project.status) === "Selesai" || String(project.status) === "aktif" || String(project.status) === "website" || String(project.status) === "development" || String(project.status) === "on-going"
                        ? "bg-green-600 text-white" 
                        : String(project.status) === "Dalam Pengerjaan" || String(project.status) === "pengerjaan"
                          ? "bg-blue-600 text-white" 
                          : "bg-yellow-600 text-white"
                    }`}>
                      {String(project.status)}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">{String(project.date)}</p>
                    <p className="text-xs text-slate-400 mt-1">Dilihat: {String(project.views)}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                Tidak ada proyek yang ditemukan
              </div>
            )}
          </AnimatedList>
        </AnimatedCard>

        {/* Activity Chart */}
        <AnimatedCard className="p-6 bg-slate-800 border border-slate-700 shadow-md" delay={0.3}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Aktivitas Website</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as '7' | '30' | '90' | '365')}
                  className="bg-slate-700 text-white rounded-lg pl-8 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 appearance-none"
                >
                  <option value="7">7 hari</option>
                  <option value="30">30 hari</option>
                  <option value="90">90 hari</option>
                  <option value="365">1 tahun</option>
                </select>
                <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
          <div className="h-64">
            <ActivityChart data={activityData} />
          </div>
        </AnimatedCard>
      </div>

      {/* Quick Actions */}
      <AnimatedCard className="p-6 bg-slate-800 border border-slate-700 shadow-md" delay={0.4}>
        <h2 className="text-lg font-bold text-white mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = "/admin/projects"}
            className="flex flex-col items-center justify-center p-6 bg-slate-750 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors shadow-sm"
          >
            <FolderOpen className="h-8 w-8 text-blue-400 mb-2" />
            <span className="font-medium text-white">Tambah Proyek</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = "/admin/clients"}
            className="flex flex-col items-center justify-center p-6 bg-slate-750 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Users className="h-8 w-8 text-green-400 mb-2" />
            <span className="font-medium text-white">Tambah Klien</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = "/admin/analytics"}
            className="flex flex-col items-center justify-center p-6 bg-slate-750 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors shadow-sm"
          >
            <BarChart3 className="h-8 w-8 text-purple-400 mb-2" />
            <span className="font-medium text-white">Lihat Analitik</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = "/admin/pesan"}
            className="flex flex-col items-center justify-center p-6 bg-slate-750 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors shadow-sm"
          >
            <MessageSquare className="h-8 w-8 text-yellow-400 mb-2" />
            <span className="font-medium text-white">Pesan</span>
          </motion.button>
        </div>
      </AnimatedCard>
    </div>
  </div>
);
}
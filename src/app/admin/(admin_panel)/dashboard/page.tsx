"use client";

import { Card } from "@/components/ui/card";
import { 
  FolderOpen, 
  Users, 
  Eye, 
  BarChart3,
  MessageSquare
} from "lucide-react";
import { useRealtimeDashboard } from "@/hooks/useRealtimeDashboard";
import { PortfolioItem } from "@/lib/types";

export default function AdminDashboard() {
  const { stats: realtimeStats, recentProjects, loading, error } = useRealtimeDashboard();

  // Convert stats to the format expected by the UI
  const stats = [
    {
      title: "Total Proyek",
      value: realtimeStats.totalProjects.toString(),
      icon: FolderOpen,
      change: "+0% dari bulan lalu",
      color: "bg-blue-500"
    },
    {
      title: "Klien Aktif",
      value: realtimeStats.activeClients.toString(),
      icon: Users,
      change: "+0% dari bulan lalu",
      color: "bg-green-500"
    },
    {
      title: "Total Views",
      value: realtimeStats.totalViews.toLocaleString(),
      icon: Eye,
      change: "+0% dari bulan lalu",
      color: "bg-purple-500"
    },
    {
      title: "Pesan Baru",
      value: realtimeStats.unreadMessages.toString(),
      icon: MessageSquare,
      change: `${realtimeStats.unreadMessages} belum dibaca`,
      color: "bg-yellow-500"
    }
  ];

  interface RecentProjectUI {
    id: number;
    title: string;
    client: string;
    status: string;
    date: string;
    views: string;
  }

  const formattedRecentProjects: RecentProjectUI[] = recentProjects.map((item: PortfolioItem) => ({
    id: item.id,
    title: item.title,
    client: item.client || "Klien Tidak Diketahui",
    status: item.category || "Status Tidak Diketahui",
    date: new Date(item.created_at).toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }),
    views: (item.views || 0).toLocaleString()
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
          <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
          <p className="text-gray-400 mt-2">Memuat data dashboard real-time...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-full"></div>
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
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 p-6 rounded-xl">
          <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
          <p className="text-red-400 mt-2">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
        <p className="text-gray-400 mt-2">Selamat datang di panel admin MiraiDev (Real-time)</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} bg-opacity-20 p-3 rounded-full`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Projects and Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Proyek Terbaru</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 hover:underline">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {formattedRecentProjects.length > 0 ? (
              formattedRecentProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/30 hover:bg-gray-800 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-white">{project.title}</h3>
                    <p className="text-sm text-gray-400">{project.client}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status === "Selesai" || project.status === "aktif" || project.status === "website"
                        ? "bg-green-900/30 text-green-400 border border-green-900/50" 
                        : project.status === "Dalam Pengerjaan" || project.status === "pengerjaan"
                          ? "bg-blue-900/30 text-blue-400 border border-blue-900/50" 
                          : "bg-yellow-900/30 text-yellow-400 border border-yellow-900/50"
                    }`}>
                      {project.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{project.date}</p>
                    <p className="text-xs text-gray-500 mt-1">Dilihat: {project.views}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Tidak ada proyek yang ditemukan
              </div>
            )}
          </div>
        </Card>

        {/* Activity Chart */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Aktivitas Website</h2>
            <div className="flex space-x-2">
              <button className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg">
                7 hari
              </button>
              <button className="text-xs px-3 py-1.5 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg">
                30 hari
              </button>
            </div>
          </div>
          <div className="h-64 flex items-end space-x-2 pt-4">
            {[65, 80, 60, 75, 90, 70, 85].map((height, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-500 hover:to-blue-300 transition-all duration-300"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-400 mt-2">
                  {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][index]}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <h2 className="text-lg font-bold text-white mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-lg border border-gray-700/30 hover:bg-gray-800 transition-colors">
            <FolderOpen className="h-8 w-8 text-blue-400 mb-2" />
            <span className="font-medium text-white">Tambah Proyek</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-lg border border-gray-700/30 hover:bg-gray-800 transition-colors">
            <Users className="h-8 w-8 text-green-400 mb-2" />
            <span className="font-medium text-white">Tambah Klien</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-lg border border-gray-700/30 hover:bg-gray-800 transition-colors">
            <BarChart3 className="h-8 w-8 text-purple-400 mb-2" />
            <span className="font-medium text-white">Lihat Analitik</span>
          </button>
        </div>
      </Card>
    </div>
  );
}
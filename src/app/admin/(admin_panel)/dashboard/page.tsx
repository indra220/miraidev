"use client";

import { Card } from "@/components/ui/card";
import { 
  FolderOpen, 
  Users, 
  Eye, 
  BarChart3,
  MessageSquare
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Proyek",
      value: "24",
      icon: FolderOpen,
      change: "+12% dari bulan lalu",
      color: "bg-blue-500"
    },
    {
      title: "Klien Aktif",
      value: "18",
      icon: Users,
      change: "+8% dari bulan lalu",
      color: "bg-green-500"
    },
    {
      title: "Total Views",
      value: "12.4K",
      icon: Eye,
      change: "+24% dari bulan lalu",
      color: "bg-purple-500"
    },
    {
      title: "Pesan Baru",
      value: "7",
      icon: MessageSquare,
      change: "3 belum dibaca",
      color: "bg-yellow-500"
    }
  ];

  const recentProjects = [
    {
      id: 1,
      title: "Website Kedai Kopi Lokal",
      client: "Kedai Kopi Nusantara",
      status: "Selesai",
      date: "15 Mar 2024",
      views: "850"
    },
    {
      id: 2,
      title: "Portofolio Fotografer",
      client: "Andi Prasetyo",
      status: "Dalam Pengerjaan",
      date: "10 Mar 2024",
      views: "1.2K"
    },
    {
      id: 3,
      title: "Website PPDB SD 01",
      client: "SD Negeri 01 Jakarta",
      status: "Selesai",
      date: "5 Mar 2024",
      views: "2.1K"
    },
    {
      id: 4,
      title: "Website Salon Kecantikan",
      client: "Salon Cantik Sejahtera",
      status: "Revisi",
      date: "1 Mar 2024",
      views: "420"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
        <p className="text-gray-400 mt-2">Selamat datang di panel admin MiraiDev</p>
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
            {recentProjects.map((project) => (
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
                    project.status === "Selesai" 
                      ? "bg-green-900/30 text-green-400 border border-green-900/50" 
                      : project.status === "Dalam Pengerjaan" 
                        ? "bg-blue-900/30 text-blue-400 border border-blue-900/50" 
                        : "bg-yellow-900/30 text-yellow-400 border border-yellow-900/50"
                  }`}>
                    {project.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{project.date}</p>
                  <p className="text-xs text-gray-500 mt-1">Dilihat: {project.views}</p>
                </div>
              </div>
            ))}
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
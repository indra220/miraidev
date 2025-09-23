"use client";

import { Card } from "@/components/ui/card";
import { 
  FolderOpen, 
  Users, 
  Eye, 
  Calendar,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Clock
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Selamat datang di panel admin MiraiDev</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Proyek Terbaru</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.client}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === "Selesai" 
                      ? "bg-green-100 text-green-800" 
                      : project.status === "Dalam Pengerjaan" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {project.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{project.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Aktivitas Website</h2>
            <div className="flex space-x-2">
              <button className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                7 hari
              </button>
              <button className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded">
                30 hari
              </button>
            </div>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {[65, 80, 60, 75, 90, 70, 85].map((height, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">
                  {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][index]}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <FolderOpen className="h-8 w-8 text-blue-500 mb-2" />
            <span className="font-medium text-gray-900">Tambah Proyek</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Users className="h-8 w-8 text-green-500 mb-2" />
            <span className="font-medium text-gray-900">Tambah Klien</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <BarChart3 className="h-8 w-8 text-purple-500 mb-2" />
            <span className="font-medium text-gray-900">Lihat Analitik</span>
          </button>
        </div>
      </Card>
    </div>
  );
}
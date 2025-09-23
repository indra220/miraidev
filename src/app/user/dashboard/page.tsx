"use client";

import { Card } from "@/components/ui/card";
import { 
  FolderOpen, 
  CreditCard, 
  Calendar,
  BarChart3,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserDashboard() {
  const stats = [
    {
      title: "Proyek Aktif",
      value: "3",
      icon: FolderOpen,
      change: "1 proyek dalam pengerjaan",
      color: "bg-blue-500"
    },
    {
      title: "Total Pembayaran",
      value: "Rp 15.000.000",
      icon: CreditCard,
      change: "Rp 5.000.000 belum dibayar",
      color: "bg-green-500"
    },
    {
      title: "Pesan Baru",
      value: "5",
      icon: MessageSquare,
      change: "2 belum dibaca",
      color: "bg-yellow-500"
    },
    {
      title: "Deadline Terdekat",
      value: "2",
      icon: Calendar,
      change: "Dalam 7 hari",
      color: "bg-red-500"
    }
  ];

  const projects = [
    {
      id: 1,
      title: "Website Kedai Kopi",
      status: "Dalam Pengerjaan",
      progress: 75,
      deadline: "2024-04-15",
      paymentStatus: "Dibayar"
    },
    {
      id: 2,
      title: "Portofolio Fotografer",
      status: "Revisi",
      progress: 90,
      deadline: "2024-04-10",
      paymentStatus: "Dibayar"
    },
    {
      id: 3,
      title: "Website PPDB Sekolah",
      status: "Menunggu Pembayaran",
      progress: 0,
      deadline: "2024-05-01",
      paymentStatus: "Belum Dibayar"
    }
  ];

  const recentMessages = [
    {
      id: 1,
      sender: "Admin MiraiDev",
      message: "Proyek website kedai kopi sudah 75% selesai, akan selesai dalam 5 hari.",
      time: "2 jam yang lalu",
      unread: false
    },
    {
      id: 2,
      sender: "Admin MiraiDev",
      message: "Silakan periksa revisi untuk portofolio fotografer.",
      time: "1 hari yang lalu",
      unread: true
    },
    {
      id: 3,
      sender: "Admin MiraiDev",
      message: "Invoice untuk website PPDB sekolah telah dikirim.",
      time: "2 hari yang lalu",
      unread: false
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Selamat datang kembali, John Doe</p>
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

      {/* Projects and Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Proyek Saya</h2>
            <Button variant="link" className="text-blue-600 hover:text-blue-800">
              Lihat Semua
            </Button>
          </div>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === "Dalam Pengerjaan" 
                          ? "bg-blue-100 text-blue-800" 
                          : project.status === "Revisi" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-gray-100 text-gray-800"
                      }`}>
                        {project.status}
                      </span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.paymentStatus === "Dibayar" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {project.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Deadline</p>
                    <p className="text-sm font-medium text-gray-900">{project.deadline}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Messages */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Pesan Terbaru</h2>
            <Button variant="link" className="text-blue-600 hover:text-blue-800">
              Lihat Semua
            </Button>
          </div>
          <div className="space-y-4">
            {recentMessages.map((message) => (
              <div 
                key={message.id} 
                className={`border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
                  message.unread ? "bg-blue-50 border-blue-200" : ""
                }`}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-900">{message.sender}</h3>
                  <span className="text-xs text-gray-500">{message.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                {message.unread && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Belum dibaca
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <FolderOpen className="h-6 w-6 text-blue-500 mb-2" />
            <span className="font-medium text-gray-900 text-sm">Proyek Saya</span>
          </Button>
          <Button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <CreditCard className="h-6 w-6 text-green-500 mb-2" />
            <span className="font-medium text-gray-900 text-sm">Pembayaran</span>
          </Button>
          <Button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <MessageSquare className="h-6 w-6 text-purple-500 mb-2" />
            <span className="font-medium text-gray-900 text-sm">Pesan</span>
          </Button>
          <Button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Calendar className="h-6 w-6 text-yellow-500 mb-2" />
            <span className="font-medium text-gray-900 text-sm">Jadwal Meeting</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
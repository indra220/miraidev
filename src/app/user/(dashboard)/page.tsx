"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  FolderOpen, 
  Calendar, 
  MessageSquare
} from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/loading-spinner";

interface Project {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

interface Activity {
  id: number;
  description: string;
  date: string;
}

export default function UserDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createSupabaseClient();
        
        // Get user info
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }

        // Get user projects (simulated)
        const mockProjects = [
          { id: 1, title: "Website Kedai Kopi", status: "Selesai", created_at: "2024-03-15" },
          { id: 2, title: "Portofolio Fotografer", status: "Dalam Pengerjaan", created_at: "2024-04-01" },
          { id: 3, title: "Landing Page Startup", status: "Revisi", created_at: "2024-03-20" }
        ];
        setProjects(mockProjects);

        // Get recent activities (simulated)
        const mockActivities = [
          { id: 1, description: "Website Kedai Kopi telah selesai dikerjakan", date: "2024-03-15" },
          { id: 2, description: "Portofolio Fotografer sedang dalam tahap pengembangan", date: "2024-04-05" },
          { id: 3, description: "Landing Page Startup menunggu revisi", date: "2024-04-02" }
        ];
        setActivities(mockActivities);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Proyek",
      value: projects.length,
      icon: FolderOpen,
      change: "+2 dari bulan lalu",
      color: "bg-blue-500"
    },
    {
      title: "Proyek Aktif",
      value: projects.filter(p => p.status !== "Selesai").length,
      icon: Calendar,
      change: "+1 minggu ini",
      color: "bg-green-500"
    },
    {
      title: "Pesan Baru",
      value: "3",
      icon: MessageSquare,
      change: "2 belum dibaca",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Selamat datang kembali {user?.email ? `(${user.email})` : ""} di dashboard Anda
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Recent Projects and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Proyek Terbaru</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 hover:underline">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div 
                key={project.id} 
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/30 hover:bg-gray-800 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-white">{project.title}</h3>
                  <p className="text-sm text-gray-400">Dibuat: {project.created_at}</p>
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
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Aktivitas Terbaru</h2>
          </div>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start p-4 bg-gray-800/50 rounded-lg border border-gray-700/30">
                <div className="bg-blue-600/20 p-2 rounded-full mr-3">
                  <Calendar className="h-4 w-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
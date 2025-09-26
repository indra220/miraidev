"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Calendar,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  status: 'draft' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  category: string;
  image_url?: string;
}

export default function UserProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Dalam implementasi nyata, Anda akan mengambil data projects dari database
        // berdasarkan user yang sedang login
        const mockProjects: Project[] = [
          {
            id: 1,
            title: "Website Kedai Kopi Lokal",
            description: "Website profesional untuk kedai kopi lokal dengan menu online dan sistem reservasi.",
            status: "completed",
            created_at: "2024-03-15T10:30:00Z",
            updated_at: "2024-03-20T14:45:00Z",
            category: "UMKM",
            image_url: "/placeholder-project-1.jpg"
          },
          {
            id: 2,
            title: "Portofolio Fotografer Freelance",
            description: "Website portofolio interaktif untuk fotografer freelance dengan galeri karya.",
            status: "in_progress",
            created_at: "2024-04-01T09:15:00Z",
            updated_at: "2024-04-05T11:30:00Z",
            category: "Personal Branding",
            image_url: "/placeholder-project-2.jpg"
          },
          {
            id: 3,
            title: "Landing Page Startup Teknologi",
            description: "Landing page modern untuk startup teknologi dengan integrasi pembayaran.",
            status: "review",
            created_at: "2024-03-20T13:20:00Z",
            updated_at: "2024-04-02T16:45:00Z",
            category: "Startup",
            image_url: "/placeholder-project-3.jpg"
          }
        ];
        setProjects(mockProjects);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusText = (status: Project["status"]) => {
    switch (status) {
      case "draft": return "Draft";
      case "in_progress": return "Dalam Pengerjaan";
      case "review": return "Review";
      case "completed": return "Selesai";
      case "cancelled": return "Dibatalkan";
      default: return status;
    }
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "draft": return "bg-gray-700/30 text-gray-400 border border-gray-700/50";
      case "in_progress": return "bg-blue-900/30 text-blue-400 border border-blue-900/50";
      case "review": return "bg-yellow-900/30 text-yellow-400 border border-yellow-900/50";
      case "completed": return "bg-green-900/30 text-green-400 border border-green-900/50";
      case "cancelled": return "bg-red-900/30 text-red-400 border border-red-900/50";
      default: return "bg-gray-700/30 text-gray-400 border border-gray-700/50";
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Proyek Saya</h1>
          <p className="text-gray-400 mt-2">
            Kelola semua proyek yang sedang Anda kerjakan
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 px-6 transition-all duration-150 hover:scale-[1.02]">
          <Plus className="mr-2 h-4 w-4" />
          Buat Proyek Baru
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              placeholder="Cari proyek..."
              className="w-full pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 rounded-md px-3 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select
              className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 rounded-md px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="in_progress">Dalam Pengerjaan</option>
              <option value="review">Review</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
          
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-400">
              {filteredProjects.length} proyek
            </span>
          </div>
        </div>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="p-12 text-center bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <FolderOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300">Tidak ada proyek</h3>
          <p className="text-gray-500 mt-1">
            {searchTerm || statusFilter !== "all" 
              ? "Tidak ditemukan proyek yang sesuai dengan filter Anda." 
              : "Anda belum memiliki proyek. Buat proyek pertama Anda!"}
          </p>
          <Button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Buat Proyek Baru
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="overflow-hidden bg-white/5 backdrop-blur-sm border border-gray-700/50 hover:bg-white/10 transition-all duration-200"
            >
              <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 relative flex items-center justify-center">
                {project.image_url ? (
                  <img 
                    src={project.image_url} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FolderOpen className="h-10 w-10 text-gray-300/50" />
                )}
                <div className="absolute top-2 right-2">
                  <span className="bg-blue-600/80 text-white text-xs px-2 py-1 rounded">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white">{project.title}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(project.created_at).toLocaleDateString('id-ID')}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-600/50 text-red-400 hover:bg-red-600/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
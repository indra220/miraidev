"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  FolderOpen, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Download,
  Eye,
  Edit,
  Plus
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  status: string;
  progress: number;
  deadline: string;
  paymentStatus: string;
  category: string;
  description: string;
  startDate: string;
  developer: string;
}

export default function UserProjects() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "Website Kedai Kopi",
      status: "Dalam Pengerjaan",
      progress: 75,
      deadline: "2024-04-15",
      paymentStatus: "Dibayar",
      category: "UMKM",
      description: "Website profesional untuk kedai kopi lokal dengan menu online, lokasi, dan informasi kontak.",
      startDate: "2024-03-01",
      developer: "MiraiDev Team"
    },
    {
      id: 2,
      title: "Portofolio Fotografer",
      status: "Revisi",
      progress: 90,
      deadline: "2024-04-10",
      paymentStatus: "Dibayar",
      category: "Personal Branding",
      description: "Website portofolio yang menampilkan karya fotografer freelance dengan galeri interaktif.",
      startDate: "2024-02-15",
      developer: "MiraiDev Team"
    },
    {
      id: 3,
      title: "Website PPDB Sekolah",
      status: "Menunggu Pembayaran",
      progress: 0,
      deadline: "2024-05-01",
      paymentStatus: "Belum Dibayar",
      category: "PPDB",
      description: "Website sistem PPDB online untuk SD Negeri 01 dengan form registrasi dan tracking status pendaftaran.",
      startDate: "2024-03-20",
      developer: "MiraiDev Team"
    }
  ]);

  const [filter, setFilter] = useState("all");

  const filteredProjects = projects.filter(project => {
    if (filter === "all") return true;
    if (filter === "active") return project.status !== "Selesai";
    if (filter === "completed") return project.status === "Selesai";
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Dalam Pengerjaan": return "bg-blue-100 text-blue-800";
      case "Revisi": return "bg-yellow-100 text-yellow-800";
      case "Menunggu Pembayaran": return "bg-gray-100 text-gray-800";
      case "Selesai": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Dibayar": return "bg-green-100 text-green-800";
      case "Belum Dibayar": return "bg-red-100 text-red-800";
      case "Sebagian": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proyek Saya</h1>
          <p className="text-gray-600 mt-2">Kelola semua proyek yang sedang Anda kerjakan bersama kami</p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Buat Proyek Baru
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            Semua Proyek
          </Button>
          <Button 
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
            className={filter === "active" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            Aktif
          </Button>
          <Button 
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
            className={filter === "completed" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            Selesai
          </Button>
        </div>
      </Card>

      {/* Projects List */}
      <div className="space-y-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          <Clock className="h-3 w-3 mr-1" />
                          {project.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(project.paymentStatus)}`}>
                          <CreditCard className="h-3 w-3 mr-1" />
                          {project.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right">
                      <p className="text-sm text-gray-500">Developer</p>
                      <p className="font-medium text-gray-900">{project.developer}</p>
                      <p className="text-sm text-gray-500 mt-2">Deadline</p>
                      <p className="font-medium text-gray-900">{project.deadline}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
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
              </div>
              
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Lihat Detail
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Kirim Pesan
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Dokumen
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Unduh
                </Button>
                {project.status === "Revisi" && (
                  <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-600 hover:bg-yellow-50">
                    <Edit className="h-4 w-4 mr-1" />
                    Ajukan Revisi
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card className="p-12 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada proyek</h3>
          <p className="mt-1 text-gray-500">
            Anda belum memiliki proyek. Mulai proyek baru untuk bekerja sama dengan kami.
          </p>
          <div className="mt-6">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Buat Proyek Baru
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
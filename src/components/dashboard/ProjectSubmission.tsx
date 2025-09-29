"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileTextIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  AlertCircleIcon,
  SearchIcon,
  CalendarIcon,
  PlusIcon
} from "lucide-react";
import { useState } from "react";

export function ProjectSubmission() {
  // Data contoh - nanti akan diganti dengan data dari API
  const [projects] = useState([
    { id: 1, name: "Website E-commerce", status: "dalam proses", type: "website", date: "2024-10-25" },
    { id: 2, name: "Landing Page Marketing", status: "terkirim", type: "website", date: "2024-10-22" },
    { id: 3, name: "Sistem Informasi", status: "selesai", type: "aplikasi", date: "2024-10-20" },
  ]);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    type: "website",
    requirements: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementasi pengajuan proyek baru
    // console.log("Proyek baru:", newProject);
    setNewProject({ name: "", description: "", type: "website", requirements: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Ajukan Proyek Baru</h2>
        <p className="text-sm text-muted-foreground">Kirimkan permintaan proyek website Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Formulir Pengajuan Proyek
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nama Proyek</label>
              <Input
                placeholder="Contoh: Website Company Profile PT. Maju Jaya"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Jenis Proyek</label>
              <select
                value={newProject.type}
                onChange={(e) => setNewProject({...newProject, type: e.target.value})}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="website">Website</option>
                <option value="landing-page">Landing Page</option>
                <option value="web-app">Web Application</option>
                <option value="e-commerce">E-commerce</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Deskripsi Singkat</label>
              <Textarea
                placeholder="Jelaskan secara singkat proyek yang ingin Anda buat..."
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                required
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Persyaratan/Keinginan Khusus</label>
              <Textarea
                placeholder="Jelaskan persyaratan teknis atau keinginan khusus Anda..."
                value={newProject.requirements}
                onChange={(e) => setNewProject({...newProject, requirements: e.target.value})}
                rows={4}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                <PlusIcon className="h-4 w-4 mr-2" />
                Ajukan Proyek
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Daftar Proyek Saya</span>
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari proyek..." className="pl-8" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <FileTextIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                      <h3 className="font-medium">{project.name}</h3>
                    </div>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        project.status === 'selesai' ? 'bg-green-100 text-green-800' :
                        project.status === 'dalam proses' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status === 'selesai' ? <CheckCircleIcon className="h-3 w-3 mr-1" /> :
                         project.status === 'dalam proses' ? <ClockIcon className="h-3 w-3 mr-1" /> :
                         <AlertCircleIcon className="h-3 w-3 mr-1" />}
                        {project.status}
                      </span>
                      <span className="text-sm text-muted-foreground capitalize">{project.type}</span>
                      <span className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {project.date}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Lihat Detail</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
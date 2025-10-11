// src/components/dashboard/ProjectOverview.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CalendarIcon, 
  UserIcon, 
  MessageSquareIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService, DashboardProject } from "@/lib/dashboard-service";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function ProjectOverview() {
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { session, loading: authLoading } = useAuth();

  // --- PERUBAHAN DIMULAI DI SINI ---
  // Ambil nama pengguna dari data sesi
  const userName =
    (session?.user?.user_metadata?.full_name as string) ||
    (session?.user?.user_metadata?.name as string) ||
    session?.user?.email ||
    "Klien";
  // --- AKHIR PERUBAHAN ---

  useEffect(() => {
    if (authLoading) return;
    
    const fetchProjects = async () => {
      if (session?.user) {
        try {
          const userProjects = await dashboardService.getDashboardData(session.user.id);
          setProjects(userProjects.projects);
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [session, authLoading]);

  // Fungsi untuk membatalkan proyek
  const cancelProject = async (projectId: string) => {
    if (!session?.user) {
      toast.error("Anda harus login untuk membatalkan proyek");
      return;
    }

    if (!window.confirm("Apakah Anda yakin ingin membatalkan proyek ini? Aksi ini tidak dapat dibatalkan.")) {
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('projects')
        .update({ status: 'cancelled' })
        .eq('id', projectId)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error cancelling project:', error);
        throw error;
      }

      // Perbarui daftar proyek setelah pembatalan
      const userProjects = await dashboardService.getDashboardData(session.user.id);
      setProjects(userProjects.projects);

      toast.success("Proyek Berhasil Dibatalkan", {
        description: "Proyek telah dibatalkan dan statusnya telah diperbarui."
      });
    } catch (error: unknown) {
      console.error("Error cancelling project:", error);
      toast.error("Gagal Membatalkan Proyek", {
        description: (error as Error).message || "Terjadi kesalahan yang tidak diketahui."
      });
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data proyek...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {/* --- PERUBAHAN: Menampilkan nama pengguna, bukan ID --- */}
                  {userName}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progres</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        project.status === "completed" || project.status === "selesai" ? "bg-green-500" :
                        project.status === "development" || project.status === "aktif" ? "bg-blue-500" :
                        "bg-yellow-500"
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      (project.status === 'completed' || project.status === 'selesai') ? 'bg-green-100 text-green-800' :
                      (project.status === 'development' || project.status === 'on-going' || project.status === 'aktif') ? 'bg-blue-100 text-blue-800' :
                      (project.status === 'terkirim' || project.status === 'planning') ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {(project.status === 'completed' || project.status === 'selesai') ? <CheckCircleIcon className="h-3 w-3 mr-1" /> :
                       (project.status === 'development' || project.status === 'on-going' || project.status === 'aktif') ? <ClockIcon className="h-3 w-3 mr-1" /> :
                       (project.status === 'terkirim' || project.status === 'planning') ? <AlertCircleIcon className="h-3 w-3 mr-1" /> :
                       <ClockIcon className="h-3 w-3 mr-1" />}
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Estimasi Waktu: {project.estimasiWaktuPengerjaan || 'Belum Ditentukan'}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Dibuat: {new Date(project.tanggalPembuatan).toLocaleDateString('id-ID')}</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Tim: {project.team}
                  </div>
                  
                  <div className="text-sm mt-2 p-2 bg-muted rounded">
                    <MessageSquareIcon className="h-4 w-4 inline mr-1" />
                    <span className="text-muted-foreground">Update terakhir: </span>
                    <span>{project.latestUpdate}</span>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 space-x-2">
                  {/* Tombol pembatalan hanya muncul jika status masih planning */}
                  {project.status === 'planning' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => {
                        e.preventDefault();
                        cancelProject(project.id);
                      }}
                      className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
                    >
                      Batalkan
                    </Button>
                  )}
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/projects/${project.id}`}>Detail</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/messages?project=${project.id}`}>Komunikasi</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Belum ada proyek yang terdaftar</p>
          </div>
        )}
      </div>
    </div>
  );
}
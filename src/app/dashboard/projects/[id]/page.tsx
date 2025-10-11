// src/app/dashboard/projects/[id]/page.tsx

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService, DashboardProject } from "@/lib/dashboard-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AlertCircle, Calendar, CheckCircle, Clock, Users, MessageSquare, ArrowLeft, DollarSign, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { session, loading: authLoading } = useAuth();
  
  const [project, setProject] = useState<DashboardProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false); // Gunakan ref untuk melacak apakah data sudah diambil

  useEffect(() => {
    document.title = project ? `${project.name} | MiraiDev` : "Detail Proyek | MiraiDev";
  }, [project]);

  const fetchProjectDetails = useCallback(async () => {
    if (session?.user && projectId && !hasFetched.current) {
      try {
        setLoading(true);
        const projectData = await dashboardService.getUserProjectById(session.user.id, projectId);
        if (projectData) {
          setProject(projectData);
          hasFetched.current = true; // Tandai bahwa data sudah diambil
        } else {
          setError("Proyek tidak ditemukan atau Anda tidak memiliki akses.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat detail proyek.");
      } finally {
        setLoading(false);
      }
    } else if (!authLoading && !session?.user) {
      setError("Sesi tidak ditemukan. Silakan login kembali.");
      setLoading(false);
    }
  }, [session, authLoading, projectId]);

  useEffect(() => {
    if (!authLoading && !hasFetched.current) {
      fetchProjectDetails();
    }
  }, [authLoading, fetchProjectDetails]);

  // Tambahkan event listener untuk visibilitychange
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Jika halaman tidak tersembunyi dan data belum pernah diambil, ambil data
      if (!document.hidden && !hasFetched.current && !authLoading && session?.user) {
        fetchProjectDetails();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchProjectDetails, authLoading, session]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <AlertCircle className="mx-auto h-12 w-12" />
        <p className="mt-4">{error}</p>
      </div>
    );
  }
  
  if (!project) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    if (status === 'completed' || status === 'selesai') return <CheckCircle className="h-4 w-4 mr-2 text-green-500" />;
    if (status === 'development' || status === 'on-going' || status === 'aktif') return <Clock className="h-4 w-4 mr-2 text-blue-500" />;
    if (status === 'terkirim' || status === 'planning') return <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />;
    return <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
       <div>
        <Button variant="outline" asChild className="mb-4">
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Proyek
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">
          Detail lengkap untuk proyek Anda.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Proyek</CardTitle>
          <CardDescription>ID Proyek: {project.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1 font-medium">
              <span>Progres</span>
              <span>{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-border pt-6">
            <div className="flex items-center">
              {getStatusIcon(project.status)}
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold capitalize">{project.status}</p>
              </div>
            </div>
             <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Tim</p>
                <p className="font-semibold">{project.team}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Estimasi Waktu Pengerjaan</p>
                <p className="font-semibold">
                  {project.estimasiWaktuPengerjaan || 'Belum Ditentukan'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Dibuat</p>
                <p className="font-semibold">
                  {new Date(project.tanggalPembuatan).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>

            {/* --- PENAMBAHAN INFO HARGA DAN KESULITAN --- */}
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Estimasi Harga</p>
                <p className="font-semibold">
                  {project.price ? `Rp ${project.price.toLocaleString('id-ID')}` : 'Belum Ditentukan'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Tingkat Kesulitan</p>
                <p className="font-semibold">{project.complexity || 'Belum Ditentukan'}</p>
              </div>
            </div>
             {/* --- AKHIR PENAMBAHAN --- */}
          </div>

          {/* Deskripsi Proyek */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-3">Deskripsi Proyek</h3>
            <p className="text-muted-foreground">
              {project.description || 'Deskripsi proyek belum ditentukan.'}
            </p>
          </div>

          {/* Fitur-fitur Proyek */}
          {project.features && project.features.length > 0 && (
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold mb-3">Fitur-fitur Proyek</h3>
              <div className="flex flex-wrap gap-2">
                {project.features.map((feature, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tanggal Mulai dan Selesai */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-3">Jadwal Proyek</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Mulai</p>
                  <p className="font-semibold">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString('id-ID') : 'Belum Ditentukan'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Selesai</p>
                  <p className="font-semibold">
                    {project.endDate ? new Date(project.endDate).toLocaleDateString('id-ID') : 'Belum Ditentukan'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Update */}
           <div className="border-t border-border pt-6">
              <div className="flex items-start justify-between">
                 <div className="flex items-start">
                    <MessageSquare className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                       <p className="text-sm text-muted-foreground">Update Terakhir</p>
                       <p className="font-semibold">{project.latestUpdate}</p>
                    </div>
                 </div>
                 <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/projects/${project.id}/updates`}>
                       Lihat Update Lengkap
                    </Link>
                 </Button>
              </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
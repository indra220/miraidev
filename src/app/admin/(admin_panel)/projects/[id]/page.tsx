// src/app/admin/(admin_panel)/projects/[id]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';

import { 
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Building,
  Mail,
  Phone,
  AlertCircle,
  ArrowLeft,
  Edit3
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';

import ProjectUpdateForm from '@/components/ProjectUpdateForm';
import ProjectUpdateList from '@/components/ProjectUpdateList';

// Interface disesuaikan dengan skema database yang ada
interface Project {
  id: string;
  title: string;
  description: string | null;
  status: 'terkirim' | 'planning' | 'development' | 'on-going' | 'aktif' | 'selesai' | 'pengerjaan' | 'pending' | 'dibatalkan';
  start_date: string | null;
  end_date: string | null;
  price: number | null;
  user_id: string | null;
  progress: number | null;
  created_at: string;
  updated_at: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  user_id: string | null;
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!id) {
        setLoading(false);
        toast.error("ID Proyek tidak valid.");
        return;
    }
      
    try {
      setLoading(true);
      const supabase = createClient();
      
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;
      if (!projectData) throw new Error("Proyek tidak ditemukan.");

      setProject(projectData);

      if (projectData.user_id) {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', projectData.user_id)
          .single();

        if (clientError && clientError.code !== 'PGRST116') throw clientError;

        setClient(clientData);
      }
    } catch (error: unknown) {
        console.error('Error fetching data:', error);
        let errorMessage = "Terjadi kesalahan yang tidak diketahui.";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = String((error as { message: string }).message);
        }
        toast.error('Gagal memuat data proyek', {
            description: errorMessage
        });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'terkirim': return 'bg-yellow-500 hover:bg-yellow-500';
      case 'planning': return 'bg-blue-500 hover:bg-blue-500';
      case 'development':
      case 'on-going':
      case 'aktif': return 'bg-green-500 hover:bg-green-500';
      case 'selesai': return 'bg-purple-500 hover:bg-purple-500';
      case 'dibatalkan': return 'bg-red-500 hover:bg-red-500';
      default: return 'bg-gray-500 hover:bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'terkirim': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'planning': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'development':
      case 'on-going':
      case 'aktif':
      case 'selesai': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'dibatalkan': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Proyek tidak ditemukan atau Anda tidak memiliki akses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detail Proyek</h1>
          <p className="text-muted-foreground">
            Informasi lengkap tentang proyek {project.title}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <Button asChild variant="default">
            <Link href={`/admin/projects/${project.id}/update`}>
              <Edit3 className="h-4 w-4 mr-2" />
              Update Proyek
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>
                {project.title}
              </CardTitle>
              <CardDescription>
                Detail proyek dan informasi terkait
              </CardDescription>
            </div>
            {project.status && (
              <Badge className={getStatusBadgeVariant(project.status)}>
                {getStatusIcon(project.status)}
                <span className="ml-1">{project.status}</span>
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Deskripsi Proyek</h3>
                <div className="p-3 bg-muted rounded-md min-h-[100px]">
                  <p>{project.description || "Tidak ada deskripsi."}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tanggal Mulai</Label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{project.start_date ? new Date(project.start_date).toLocaleDateString('id-ID') : '-'}</span>
                  </div>
                </div>
                <div>
                  <Label>Tanggal Selesai</Label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{project.end_date ? new Date(project.end_date).toLocaleDateString('id-ID') : '-'}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Anggaran</Label>
                <div className="flex items-center mt-1">
                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Rp {(project.price || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <div>
                <Label>Progress</Label>
                <div className="flex items-center mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress || 0}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{project.progress || 0}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="flex items-center"><User className="h-5 w-5 mr-2" /> Informasi Klien</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {client ? (
                    <>
                      <div>
                        <Label>Nama Klien</Label>
                          <div className="flex items-center mt-1">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{client.name}</span>
                          </div>
                      </div>
                      <div>
                        <Label>Email</Label>
                          <div className="flex items-center mt-1">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{client.email}</span>
                          </div>
                      </div>
                      <div>
                        <Label>No. Telepon</Label>
                        <div className="flex items-center mt-1">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{client.phone || '-'}</span>
                        </div>
                      </div>
                      <div>
                        <Label>Perusahaan</Label>
                        <div className="flex items-center mt-1">
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{client.company || '-'}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Informasi klien tidak ditemukan.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProjectUpdateForm projectId={project.id} />

      <ProjectUpdateList projectId={project.id} />
    </div>
  );
}
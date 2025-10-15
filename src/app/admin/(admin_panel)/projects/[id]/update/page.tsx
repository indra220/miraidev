// src/app/admin/(admin_panel)/projects/[id]/update/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { 
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
  Save
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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

export default function UpdateProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    status: 'terkirim',
    start_date: '',
    end_date: '',
    price: 0,
    progress: 0
  });

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
      setFormData({
        title: projectData.title,
        description: projectData.description || '',
        status: projectData.status,
        start_date: projectData.start_date || '',
        end_date: projectData.end_date || '',
        price: projectData.price || 0,
        progress: projectData.progress || 0
      });

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
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
      console.error('Error fetching data:', errorMessage);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      progress: value >= 0 && value <= 100 ? value : prev.progress
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('projects')
        .update({
          status: formData.status,
          start_date: formData.start_date,
          end_date: formData.end_date,
          progress: formData.progress,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Proyek berhasil diperbarui!');
      router.push(`/admin/projects/${id}`);
      router.refresh();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
      console.error('Error updating project:', errorMessage);
      toast.error('Gagal memperbarui proyek', {
        description: errorMessage
      });
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Update Proyek</h1>
          <p className="text-muted-foreground">
            Perbarui informasi proyek {project.title}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/admin/projects/${project.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Detail
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>
                {project.title}
              </CardTitle>
              <CardDescription>
                Formulir untuk memperbarui informasi proyek
              </CardDescription>
            </div>
            {project.status && (
              <div className="flex items-center space-x-2">
                <Badge className={getStatusBadgeVariant(project.status)}>
                  {getStatusIcon(project.status)}
                  <span className="ml-1">{project.status}</span>
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="h-5 w-5 mr-2" /> 
                      Informasi Proyek
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Judul Proyek</Label>
                      <div className="flex items-center mt-1">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formData.title}</span>
                      </div>
                    </div>
                    <div>
                      <Label>Deskripsi Proyek</Label>
                      <div className="p-3 bg-muted rounded-md min-h-[100px] mt-1">
                        <p>{formData.description || "Tidak ada deskripsi."}</p>
                      </div>
                    </div>
                    <div>
                      <Label>Anggaran</Label>
                      <div className="flex items-center mt-1">
                        <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Rp {(formData.price || 0).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Tanggal Mulai</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">Tanggal Selesai</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="progress">Progress ({formData.progress}%)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="progress"
                      type="range"
                      min="0"
                      max="100"
                      value={formData.progress || 0}
                      onChange={handleProgressChange}
                    />
                    <span className="text-sm font-medium w-12">{formData.progress}%</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Status Proyek</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="terkirim">Terkirim</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="on-going">On-going</SelectItem>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="selesai">Selesai</SelectItem>
                      <SelectItem value="pengerjaan">Pengerjaan</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" /> 
                      Informasi Klien
                    </CardTitle>
                  </CardHeader>
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

                <div className="pt-4">
                  <Button type="submit" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
// src/app/admin/(admin_panel)/projects/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { 
  Plus, 
  MoreHorizontal, 
  Search, 
  Edit, 
  Trash, 
  Eye,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Interface untuk data proyek
interface Project {
  id: string;
  title: string;
  description: string | null;
  status: 'terkirim' | 'planning' | 'development' | 'on-going' | 'aktif' | 'selesai' | 'pengerjaan' | 'pending' | 'diarsipkan' | 'dibatalkan' | null;
  start_date: string | null;
  end_date: string | null;
  price: number | null;
  user_id: string | null;
  category: string | null;
  complexity: string | null;
  features: string[] | null;
  additional_requirements: string | null;
  progress: number | null;
  created_at: string | null;
  updated_at: string | null;
  client_name?: string; // Properti opsional dari relasi dengan tabel clients
}

// Interface untuk data klien
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  join_date: string | null;
  project_count: number | null;
  rating: number | null;
  role: 'super_admin' | 'admin' | 'klien' | null;
  status: 'aktif' | 'tidak_aktif' | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<Project, 'id' | 'created_at' | 'updated_at' | 'client_name'> & { client_name?: string }>({
    title: '',
    description: '',
    status: 'aktif',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    price: 0,
    user_id: '',
    category: '',
    complexity: '',
    features: [],
    additional_requirements: '',
    progress: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Ambil data proyek dan klien dari Supabase
  useEffect(() => {
    fetchData();
  }, []);

  // Filter proyek berdasarkan pencarian dan status
  useEffect(() => {
    let result = [...projects];

    if (searchTerm) {
      result = result.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.client_name && project.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.category && project.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.complexity && project.complexity.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedStatus !== 'all') {
      result = result.filter(project => project.status === selectedStatus);
    }

    setFilteredProjects(result);
  }, [searchTerm, selectedStatus, projects]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const supabase = createClient();
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`*`)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      if (!projectsData) {
        setProjects([]);
        setFilteredProjects([]);
        setClients([]);
        return;
      }
      
      const { data: allClients, error: allClientsError } = await supabase
        .from('clients')
        .select('user_id, name')
        .order('name', { ascending: true });

      if (allClientsError && allClientsError.code !== 'PGRST116') throw allClientsError;

      const clientMap = new Map<string, string>();
      if (allClients) {
        allClients.forEach(client => {
          if (client.user_id) {
            clientMap.set(client.user_id, client.name);
          }
        });
      }

      const projectWithClients: Project[] = projectsData.map(project => ({
        ...project,
        client_name: (project.user_id && clientMap.get(project.user_id)) || 'Klien Tidak Ditemukan'
      }));

      setProjects(projectWithClients);
      setFilteredProjects(projectWithClients);

      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (clientsError && clientsError.code !== 'PGRST116') throw clientsError;
      
      setClients(clientsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data proyek dan klien');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value as Project['status']
    }));
  };

  const handleClientSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      user_id: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'aktif',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      price: 0,
      user_id: '',
      category: '',
      complexity: '',
      features: [],
      additional_requirements: '',
      progress: 0
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const supabase = createClient();
      
      // Ambil data proyek sebelumnya untuk memeriksa status sebelumnya
      let previousProject: Project | null = null;
      if (isEditing && editingId) {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', editingId)
          .single();
          
        if (error) throw error;
        previousProject = data as Project;
      }
      
      // Jika status diubah dari 'terkirim' ke 'planning', atur tanggal mulai dan selesai
      const projectPayload: {
        title: string;
        description: string | null;
        status: string | null;
        start_date: string | null;
        end_date: string | null;
        price: number | null;
        user_id: string | null;
        category: string | null;
        complexity: string | null;
        features: string[] | null;
        additional_requirements: string | null;
        progress?: number;
      } = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        start_date: formData.start_date,
        end_date: formData.end_date,
        price: formData.price,
        user_id: formData.user_id,
        category: formData.category,
        complexity: formData.complexity,
        features: formData.features,
        additional_requirements: formData.additional_requirements
      };

      // Jika status berubah dari 'terkirim' ke 'planning', kita perlu mengatur tanggal mulai dan selesai
      // berdasarkan estimasi waktu dan mengatur progress ke 0
      if (isEditing && previousProject && previousProject.status === 'terkirim' && formData.status === 'planning') {
        // Jika start_date atau end_date belum diatur, kita bisa menghitungnya dari timeline_estimate
        // atau biarkan kosong untuk sementara dan admin bisa mengaturnya nanti
        if (!projectPayload.start_date || !projectPayload.end_date) {
          // Di sini kita bisa menghitung tanggal mulai dan selesai berdasarkan estimasi waktu
          // Misalnya: jika estimasi waktu adalah "2 bulan", kita bisa menghitung tanggal selesai
          // dari tanggal mulai ditambah 2 bulan
          
          // Untuk sementara, biarkan kosong dan biarkan admin mengaturnya
        }
        
        // Tambahkan progress jika status berubah ke 'planning'
        projectPayload.progress = 0;
      }

      if (isEditing && editingId) {
        const { error } = await supabase.from('projects').update(projectPayload).eq('id', editingId);
        if (error) throw error;
        toast.success('Proyek berhasil diperbarui');
      } else {
        // Jika ini proyek baru dengan status 'planning', atur progress ke 0
        if (formData.status === 'planning') {
          projectPayload.progress = 0;
        }
        const { error } = await supabase.from('projects').insert([projectPayload]);
        if (error) throw error;
        toast.success('Proyek berhasil ditambahkan');
      }

      await fetchData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error submitting project:', error);
      toast.error(isEditing ? 'Gagal memperbarui proyek' : 'Gagal menambahkan proyek');
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description || '',
      status: project.status || 'aktif',
      start_date: project.start_date || new Date().toISOString().split('T')[0],
      end_date: project.end_date || new Date().toISOString().split('T')[0],
      price: project.price || 0,
      user_id: project.user_id || '',
      category: project.category || '',
      complexity: project.complexity || '',
      features: project.features || [],
      additional_requirements: project.additional_requirements || '',
      progress: project.progress || 0
    });
    setIsEditing(true);
    setEditingId(project.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('projects').delete().eq('id', projectToDelete);
      if (error) throw error;
      toast.success('Proyek berhasil dihapus');
      await fetchData();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Gagal menghapus proyek');
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };
  
  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'terkirim': return 'bg-yellow-500 hover:bg-yellow-500';
      case 'planning': return 'bg-blue-500 hover:bg-blue-500';
      case 'development':
      case 'on-going': return 'bg-green-500 hover:bg-green-500';
      case 'selesai': return 'bg-purple-500 hover:bg-purple-500';
      case 'dibatalkan': return 'bg-red-500 hover:bg-red-500';
      case 'pending': return 'bg-gray-500 hover:bg-gray-500';
      default: return 'bg-gray-500 hover:bg-gray-500';
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'terkirim': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'planning': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'development':
      case 'on-going': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'selesai': return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case 'dibatalkan': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Proyek</h1>
        <p className="text-muted-foreground">
          Kelola semua proyek klien Anda dari sini
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="space-y-1">
            <CardTitle>Daftar Proyek</CardTitle>
            <CardDescription>
              Proyek yang dikelola untuk klien Anda
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsEditing(false);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Proyek
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? 'Edit Proyek' : 'Tambah Proyek Baru'}
                </DialogTitle>
                <DialogDescription>
                  {isEditing 
                    ? 'Perbarui detail proyek yang dipilih' 
                    : 'Tambahkan proyek baru untuk klien Anda'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Proyek</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange} required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Tanggal Mulai</Label>
                    <Input id="start_date" name="start_date" type="date" value={formData.start_date || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">Tanggal Selesai</Label>
                    <Input id="end_date" name="end_date" type="date" value={formData.end_date || ''} onChange={handleInputChange} required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Anggaran (Rp)</Label>
                  <Input id="price" name="price" type="number" value={formData.price || 0} onChange={handleInputChange} required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Input id="category" name="category" value={formData.category || ''} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complexity">Kompleksitas</Label>
                    <Input id="complexity" name="complexity" value={formData.complexity || ''} onChange={handleInputChange} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="features">Fitur (pisahkan dengan koma)</Label>
                  <Input
                    id="features"
                    name="features"
                    value={formData.features?.join(', ') || ''}
                    onChange={(e) => {
                      const featuresArray = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                      setFormData(prev => ({ ...prev, features: featuresArray }));
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additional_requirements">Persyaratan Tambahan</Label>
                  <Textarea id="additional_requirements" name="additional_requirements" value={formData.additional_requirements || ''} onChange={handleInputChange} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status || 'aktif'} onValueChange={handleSelectChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="terkirim">Terkirim</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="on-going">On-going</SelectItem>
                      <SelectItem value="selesai">Selesai</SelectItem>
                      <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="user_id">Klien</Label>
                  <Select value={formData.user_id || ''} onValueChange={handleClientSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih klien" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.user_id || ''}>
                          {client.name} ({client.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Batal</Button>
                  <Button type="submit">{isEditing ? 'Perbarui' : 'Simpan'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Cari proyek..." className="pl-8 w-full sm:w-[300px]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="terkirim">Terkirim</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="on-going">On-going</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                  <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Klien</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Mulai</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Anggaran</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project, index) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>{project.client_name || '-'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeVariant(project.status)}>
                            {getStatusIcon(project.status)}
                            <span className="ml-1">{project.status || 'pending'}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{project.start_date ? new Date(project.start_date).toLocaleDateString('id-ID') : '-'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${project.progress || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{project.progress || 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell>Rp {(project.price || 0).toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Buka menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEdit(project)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/admin/projects/${project.id}`);
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                Lihat Detail
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700" onClick={() => handleDelete(project.id)}>
                                <Trash className="h-4 w-4 mr-2" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        {!loading && filteredProjects.length === 0 ? 'Tidak ada proyek ditemukan' : 'Memuat...'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak bisa dibatalkan. Proyek akan dihapus secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
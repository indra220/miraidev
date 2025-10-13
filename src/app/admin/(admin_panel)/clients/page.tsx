"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  User,
  Phone,
  Calendar,
  Filter,
  Trash2,
  Plus,
  Eye,
  Star
} from "lucide-react";
import { clientsAdminService } from "@/lib/admin-service";
import { ClientData } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { AlertDialog, AlertDialogResult } from "@/components/AlertDialog";
import { useDialog } from "@/hooks/useDialog";

export default function ClientManagement() {
  useEffect(() => {
    document.title = "Manajemen Klien | MiraiDev";
  }, []);

  const { 
    alertDialogState, 
    showAlertDialog, 
    closeAlertDialog,
    alertResultState,
    showAlertResult,
    closeAlertResult
  } = useDialog();
  
  const [clients, setClients] = useState<ClientData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileNames, setProfileNames] = useState<Record<string, string>>({});

  // Ambil data klien dari API saat komponen dimuat
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const items = await clientsAdminService.getAll();
        setClients(items);
        
        // Ambil nama lengkap untuk setiap klien
        const profileMap: Record<string, string> = {};
        const supabase = createClient();
        
        for (const client of items) {
          if (client.user_id) {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', client.user_id)
              .single();
            
            if (!error && profile?.full_name) {
              profileMap[client.user_id] = profile.full_name;
            } else {
              profileMap[client.user_id] = 'Nama tidak ditemukan';
            }
          }
        }
        
        setProfileNames(profileMap);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Gagal mengambil data klien. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Fungsi untuk menyegarkan data
  const refreshData = async () => {
    try {
      setLoading(true);
      const items = await clientsAdminService.getAll();
      setClients(items);
      
      // Ambil nama lengkap untuk setiap klien
      const profileMap: Record<string, string> = {};
      const supabase = createClient();
      
      for (const client of items) {
        if (client.user_id) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', client.user_id)
            .single();
          
          if (!error && profile?.full_name) {
            profileMap[client.user_id] = profile.full_name;
          } else {
            profileMap[client.user_id] = 'Nama tidak ditemukan';
          }
        }
      }
      
      setProfileNames(profileMap);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Gagal mengambil data klien. Silakan coba lagi nanti.');
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentClient(null);
    setIsModalOpen(true);
  };



  const handleDelete = async (id: string) => {
    showAlertDialog(
      "Konfirmasi Penghapusan",
      "Apakah Anda yakin ingin menghapus klien ini? Tindakan ini tidak dapat dibatalkan.",
      async () => {
        try {
          const clientToDelete = clients.find(client => client.id === id);
          await clientsAdminService.delete(id);
          
          // Hapus item dari state
          const updatedClients = clients.filter(client => client.id !== id);
          setClients(updatedClients);
          
          // Hapus nama profil dari cache jika ada
          if (clientToDelete?.user_id) {
            const updatedProfileNames = { ...profileNames };
            delete updatedProfileNames[clientToDelete.user_id];
            setProfileNames(updatedProfileNames);
          }
          
          showAlertResult("Berhasil", "Klien telah dihapus.");
        } catch (err) {
          console.error('Error deleting client:', err);
          showAlertResult("Gagal", "Gagal menghapus klien. Silakan coba lagi.");
        }
      },
      "destructive"
    );
  };

  const handleStatusChange = async (id: string, newStatus: 'aktif' | 'tidak aktif' | 'pending') => {
    try {
      const clientToUpdate = clients.find(c => c.id === id)!;
      const updatedClient = await clientsAdminService.update({
        ...clientToUpdate,
        status: newStatus
      });
      // Update item di state
      setClients(clients.map(client => 
        client.id === id ? updatedClient : client
      ));
    } catch (err) {
      console.error('Error updating client status:', err);
      showAlertResult("Gagal", "Gagal memperbarui status klien. Silakan coba lagi.");
    }
  };

  const handleSave = async (clientData: ClientData) => {
    try {
      if (currentClient) {
        // Update existing client
        const updatedClient = await clientsAdminService.update({
          ...clientData,
          id: currentClient.id  // Menyertakan ID untuk update
        });
        
        // Update nama profil jika ada perubahan
        const updatedProfileNames = { ...profileNames };
        const supabase = createClient();
        
        if (updatedClient.user_id) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', updatedClient.user_id)
            .single();
          
          if (!error && profile?.full_name) {
            updatedProfileNames[updatedClient.user_id] = profile.full_name;
          } else {
            updatedProfileNames[updatedClient.user_id] = 'Nama tidak ditemukan';
          }
        }
        
        setProfileNames(updatedProfileNames);
        setClients(clients.map(c => c.id === currentClient.id ? updatedClient : c));
        showAlertResult("Berhasil", "Klien berhasil diperbarui.");
      } else {
        // Add new client
        // Pastikan user_id tidak null saat membuat klien baru
        if (!clientData.user_id) {
          showAlertResult("Gagal", "ID Pengguna wajib diisi.");
          return;
        }
        
        // Verifikasi bahwa user_id terhubung ke profil yang valid
        const supabase = createClient();
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', clientData.user_id)
          .single();
        
        if (error || !profile) {
          showAlertResult("Gagal", "ID Pengguna tidak terhubung ke profil yang valid.");
          return;
        }
        
        const newClient = await clientsAdminService.create({
          user_id: clientData.user_id, // Wajib sesuai skema
          phone: clientData.phone || null,
          company: clientData.company || null,
          join_date: clientData.join_date || null,
          project_count: clientData.project_count || 0,
          rating: clientData.rating || 0,
          status: clientData.status || 'pending'
        });
        
        // Tambahkan nama profil baru ke cache
        const updatedProfileNames = { ...profileNames };
        if (newClient.user_id) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', newClient.user_id)
            .single();
          
          if (!error && profile?.full_name) {
            updatedProfileNames[newClient.user_id] = profile.full_name;
          } else {
            updatedProfileNames[newClient.user_id] = 'Nama tidak ditemukan';
          }
        }
        
        setProfileNames(updatedProfileNames);
        setClients([...clients, newClient]);
        showAlertResult("Berhasil", "Klien baru berhasil ditambahkan.");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving client:', err);
      showAlertResult("Gagal", "Gagal menyimpan klien. Silakan coba lagi.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-white">Manajemen Klien</h1>
        <div className="mt-6 p-6 bg-red-900/20 border border-red-700/50 rounded-lg text-center">
          <p className="text-red-300">{error}</p>
          <Button 
            className="mt-4 bg-red-700 hover:bg-red-600"
            onClick={refreshData}
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  const filteredClients = clients.filter(client => {
    const profileName = profileNames[client.user_id || ''] || '';
    const matchesSearch = 
      (client.user_id && client.user_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      profileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.phone && client.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "semua" || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <div>
          <h1 className="text-3xl font-bold text-white">Manajemen Klien</h1>
          <p className="text-gray-300 mt-2">Kelola akun klien dan pengguna sistem</p>
        </div>
        <Button 
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 px-6" 
          onClick={handleAddNew}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Klien
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-4 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari ID pengguna, nama, perusahaan, atau telepon..."
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full pl-10 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800/90 border-gray-700 text-gray-200">
                <SelectItem value="semua">Semua Status</SelectItem>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="tidak aktif">Tidak Aktif</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-end space-x-2">
            <Badge variant="outline" className="text-xs">
              Total: {filteredClients.length} klien
            </Badge>
          </div>
        </div>
      </Card>

      {/* Clients List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50 hover:bg-white/10 transition-all duration-200">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-700/50 p-3 rounded-full">
                  <User className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{profileNames[client.user_id || ''] || 'Nama tidak ditemukan'}</h3>
                  <p className="text-gray-400 text-sm">ID: {client.user_id || 'Tidak ada ID'}</p>
                  <p className="text-gray-400 text-sm">{client.company || 'Perusahaan tidak diset'}</p>
                </div>
              </div>
              {client.rating !== null && client.rating > 0 && (
                <div className="flex items-center bg-gray-800/50 px-2 py-1 rounded">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-300 ml-1">{client.rating}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">{client.phone || 'Tidak ada nomor telepon'}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Bergabung: {client.join_date || 'Tanggal tidak diset'}</span>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge 
                variant="secondary" 
                className={`${
                  client.status === "aktif" 
                    ? "bg-green-900/30 text-green-400 border border-green-900/50" 
                    : client.status === "tidak aktif" 
                      ? "bg-red-900/30 text-red-400 border border-red-900/50" 
                      : "bg-yellow-900/30 text-yellow-400 border border-yellow-900/50"
                }`}
              >
                {client.status}
              </Badge>
              
              <Badge variant="outline" className="text-xs">
                Proyek: {client.project_count || 0}
              </Badge>
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = `/admin/clients/${client.id}`}
                className="border-blue-600/50 text-blue-400 hover:bg-blue-600/20"
              >
                Detail
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDelete(client.id)}
                className="border-red-600/50 text-red-400 hover:bg-red-600/20"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Hapus
              </Button>
              {client.status !== 'aktif' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStatusChange(client.id, 'aktif')}
                  className="border-green-600/50 text-green-400 hover:bg-green-600/20"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Aktifkan
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for adding/editing clients */}
      {isModalOpen && (
        <ClientModal 
          client={currentClient}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      
      {/* AlertDialog for confirmations */}
      <AlertDialog
        isOpen={alertDialogState.isOpen}
        title={alertDialogState.title}
        description={alertDialogState.description}
        onConfirm={() => {
          if (alertDialogState.onConfirm) alertDialogState.onConfirm();
          closeAlertDialog();
        }}
        onClose={closeAlertDialog}
        variant={alertDialogState.variant}
      />
      
      {/* AlertDialog for results/notifications */}
      <AlertDialogResult
        isOpen={alertResultState.isOpen}
        title={alertResultState.title}
        description={alertResultState.description}
        onClose={closeAlertResult}
      />
    </div>
  );
}

interface ClientModalProps {
  client: ClientData | null;
  onSave: (client: ClientData) => void;
  onClose: () => void;
}

function ClientModal({ client, onSave, onClose }: ClientModalProps) {
  const [formData, setFormData] = useState<ClientData>(
    client || {
      id: "",
      user_id: "",
      phone: null,
      company: null,
      join_date: new Date().toISOString().split('T')[0],
      project_count: 0,
      rating: 0,
      status: "aktif" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_contacted: null
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Untuk user_id, tidak boleh null
    if (name === "user_id") {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value || null }));
    }
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? null : Number(value);
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-gray-800/90 border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">
              {client ? "Edit Klien" : "Tambah Klien Baru"}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user_id" className="text-gray-300">ID Pengguna</Label>
                <Input
                  id="user_id"
                  name="user_id"
                  value={formData.user_id || ""}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                  required
                  readOnly
                />
              </div>
              
              <div>
                <Label htmlFor="company" className="text-gray-300">Perusahaan</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company || ""}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-gray-300">Telepon</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>
              
              <div>
                <Label htmlFor="join_date" className="text-gray-300">Tanggal Bergabung</Label>
                <Input
                  id="join_date"
                  name="join_date"
                  type="date"
                  value={formData.join_date || ""}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project_count" className="text-gray-300">Jumlah Proyek</Label>
                <Input
                  id="project_count"
                  name="project_count"
                  type="number"
                  value={formData.project_count || 0}
                  onChange={handleNumberInputChange}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>
              
              <div>
                <Label htmlFor="rating" className="text-gray-300">Rating</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating || 0}
                  onChange={handleNumberInputChange}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status" className="text-gray-300">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status || "aktif"}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'aktif' | 'tidak aktif' | 'pending' }))}
                  className="w-full bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 rounded-md px-3 py-2"
                >
                  <option value="aktif">Aktif</option>
                  <option value="tidak aktif">Tidak Aktif</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Batal
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Simpan
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
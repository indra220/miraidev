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
  Mail,
  Phone,
  Calendar,
  Filter,
  Edit,
  Trash2,
  Plus,
  Eye,
  Shield,
  Users,
  Star
} from "lucide-react";
import { clientsAdminService } from "@/lib/admin-service";
import { Client } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("semua");
  const [roleFilter, setRoleFilter] = useState<string>("semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil data klien dari API saat komponen dimuat
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const items = await clientsAdminService.getAll();
        setClients(items);
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

  const handleEdit = (client: Client) => {
    setCurrentClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus klien ini?")) {
      try {
        await clientsAdminService.delete(id);
        // Hapus item dari state
        setClients(clients.filter(client => client.id !== id));
      } catch (err) {
        console.error('Error deleting client:', err);
        alert('Gagal menghapus klien. Silakan coba lagi.');
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: 'aktif' | 'tidak aktif' | 'pending') => {
    try {
      const updatedClient = await clientsAdminService.update({
        ...clients.find(c => c.id === id)!,
        status: newStatus
      });
      // Update item di state
      setClients(clients.map(client => 
        client.id === id ? updatedClient : client
      ));
    } catch (err) {
      console.error('Error updating client status:', err);
      alert('Gagal memperbarui status klien. Silakan coba lagi.');
    }
  };

  const handleSave = async (client: Client) => {
    try {
      let savedClient: Client;
      if (currentClient) {
        // Update existing client
        savedClient = await clientsAdminService.update(client);
        setClients(clients.map(c => c.id === client.id ? savedClient : c));
      } else {
        // Add new client
        savedClient = await clientsAdminService.create({
          name: client.name,
          email: client.email,
          phone: client.phone,
          company: client.company,
          role: client.role,
          status: client.status,
          join_date: client.join_date,
          user_id: null, // Tambahkan user_id karena diperlukan oleh skema database
        });
        setClients([...clients, savedClient]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving client:', err);
      alert('Gagal menyimpan klien. Silakan coba lagi.');
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
    const matchesSearch = 
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "semua" || client.status === statusFilter;
    const matchesRole = roleFilter === "semua" || client.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari nama, email, atau perusahaan..."
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
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full pl-10 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800/90 border-gray-700 text-gray-200">
                <SelectItem value="semua">Semua Peran</SelectItem>
                <SelectItem value="klien">Klien</SelectItem>
                <SelectItem value="pegawai">Pegawai</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
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
                  <h3 className="font-bold text-lg text-white">{client.name}</h3>
                  <p className="text-gray-400 text-sm">{client.company}</p>
                </div>
              </div>
              {client.rating && client.rating > 0 && (
                <div className="flex items-center bg-gray-800/50 px-2 py-1 rounded">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-300 ml-1">{client.rating}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">{client.email}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">{client.phone}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Bergabung: {client.join_date}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Users className="h-4 w-4 mr-2" />
                <span className="text-sm">{client.project_count} proyek</span>
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
              <Badge 
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                {client.role}
              </Badge>
              {client.role === 'admin' && (
                <Badge 
                  variant="outline"
                  className="border-blue-600/50 text-blue-400"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEdit(client)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
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
    </div>
  );
}

interface ClientModalProps {
  client: Client | null;
  onSave: (client: Client) => void;
  onClose: () => void;
}

function ClientModal({ client, onSave, onClose }: ClientModalProps) {
  const [formData, setFormData] = useState<Client>(
    client || {
      id: 0,
      name: "",
      email: "",
      phone: null,
      company: null,
      role: "klien",
      status: "aktif",
      join_date: new Date().toISOString().split('T')[0],
      project_count: 0,
      rating: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: null
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value || null });
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
                <Label htmlFor="name" className="text-gray-300">Nama Lengkap</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
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
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>
              
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role" className="text-gray-300">Peran</Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as 'klien' | 'pegawai' | 'admin'})}
                  className="w-full bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 rounded-md px-3 py-2"
                >
                  <option value="klien">Klien</option>
                  <option value="pegawai">Pegawai</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="status" className="text-gray-300">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'aktif' | 'tidak aktif' | 'pending'})}
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
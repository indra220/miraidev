"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Building, 
  Star,
  Edit,
  Save,
  X
} from "lucide-react";
import { clientsAdminService } from "@/lib/admin-service";
import { ClientData } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/loading-spinner";

interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  role: string;
  updated_at: string;
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [client, setClient] = useState<ClientData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Detail Klien | MiraiDev";
  }, []);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        // Ambil data klien dari API
        const clientData = await clientsAdminService.getById(resolvedParams.id);
        
        if (!clientData) {
          setError("Klien tidak ditemukan");
          setLoading(false);
          return;
        }

        setClient(clientData);

        // Ambil data profil dari Supabase
        if (clientData.user_id) {
          const supabase = createClient();
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, email, role, updated_at')
            .eq('id', clientData.user_id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
          } else {
            setProfile(profileData);
          }
        }

        // Set initial edit data
        setEditData(clientData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching client data:', err);
        setError('Gagal mengambil data klien. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    fetchClientData();
  }, [params]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Batal edit, kembalikan ke data asli
      setEditData(client);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editData) {
      setEditData({
        ...editData,
        [name]: value
      });
    }
  };

  const handleSave = async () => {
    if (!editData) return;

    try {
      // Update data klien
      const updatedClient = await clientsAdminService.update(editData);
      setClient(updatedClient);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating client:', err);
      alert('Gagal menyimpan perubahan. Silakan coba lagi.');
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
        <h1 className="text-3xl font-bold text-white">Detail Klien</h1>
        <div className="mt-6 p-6 bg-red-900/20 border border-red-700/50 rounded-lg text-center">
          <p className="text-red-300">{error}</p>
          <Button 
            className="mt-4 bg-red-700 hover:bg-red-600"
            onClick={() => window.location.reload()}
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-white">Detail Klien</h1>
        <div className="mt-6 p-6 bg-red-900/20 border border-red-700/50 rounded-lg text-center">
          <p className="text-red-300">Klien tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Detail Klien</h1>
            <p className="text-gray-300 mt-2">
              {profile?.full_name || 'Nama tidak ditemukan'} (ID: {client.user_id})
            </p>
          </div>
          <Button 
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" 
            onClick={handleEditToggle}
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <User className="mr-2 h-5 w-5 text-blue-400" />
              Informasi Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-gray-500 mb-2" />
              <h3 className="text-lg font-bold text-white">{profile?.full_name || 'Nama tidak ditemukan'}</h3>
              <p className="text-gray-400">{profile?.role || 'Peran tidak ditemukan'}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-300">
                  {profile?.email || 'Email tidak ditemukan'}
                </span>
              </div>
              
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-300">
                  ID: {client.user_id}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Details Card */}
        <Card className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Building className="mr-2 h-5 w-5 text-blue-400" />
              Detail Klien
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company" className="text-gray-300">Perusahaan</Label>
                {isEditing ? (
                  <Input
                    id="company"
                    name="company"
                    value={editData?.company || ""}
                    onChange={handleInputChange}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 mt-1"
                  />
                ) : (
                  <p className="text-gray-300 mt-1">{client.company || '-'}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-gray-300">Telepon</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    name="phone"
                    value={editData?.phone || ""}
                    onChange={handleInputChange}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 mt-1"
                  />
                ) : (
                  <p className="text-gray-300 mt-1">{client.phone || '-'}</p>
                )}
              </div>
              
              <div>
                <Label className="text-gray-300">Tanggal Bergabung</Label>
                {isEditing ? (
                  <Input
                    id="join_date"
                    name="join_date"
                    type="date"
                    value={editData?.join_date || ""}
                    onChange={handleInputChange}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 mt-1"
                    readOnly
                  />
                ) : (
                  <p className="text-gray-300 mt-1">{client.join_date || '-'}</p>
                )}
              </div>
              
              <div>
                <Label className="text-gray-300">Jumlah Proyek</Label>
                {isEditing ? (
                  <Input
                    id="project_count"
                    name="project_count"
                    type="number"
                    value={editData?.project_count || 0}
                    onChange={handleInputChange}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 mt-1"
                    readOnly
                  />
                ) : (
                  <p className="text-gray-300 mt-1">{client.project_count || 0}</p>
                )}
              </div>
              
              <div>
                <Label className="text-gray-300">Rating</Label>
                {isEditing ? (
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editData?.rating || 0}
                    onChange={handleInputChange}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 mt-1"
                    readOnly
                  />
                ) : (
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-gray-300">{client.rating || 0}</span>
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="status" className="text-gray-300">Status</Label>
                {isEditing ? (
                  <select
                    id="status"
                    name="status"
                    value={editData?.status || "aktif"}
                    onChange={(e) => setEditData(prev => prev ? { ...prev, status: e.target.value as 'aktif' | 'tidak aktif' | 'pending' } : null)}
                    className="w-full bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 rounded-md px-3 py-2 mt-1"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="tidak aktif">Tidak Aktif</option>
                    <option value="pending">Pending</option>
                  </select>
                ) : (
                  <div className="mt-1">
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
                  </div>
                )}
              </div>
            </div>
            
            {isEditing && (
              <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleEditToggle}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <X className="mr-2 h-4 w-4" />
                  Batal
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  onClick={handleSave}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Perubahan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
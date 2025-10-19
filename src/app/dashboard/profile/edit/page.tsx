"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/auth-service";
import { User, Mail, Phone, Building2, Calendar, Edit3, Camera, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface UserData {
  id: string;
  email: string | null;
  user_metadata: {
    name?: string;
    avatar_url?: string;
  };
  full_name?: string;
  avatar_url?: string;
  role?: string;
  updated_at?: string;
}

interface ClientData {
  id: string;
  user_id: string;
  phone: string | null;
  company: string | null;
  join_date: string | null;
  project_count: number | null;
  rating: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { user: authUser, loading } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ general?: string }>({});

  useEffect(() => {
    if (loading) return;
    
    const fetchUserData = async () => {
      try {
        if (!authUser) {
          router.push("/auth/login");
          return;
        }

        // Konversi User dari Supabase ke format UserData
        const formattedUserData: UserData = {
          id: authUser.id,
          email: authUser.email || null,
          user_metadata: authUser.user_metadata || { name: "" },
          full_name: authUser.user_metadata?.full_name,
          avatar_url: authUser.user_metadata?.avatar_url,
          role: authUser.user_metadata?.role
        };
        setUser(formattedUserData);
        setName(formattedUserData.user_metadata?.name || formattedUserData.full_name || "");
        setEmail(formattedUserData.email || "");
        
        // Ambil detail lengkap dari tabel clients
        const supabase = createClient();
        const { data: clientData, error } = await supabase
          .from('clients')
          .select('id, user_id, phone, company, join_date, project_count, rating, status, created_at, updated_at')
          .eq('user_id', authUser.id) // Menggunakan user_id sebagai kunci penghubung ke tabel clients
          .single();

        if (error) {
          // Jika error bukan karena tidak ditemukannya data (record not found), tampilkan error
          if (error.code !== 'PGRST116') { // PGRST116 adalah kode error untuk record tidak ditemukan
            console.error("Error fetching client data:", error);
          }
        } else if (clientData) {
          setClientData(clientData);
          setPhone(clientData.phone || "");
          setCompany(clientData.company || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrors({ general: "Gagal mengambil data pengguna" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [authUser, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});

    try {
      const supabase = createClient();
      
      // Update profile di auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: name, // Menggunakan full_name sesuai dengan skema tabel profiles
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Update profile di tabel clients
      if (user) {
        // Cek apakah entri client sudah ada
        const { data: existingClient } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (existingClient) {
          // Jika sudah ada, lakukan update
          const { error } = await supabase
            .from('clients')
            .update({ 
              phone: phone,
              company: company
            })
            .eq('user_id', user.id);
          
          if (error) {
            throw new Error(error.message);
          }
        } else {
          // Jika belum ada, lakukan insert
          const { error } = await supabase
            .from('clients')
            .insert([{ 
              user_id: user.id,
              phone: phone,
              company: company
            }]);
          
          if (error) {
            throw new Error(error.message);
          }
        }
      }

      // Refresh user data
      const updatedUser = await getCurrentUser();
      if (updatedUser) {
        // Konversi User dari Supabase ke format UserData
        const formattedUpdatedUser: UserData = {
          id: updatedUser.id,
          email: updatedUser.email || null,
          user_metadata: updatedUser.user_metadata || { name: "" },
          full_name: updatedUser.user_metadata?.full_name,
          avatar_url: updatedUser.user_metadata?.avatar_url,
          role: updatedUser.user_metadata?.role
        };
        setUser(formattedUpdatedUser);
        
        // Refresh client data
        const supabase = createClient();
        const { data: updatedClientData, error } = await supabase
          .from('clients')
          .select('id, user_id, phone, company, join_date, project_count, rating, status, created_at, updated_at')
          .eq('user_id', updatedUser.id)
          .single();

        if (error) {
          // Jika error bukan karena tidak ditemukannya data (record not found), tampilkan error
          if (error.code !== 'PGRST116') {
            console.error("Error fetching updated client data:", error);
          }
        } else if (updatedClientData) {
          setClientData(updatedClientData);
        }
      }
      
      // Kembali ke halaman profile setelah berhasil menyimpan
      router.push('/dashboard/profile');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Gagal menyimpan perubahan profil" });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/profile');
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Profil</h1>
        <p className="text-muted-foreground">Ubah informasi akun Anda</p>
      </div>
      
      {/* Card untuk form edit profil */}
      <Card>
        <CardHeader className="flex items-center justify-center pb-2">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white dark:border-gray-800 flex items-center justify-center overflow-hidden">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <CardTitle className="mt-4 text-center">{name || user?.user_metadata?.name || "Pengguna"}</CardTitle>
          <p className="text-sm text-muted-foreground">{email}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-200 flex items-start">
                <span className="mr-2">⚠️</span> {errors.general}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Nama Lengkap
              </Label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground pl-9 py-2 focus:ring-ring focus:border-ring"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@contoh.com"
                  value={email}
                  disabled
                  className="bg-muted border-input text-muted-foreground placeholder:text-muted-foreground pl-9 py-2 cursor-not-allowed opacity-70"
                />
              </div>
              <p className="text-xs text-muted-foreground">Email tidak dapat diubah. Silakan hubungi admin untuk perubahan email.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Nomor Telepon
                </Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Nomor telepon Anda"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground pl-9 py-2 focus:ring-ring focus:border-ring"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company" className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Perusahaan
                </Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Nama perusahaan Anda"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground pl-9 py-2 focus:ring-ring focus:border-ring"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="joinDate" className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Tanggal Bergabung
                </Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="joinDate"
                    type="date"
                    value={clientData?.join_date ? new Date(clientData.join_date).toISOString().split('T')[0] : ''}
                    disabled
                    className="bg-muted border-input text-muted-foreground py-2 cursor-not-allowed opacity-70"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="projectCount" className="flex items-center">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Jumlah Proyek
                </Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Edit3 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="projectCount"
                    type="number"
                    value={clientData?.project_count || 0}
                    disabled
                    className="bg-muted border-input text-muted-foreground py-2 cursor-not-allowed opacity-70"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-[1.02] flex items-center justify-center shadow-lg"
              >
                {isSaving ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    Simpan Perubahan
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Card untuk pengaturan keamanan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-semibold">
            <Lock className="h-4 w-4 mr-2" />
            Keamanan Akun
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Ganti Kata Sandi</h3>
                <p className="text-sm text-muted-foreground">Perbarui kata sandi Anda secara berkala</p>
              </div>
              <Button variant="outline" onClick={() => router.push('/dashboard/account')}>Ganti</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Autentikasi Dua Faktor</h3>
                <p className="text-sm text-muted-foreground">Tambahkan lapisan keamanan tambahan</p>
              </div>
              <Button variant="outline" onClick={() => router.push('/dashboard/account')}>Aktifkan</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { createClient } from "@/lib/supabase/client";
import { User, Edit3, Lock, Camera } from "lucide-react";
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

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, loading } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [authUser, loading, router]);

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
        <h1 className="text-3xl font-bold">Profil Pengguna</h1>
        <p className="text-muted-foreground">
          Kelola informasi akun dan keamanan Anda
        </p>
      </div>
      
      {/* Card untuk informasi profil utama */}
      <Card>
        <CardHeader className="flex flex-col items-center justify-center pb-2">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white dark:border-gray-800 flex items-center justify-center overflow-hidden">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-center mt-4">
            <CardTitle className="text-2xl font-bold">{name || user?.user_metadata?.name || "Pengguna"}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{email}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Nomor Telepon</Label>
                <p id="phone" className="mt-1 text-muted-foreground">
                  {phone || '-'}
                </p>
              </div>
              <div>
                <Label htmlFor="company">Perusahaan</Label>
                <p id="company" className="mt-1 text-muted-foreground">
                  {company || '-'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="joinDate">Tanggal Bergabung</Label>
                <p id="joinDate" className="mt-1 text-muted-foreground">
                  {clientData?.join_date ? new Date(clientData.join_date).toLocaleDateString('id-ID') : '-'}
                </p>
              </div>
              
              <div>
                <Label htmlFor="projectCount">Jumlah Proyek</Label>
                <p id="projectCount" className="mt-1 text-muted-foreground">
                  {clientData?.project_count || 0}
                </p>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button 
                onClick={() => router.push('/dashboard/profile/edit')}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profil
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card untuk pengaturan keamanan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
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
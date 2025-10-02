"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  UserIcon, 
  MailIcon, 
  PhoneIcon, 
  BuildingIcon, 
  LockIcon,
  CameraIcon,
  CalendarIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService, DashboardProfile } from "@/lib/dashboard-service";

export function UserProfile() {
  const [profile, setProfile] = useState<DashboardProfile>({
    name: "",
    email: "",
    phone: "",
    company: "",
    joinDate: "",
    avatar: "/placeholder-avatar.jpg"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return; // Jika auth masih loading, jangan lanjutkan
    
    const fetchProfile = async () => {
      if (session?.user) {
        try {
          const userProfile = await dashboardService.getDashboardData(session.user.id);
          setProfile(userProfile.profile);
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, authLoading]);

  const handleSave = async () => {
    setIsEditing(false);
    if (session?.user) {
      // Implementasi penyimpanan perubahan profil ke database
      try {
        // Tambahkan logika untuk menyimpan ke database di sini
      } catch (error) {
        console.error("Error saving profile:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Profil Akun</h2>
        <p className="text-sm text-muted-foreground">Kelola informasi akun Anda</p>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-center pb-2">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white dark:border-gray-800 flex items-center justify-center overflow-hidden">
              <img 
                src={profile.avatar} 
                alt="Avatar" 
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // Cek apakah ini sudah merupakan placeholder
                  if (target.src.includes('/placeholder-avatar.jpg')) {
                    // Jika placeholder juga gagal, gunakan SVG inline sebagai fallback
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNkMWQ1ZGIiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjQwIiByPSIxNSIgZmlsbD0iIzg4OCIvPjxwYXRoIGQ9Ik0yNSA4MGMyMCAyMCA2MCAyMCA4MCAwIiBzdHJva2U9IiM4ODgiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==';
                  } else {
                    // Jika bukan placeholder, arahkan ke placeholder
                    target.src = "/placeholder-avatar.jpg";
                  }
                }}
              />
            </div>
            <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
              <CameraIcon className="w-4 h-4" />
            </Button>
          </div>
          <CardTitle className="mt-4 text-center">{profile.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative mt-1">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    name="name"
                    value={profile.name} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <MailIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    name="email"
                    type="email"
                    value={profile.email} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Nomor Telepon</Label>
                <div className="relative mt-1">
                  <PhoneIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    name="phone"
                    value={profile.phone} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="company">Perusahaan</Label>
                <div className="relative mt-1">
                  <BuildingIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="company" 
                    name="company"
                    value={profile.company} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="joinDate">Tanggal Bergabung</Label>
              <div className="relative mt-1">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="joinDate" 
                  value={profile.joinDate ? new Date(profile.joinDate).toLocaleDateString('id-ID') : ''} 
                  disabled={true}
                  className="pl-9"
                />
              </div>
            </div>
            
            {isEditing ? (
              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSave}>Simpan Perubahan</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Batal</Button>
              </div>
            ) : (
              <Button className="mt-4" onClick={() => setIsEditing(true)}>
                <LockIcon className="h-4 w-4 mr-2" />
                Edit Profil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LockIcon className="h-4 w-4 mr-2" />
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
              <Button variant="outline">Ganti</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Autentikasi Dua Faktor</h3>
                <p className="text-sm text-muted-foreground">Tambahkan lapisan keamanan tambahan</p>
              </div>
              <Button variant="outline">Aktifkan</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
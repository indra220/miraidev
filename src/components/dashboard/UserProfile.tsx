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
import { useState } from "react";

export function UserProfile() {
  const [profile, setProfile] = useState({
    name: "Nama Klien",
    email: "email@klien.com",
    phone: "+62 812-3456-7890",
    company: "Nama Perusahaan",
    joinDate: "2024-01-15",
    avatar: "/placeholder-avatar.jpg"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Implementasi penyimpanan perubahan profil
    // console.log("Profil disimpan:", profile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

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
              <UserIcon className="w-12 h-12 text-gray-500" />
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
                  value={profile.joinDate} 
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
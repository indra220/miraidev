"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Camera, User, Mail, Phone, MapPin, Building, Globe } from "lucide-react";

export default function UserProfile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+62 812 3456 7890",
    company: "Kedai Kopi Nusantara",
    position: "Pemilik",
    address: "Jl. Kopi No. 123, Jakarta",
    website: "https://kedai-kopi-nusantara.com",
    bio: "Pemilik kedai kopi yang sedang mengembangkan bisnis dengan kehadiran digital. Bersemangat untuk memberikan pengalaman terbaik kepada pelanggan melalui website yang informatif dan menarik."
  });

  const [avatar, setAvatar] = useState("/placeholder-avatar.jpg");

  const handleSave = () => {
    // Implement save logic here
    console.log("Profile saved:", profile);
    alert("Profil berhasil disimpan!");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profil Saya</h1>
        <p className="text-gray-600 mt-2">Kelola informasi profil Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="h-4 w-4 text-white" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-4">{profile.name}</h2>
            <p className="text-gray-600">{profile.position}</p>
            <p className="text-gray-600 text-sm">{profile.company}</p>
          </div>
        </Card>

        {/* Profile Information */}
        <Card className="p-6 lg:col-span-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Pribadi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telepon</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Perusahaan</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="position">Posisi</Label>
                  <Input
                    id="position"
                    value={profile.position}
                    onChange={(e) => handleChange("position", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Tambahan</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      <Globe className="h-4 w-4" />
                    </span>
                    <Input
                      id="website"
                      value={profile.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Biografi</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSave}
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Keamanan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentPassword">Password Saat Ini</Label>
            <Input
              id="currentPassword"
              type="password"
            />
          </div>
          <div>
            <Label htmlFor="newPassword">Password Baru</Label>
            <Input
              id="newPassword"
              type="password"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
            <Input
              id="confirmPassword"
              type="password"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" className="mr-2">
            Batal
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Ubah Password
          </Button>
        </div>
      </Card>
    </div>
  );
}
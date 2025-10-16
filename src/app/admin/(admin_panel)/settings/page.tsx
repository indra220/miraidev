"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function SettingsPage() {
  useEffect(() => {
    document.title = "Pengaturan";
  }, []);
  const [settings, setSettings] = useState({
    siteName: "MiraiDev",
    siteDescription: "Solusi pengembangan website modern untuk UMKM dan profesional lokal",
    adminEmail: "admin@miraidev.id",
    contactEmail: "hello@miraidev.id",
    phone: "+62 812 3456 7890",
    address: "Jl. Teknologi No. 123, Jakarta",
    socialMedia: {
      facebook: "https://facebook.com/miraidev",
      twitter: "https://twitter.com/miraidev",
      instagram: "https://instagram.com/miraidev",
      linkedin: "https://linkedin.com/company/miraidev"
    }
  });

  const handleSave = () => {
    // Implement save logic here
    alert("Pengaturan berhasil disimpan!");
  };

  const handleChange = (field: string, value: string) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setSettings({
      ...settings,
      socialMedia: {
        ...settings.socialMedia,
        [platform]: value
      }
    });
  };

  return (
    <>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
          <h1 className="text-3xl font-bold text-white">Pengaturan</h1>
          <p className="text-gray-300 mt-2">Kelola pengaturan situs web Anda</p>
        </div>

      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Informasi Situs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="siteName" className="text-gray-300">Nama Situs</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="siteDescription" className="text-gray-300">Deskripsi Situs</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleChange("siteDescription", e.target.value)}
                  rows={3}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Kontak</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="adminEmail" className="text-gray-300">Email Admin</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleChange("adminEmail", e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail" className="text-gray-300">Email Kontak</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-300">Telepon</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="address" className="text-gray-300">Alamat</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Media Sosial</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook" className="text-gray-300">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.socialMedia.facebook}
                  onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="twitter" className="text-gray-300">Twitter</Label>
                <Input
                  id="twitter"
                  value={settings.socialMedia.twitter}
                  onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="instagram" className="text-gray-300">Instagram</Label>
                <Input
                  id="instagram"
                  value={settings.socialMedia.instagram}
                  onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="linkedin" className="text-gray-300">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={settings.socialMedia.linkedin}
                  onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 px-6"
              onClick={handleSave}
            >
              Simpan Pengaturan
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </>
);
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Save,
  Globe,
  Palette,
  Shield,
  Database,
  Zap,
  Mail,
  Lock,
  Bell
} from "lucide-react";
import { AlertDialog, AlertDialogResult } from "@/components/AlertDialog";
import { useDialog } from "@/hooks/useDialog";



interface FormGeneralSettings {
  id: number;
  siteName: string | null;
  siteDescription: string | null;
  siteUrl: string | null;
  adminEmail: string | null;
  contactEmail: string | null;
  phone: string | null;
  address: string | null;
  maintenanceMode: boolean | null;
  analyticsEnabled: boolean | null;
  theme: string | null;
  maxUploadSize: number | null;
}

export default function GeneralSettingsPage() {
  const { 
    alertDialogState, 
    showAlertDialog, 
    closeAlertDialog,
    alertResultState,
    showAlertResult,
    closeAlertResult
  } = useDialog();
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _showAlertDialog = showAlertDialog; // Gunakan variabel untuk menghindari error ESLint
  
  const [settings, setSettings] = useState<FormGeneralSettings>({
    id: 1,
    siteName: "MiraiDev",
    siteDescription: "Agensi pengembangan website modern dan inovatif",
    siteUrl: "https://miraidev.id",
    adminEmail: "admin@miraidev.id",
    contactEmail: "info@miraidev.id",
    phone: "+6281234567890",
    address: "Jl. Contoh No. 123, Jakarta, Indonesia",
    maintenanceMode: false,
    analyticsEnabled: true,
    theme: "dark",
    maxUploadSize: 10
  });

  const [activeTab, setActiveTab] = useState<string>("general");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSwitchChange = (name: keyof FormGeneralSettings) => {
    const currentValue = settings[name];
    if (typeof currentValue === 'boolean') {
      setSettings({ ...settings, [name]: !currentValue });
    } else if (currentValue === null || currentValue === undefined) {
      setSettings({ ...settings, [name]: true });
    } else {
      setSettings({ ...settings, [name]: !currentValue });
    }
  };

  const handleSave = () => {
    // Simulasi penyimpanan pengaturan
    
    // Tampilkan notifikasi sukses
    showAlertResult("Berhasil", "Pengaturan berhasil disimpan!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-white">Pengaturan Umum</h1>
        <p className="text-gray-300 mt-2">Atur konfigurasi umum website MiraiDev</p>
      </div>

      {/* Tabs Navigation */}
      <Card className="p-2 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "general" 
                ? "bg-blue-600 text-white" 
                : "text-gray-400 hover:bg-gray-700/50"
            }`}
            onClick={() => setActiveTab("general")}
          >
            <Globe className="h-4 w-4 mr-2 inline" />
            Umum
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "appearance" 
                ? "bg-blue-600 text-white" 
                : "text-gray-400 hover:bg-gray-700/50"
            }`}
            onClick={() => setActiveTab("appearance")}
          >
            <Palette className="h-4 w-4 mr-2 inline" />
            Penampilan
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "security" 
                ? "bg-blue-600 text-white" 
                : "text-gray-400 hover:bg-gray-700/50"
            }`}
            onClick={() => setActiveTab("security")}
          >
            <Shield className="h-4 w-4 mr-2 inline" />
            Keamanan
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "email" 
                ? "bg-blue-600 text-white" 
                : "text-gray-400 hover:bg-gray-700/50"
            }`}
            onClick={() => setActiveTab("email")}
          >
            <Mail className="h-4 w-4 mr-2 inline" />
            Email
          </button>
        </div>
      </Card>

      {/* Settings Form */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        {activeTab === "general" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Pengaturan Umum
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="siteName" className="text-gray-300">Nama Situs</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={settings.siteName || ""}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Nama yang akan muncul di seluruh situs</p>
              </div>
              
              <div>
                <Label htmlFor="siteUrl" className="text-gray-300">URL Situs</Label>
                <Input
                  id="siteUrl"
                  name="siteUrl"
                  value={settings.siteUrl || ""}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Alamat utama website Anda</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="siteDescription" className="text-gray-300">Deskripsi Situs</Label>
              <Textarea
                id="siteDescription"
                name="siteDescription"
                value={settings.siteDescription || ""}
                onChange={handleInputChange}
                rows={3}
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Deskripsi singkat tentang situs Anda</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="adminEmail" className="text-gray-300">Email Admin</Label>
                <Input
                  id="adminEmail"
                  name="adminEmail"
                  type="email"
                  value={settings.adminEmail || ""}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email untuk notifikasi admin</p>
              </div>
              
              <div>
                <Label htmlFor="contactEmail" className="text-gray-300">Email Kontak</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={settings.contactEmail || ""}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email untuk kontak umum</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone" className="text-gray-300">Nomor Telepon</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={settings.phone || ""}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Nomor kontak utama</p>
              </div>
              
              <div>
                <Label htmlFor="address" className="text-gray-300">Alamat</Label>
                <Input
                  id="address"
                  name="address"
                  value={settings.address || ""}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Alamat fisik perusahaan</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <div>
                <Label className="text-gray-300 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                  Mode Perawatan
                </Label>
                <p className="text-xs text-gray-500">Nonaktifkan situs untuk perawatan</p>
              </div>
              <Switch
                checked={!!settings.maintenanceMode}
                onCheckedChange={() => handleSwitchChange("maintenanceMode")}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <div>
                <Label className="text-gray-300 flex items-center">
                  <Database className="h-4 w-4 mr-2 text-green-400" />
                  Aktifkan Analitik
                </Label>
                <p className="text-xs text-gray-500">Kumpulkan data analitik pengunjung</p>
              </div>
              <Switch
                checked={!!settings.analyticsEnabled}
                onCheckedChange={() => handleSwitchChange("analyticsEnabled")}
              />
            </div>
          </div>
        )}
        
        {activeTab === "appearance" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Pengaturan Penampilan
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-300">Tema</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <button 
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                      (settings.theme || "") === "dark" 
                        ? "border-blue-500 bg-blue-900/20" 
                        : "border-gray-600 bg-gray-800/50"
                    }`}
                    onClick={() => setSettings({...settings, theme: "dark"})}
                  >
                    <div className="w-8 h-8 bg-gray-900 rounded mb-2"></div>
                    <span className="text-sm">Tema Gelap</span>
                  </button>
                  <button 
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                      (settings.theme || "") === "light" 
                        ? "border-blue-500 bg-blue-900/20" 
                        : "border-gray-600 bg-gray-800/50"
                    }`}
                    onClick={() => setSettings({...settings, theme: "light"})}
                  >
                    <div className="w-8 h-8 bg-white rounded mb-2"></div>
                    <span className="text-sm">Tema Terang</span>
                  </button>
                </div>
              </div>
              
              <div>
                <Label className="text-gray-300">Ukuran Maks Upload (MB)</Label>
                <Input
                  type="number"
                  value={settings.maxUploadSize || 0}
                  onChange={(e) => setSettings({...settings, maxUploadSize: parseInt(e.target.value) || 0})}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Ukuran maksimum file media yang diunggah</p>
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300">Warna Aksen</Label>
              <div className="flex space-x-2 mt-2">
                {["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"].map((color) => (
                  <div 
                    key={color}
                    className="w-8 h-8 rounded-full cursor-pointer border-2 border-transparent hover:border-white"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "security" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Pengaturan Keamanan
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div>
                  <Label className="text-gray-300 flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-red-400" />
                    Otentikasi Dua Faktor
                  </Label>
                  <p className="text-xs text-gray-500">Tambahkan lapisan keamanan tambahan</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div>
                  <Label className="text-gray-300 flex items-center">
                    <Bell className="h-4 w-4 mr-2 text-yellow-400" />
                    Notifikasi Login
                  </Label>
                  <p className="text-xs text-gray-500">Dapatkan notifikasi saat login</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div>
                <Label className="text-gray-300">Kebijakan Kata Sandi</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="minLength" defaultChecked className="mr-2" />
                    <Label htmlFor="minLength" className="text-gray-300">Minimal 8 karakter</Label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="requireNumber" defaultChecked className="mr-2" />
                    <Label htmlFor="requireNumber" className="text-gray-300">Harus mengandung angka</Label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="requireSymbol" className="mr-2" />
                    <Label htmlFor="requireSymbol" className="text-gray-300">Harus mengandung simbol</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "email" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Pengaturan Email
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="smtpHost" className="text-gray-300">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  placeholder="smtp.gmail.com"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>
              
              <div>
                <Label htmlFor="smtpPort" className="text-gray-300">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  placeholder="587"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="smtpUser" className="text-gray-300">SMTP User</Label>
                <Input
                  id="smtpUser"
                  placeholder="your-email@gmail.com"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>
              
              <div>
                <Label htmlFor="smtpPassword" className="text-gray-300">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  placeholder="••••••••"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300">Template Email</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded">
                  <span className="text-gray-300">Email Konfirmasi</span>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700/50">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded">
                  <span className="text-gray-300">Email Notifikasi</span>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700/50">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded">
                  <span className="text-gray-300">Email Kontak Baru</span>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700/50">Edit</Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Simpan Pengaturan
          </Button>
        </div>
      </Card>
      
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
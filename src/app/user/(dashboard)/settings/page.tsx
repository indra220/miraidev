"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { createSupabaseClient } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/loading-spinner";
import { 
  Key, 
  Bell, 
  Shield, 
  Palette, 
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function UserSettings() {
  const [activeTab, setActiveTab] = useState<"account" | "security" | "notifications" | "appearance">("account");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // State untuk account settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  // State untuk security settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // State untuk appearance settings
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");

  const handleSaveAccountSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulasi penyimpanan pengaturan akun
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess("Pengaturan akun berhasil disimpan");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error saving account settings:", error);
      setError("Gagal menyimpan pengaturan akun. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecuritySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validasi password
    if (newPassword !== confirmPassword) {
      setError("Kata sandi baru dan konfirmasi tidak cocok");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Kata sandi baru minimal 6 karakter");
      setLoading(false);
      return;
    }

    try {
      const supabase = createSupabaseClient();
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccess("Kata sandi berhasil diperbarui");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Gagal memperbarui kata sandi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotificationSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulasi penyimpanan pengaturan notifikasi
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess("Pengaturan notifikasi berhasil disimpan");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error saving notification settings:", error);
      setError("Gagal menyimpan pengaturan notifikasi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAppearanceSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulasi penyimpanan pengaturan tampilan
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess("Pengaturan tampilan berhasil disimpan");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error saving appearance settings:", error);
      setError("Gagal menyimpan pengaturan tampilan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "account", label: "Akun", icon: Key },
    { id: "security", label: "Keamanan", icon: Shield },
    { id: "notifications", label: "Notifikasi", icon: Bell },
    { id: "appearance", label: "Tampilan", icon: Palette }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Pengaturan</h1>
        <p className="text-gray-400 mt-2">
          Kelola pengaturan akun dan preferensi Anda
        </p>
      </div>

      <Card className="bg-white/5 backdrop-blur-sm border border-gray-700/50">
        {/* Tab Navigation */}
        <div className="border-b border-gray-700/50">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "account" | "security" | "notifications" | "appearance")}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-700/50 text-red-300 text-sm rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-900/30 border border-green-700/50 text-green-300 text-sm rounded-lg">
              {success}
            </div>
          )}

          {/* Account Settings */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Pengaturan Akun</h2>
              <form onSubmit={handleSaveAccountSettings} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value="user@example.com"
                    disabled
                    className="mt-1 bg-gray-700/50 border-gray-600 text-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email tidak dapat diubah
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 px-6 transition-all duration-150 hover:scale-[1.02]"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Keamanan</h2>
              <form onSubmit={handleSaveSecuritySettings} className="space-y-6">
                <div>
                  <Label htmlFor="currentPassword" className="text-gray-300">
                    Kata Sandi Saat Ini
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="bg-gray-700/50 border-gray-600 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-gray-300">
                    Kata Sandi Baru
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="bg-gray-700/50 border-gray-600 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-300">
                    Konfirmasi Kata Sandi Baru
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-gray-700/50 border-gray-600 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 px-6 transition-all duration-150 hover:scale-[1.02]"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Notifikasi</h2>
              <form onSubmit={handleSaveNotificationSettings} className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/30">
                  <div>
                    <h3 className="font-medium text-white">Email</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Terima notifikasi melalui email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/30">
                  <div>
                    <h3 className="font-medium text-white">SMS</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Terima notifikasi melalui SMS
                    </p>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 px-6 transition-all duration-150 hover:scale-[1.02]"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Tampilan</h2>
              <form onSubmit={handleSaveAppearanceSettings} className="space-y-6">
                <div>
                  <Label className="text-gray-300">Tema</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setTheme("light")}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === "light"
                          ? "border-blue-500 bg-blue-900/20"
                          : "border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="w-full h-24 bg-gradient-to-br from-gray-200 to-gray-100 rounded mb-2"></div>
                      <span className="text-sm font-medium text-gray-300">Terang</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === "dark"
                          ? "border-blue-500 bg-blue-900/20"
                          : "border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="w-full h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded mb-2"></div>
                      <span className="text-sm font-medium text-gray-300">Gelap</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme("system")}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === "system"
                          ? "border-blue-500 bg-blue-900/20"
                          : "border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="w-full h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded mb-2"></div>
                      <span className="text-sm font-medium text-gray-300">Sistem</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 px-6 transition-all duration-150 hover:scale-[1.02]"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
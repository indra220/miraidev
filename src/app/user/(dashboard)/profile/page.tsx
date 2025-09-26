"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { createSupabaseClient } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Save, Camera } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  phone?: string;
  company?: string;
  bio?: string;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Dalam implementasi nyata, Anda akan mengambil data profile dari database
          // Untuk sekarang kita akan menggunakan data dari session
          setProfile({
            id: session.user.id,
            email: session.user.email || "",
            name: (session.user.user_metadata?.name as string) || "User",
            role: (session.user.user_metadata?.role as "user" | "admin") || "user",
            phone: (session.user.user_metadata?.phone as string) || "",
            company: (session.user.user_metadata?.company as string) || "",
            bio: (session.user.user_metadata?.bio as string) || ""
          });
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Gagal memuat profil pengguna");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createSupabaseClient();
      
      if (profile) {
        // Update user metadata
        const { error } = await supabase.auth.updateUser({
          data: {
            name: profile.name,
            phone: profile.phone,
            company: profile.company,
            bio: profile.bio
          }
        });

        if (error) {
          throw new Error(error.message);
        }

        setSuccess("Profil berhasil diperbarui");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Gagal memperbarui profil. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    if (profile) {
      setProfile({
        ...profile,
        [field]: value
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Profil tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Profil Saya</h1>
        <p className="text-gray-400 mt-2">
          Kelola informasi pribadi Anda
        </p>
      </div>

      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-gray-700 rounded-full border-2 border-gray-800 hover:bg-gray-600 transition-colors">
              <Camera className="h-4 w-4 text-gray-300" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            <p className="text-gray-400">{profile.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={`px-3 py-1 text-xs rounded-full border ${
                profile.role === 'admin' 
                  ? 'bg-red-900/30 text-red-400 border-red-900/50' 
                  : 'bg-blue-900/30 text-blue-400 border-blue-900/50'
              }`}>
                {profile.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
          </div>
        </div>

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

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-gray-300">
                Nama Lengkap
              </Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="mt-1 bg-gray-700/50 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="mt-1 bg-gray-700/50 border-gray-600 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email tidak dapat diubah
              </p>
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-300">
                Nomor Telepon
              </Label>
              <Input
                id="phone"
                value={profile.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="mt-1 bg-gray-700/50 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="company" className="text-gray-300">
                Perusahaan
              </Label>
              <Input
                id="company"
                value={profile.company || ""}
                onChange={(e) => handleChange("company", e.target.value)}
                className="mt-1 bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio" className="text-gray-300">
              Bio
            </Label>
            <textarea
              id="bio"
              value={profile.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={4}
              className="w-full mt-1 bg-gray-700/50 border-gray-600 text-white rounded-md px-3 py-2 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ceritakan sedikit tentang diri Anda..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 px-6 transition-all duration-150 hover:scale-[1.02]"
            >
              {saving ? (
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
      </Card>
    </div>
  );
}
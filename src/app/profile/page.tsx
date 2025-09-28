"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { createSupabaseClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth-service";
import { User, Mail, Phone, Building2 } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ general?: string }>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        if (!userData) {
          router.push("/auth/login");
          return;
        }

        setUser(userData);
        setName(userData.user_metadata?.name || "");
        setEmail(userData.email || "");
        
        // Ambil detail lengkap dari tabel clients
        const supabase = createSupabaseClient();
        const { data: clientData, error } = await supabase
          .from('clients')
          .select('phone, company')
          .eq('id', userData.id)
          .single();

        if (error) {
          console.error("Error fetching client data:", error);
        } else if (clientData) {
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
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});

    try {
      const supabase = createSupabaseClient();
      
      // Update profile di auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name: name,
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Update profile di tabel clients
      if (user) {
        const { error: clientError } = await supabase
          .from('clients')
          .update({ 
            phone: phone,
            company: company
          })
          .eq('id', user.id);

        if (clientError) {
          throw new Error(clientError.message);
        }
      }

      // Refresh user data
      const updatedUser = await getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="bg-white/10 backdrop-blur-md border border-gray-700 shadow-xl rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <User className="w-6 h-6 mr-2" />
            Profil Pengguna
          </CardTitle>
          <p className="text-gray-400">Kelola informasi akun Anda</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-200 flex items-start">
                <span className="mr-2">⚠️</span> {errors.general}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Nama Lengkap
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 pl-10 py-6 focus:ring-blue-500/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@contoh.com"
                  value={email}
                  disabled
                  className="bg-gray-800/30 border-gray-600 text-gray-300 placeholder:text-gray-500 pl-10 py-6 cursor-not-allowed opacity-70"
                />
              </div>
              <p className="text-xs text-gray-500">Email tidak dapat diubah. Silakan hubungi admin untuk perubahan email.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Nomor Telepon
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-500" />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Nomor telepon Anda"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 pl-10 py-6 focus:ring-blue-500/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-300 flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                Perusahaan
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-500" />
                </div>
                <Input
                  id="company"
                  type="text"
                  placeholder="Nama perusahaan Anda"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 pl-10 py-6 focus:ring-blue-500/30"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 mt-4 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center shadow-lg"
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
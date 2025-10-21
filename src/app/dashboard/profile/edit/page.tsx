// src/app/dashboard/profile/edit/page.tsx
"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Impor dipertahankan
import { Label } from "@/components/ui/label"; // Impor dipertahankan
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { createClient } from "@/lib/supabase/client";
import {
  User as UserIcon,
  Mail,
  Phone as PhoneIcon,
  Building2 as BuildingIcon,
  Camera,
  Eye,
  EyeOff,
  Save,
  ShieldAlert,
  ShieldCheck, // Keep ShieldCheck for verified status
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { toast } from "sonner";
import { FormError } from "@/components/form-error";

// --- Interface Data Pengguna & Klien ---
interface UserData {
  id: string;
  email: string | null;
  email_confirmed_at: string | null; // Pastikan ini ada
  user_metadata: {
    name?: string;
    avatar_url?: string;
    full_name?: string;
    [key: string]: unknown;
  };
  full_name?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  updated_at?: string | null;
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
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [clientData, setClientData] = useState<ClientData | null>(null);

  // State Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    company?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
    general?: string;
    email?: string;
  }>({});
  const hasFetched = useRef(false);

  // State Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // State Verifikasi Email (Tombol Kirim Ulang Dihapus)
  // const [isResending, setIsResending] = useState(false); // Hapus state ini

  useEffect(() => {
    document.title = "Edit Profil | MiraiDev";
  }, []);

  useEffect(() => {
    if (authLoading || hasFetched.current) return;

    const fetchUserData = async () => {
      if (!hasFetched.current) {
         setIsLoading(true);
      }
      try {
        if (!authUser) {
          router.push("/auth/login");
          return;
        }

        hasFetched.current = true;

        const supabase = createClient();
        const { data: { user: currentUserData }, error: getUserError } = await supabase.auth.getUser();

        if (getUserError || !currentUserData) {
            console.error("Error fetching current user for edit:", getUserError);
            router.push("/auth/login");
            return;
        }

        const formattedUserData: UserData = {
          id: currentUserData.id,
          email: currentUserData.email || null,
          email_confirmed_at: currentUserData.email_confirmed_at || null, // Ambil status konfirmasi
          user_metadata: currentUserData.user_metadata || {},
          full_name: currentUserData.user_metadata?.full_name ?? currentUserData.user_metadata?.name ?? null,
          avatar_url: currentUserData.user_metadata?.avatar_url ?? null,
          role: currentUserData.user_metadata?.role ?? null,
          updated_at: currentUserData.updated_at ?? null,
        };

        setUser(formattedUserData);
        setName(formattedUserData.user_metadata?.full_name || formattedUserData.user_metadata?.name || "");
        setEmail(formattedUserData.email || "");
        setOriginalEmail(formattedUserData.email || "");

        const { data: clientDetails, error: clientError } = await supabase
          .from('clients')
          .select('id, user_id, phone, company, join_date, project_count, rating, status, created_at, updated_at')
          .eq('user_id', currentUserData.id)
          .single();

        if (clientError && clientError.code !== 'PGRST116') {
          console.error("Error fetching client data:", clientError);
        } else if (clientDetails) {
          setClientData(clientDetails);
          setPhone(clientDetails.phone || "");
          setCompany(clientDetails.company || "");
        }
      } catch (error) {
        console.error("Error fetching user data for edit:", error);
        setErrors({ general: "Gagal mengambil data pengguna" });
        hasFetched.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [authUser, authLoading, router, isLoading]);

  const isEmailVerified = !!user?.email_confirmed_at;
  const isEmailChanged = email !== originalEmail;

  // Hapus Fungsi handleResendVerification karena tombolnya dihapus
  /*
  const handleResendVerification = async () => {
      // ... (kode sebelumnya dihapus)
  };
  */

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    let formIsValid = true;

    if (!currentPassword) {
      setErrors(prev => ({ ...prev, currentPassword: "Kata sandi saat ini wajib diisi untuk menyimpan perubahan." }));
      formIsValid = false;
    }

    if (newPassword || confirmNewPassword) {
      if (newPassword.length < 6) {
        setErrors(prev => ({ ...prev, newPassword: "Kata sandi baru minimal 6 karakter" }));
        formIsValid = false;
      }
      if (newPassword !== confirmNewPassword) {
        setErrors(prev => ({ ...prev, confirmNewPassword: "Konfirmasi kata sandi baru tidak cocok" }));
        formIsValid = false;
      }
    }

    if (isEmailChanged && !/\S+@\S+\.\S+/.test(email)) {
        setErrors(prev => ({ ...prev, email: "Format email baru tidak valid." }));
        formIsValid = false;
    }

    if (!formIsValid) {
        toast.error("Validasi Gagal", { description: "Periksa kembali form Anda, ada data yang belum valid."});
        return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();

      if (!originalEmail) {
        throw new Error("Email pengguna tidak ditemukan. Tidak dapat memverifikasi kata sandi.");
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: originalEmail,
        password: currentPassword,
      });

      if (signInError) {
        setErrors({ currentPassword: "Kata sandi saat ini salah." });
        throw new Error("Verifikasi kata sandi saat ini gagal.");
      }

      let profileUpdated = false;
      let passwordUpdated = false;
      let emailUpdatePending = false;

      const authUpdateData: { email?: string; password?: string; data?: { full_name: string; name: string } } = {};
      const isPasswordChanged = newPassword.length > 0;
      const isNameChanged = name !== (user?.user_metadata?.full_name || user?.user_metadata?.name || "");

      if (isEmailChanged) authUpdateData.email = email;
      if (isPasswordChanged) authUpdateData.password = newPassword;
      if (isNameChanged) authUpdateData.data = { full_name: name, name: name };

      if (Object.keys(authUpdateData).length > 0) {
        // PERHATIAN: Memanggil updateUser akan otomatis mengirim verifikasi ke email BARU jika email diubah.
        const { error: authError } = await supabase.auth.updateUser(authUpdateData);

        if (authError) {
           if (authError.message.includes("Email rate limit exceeded")) {
                 setErrors({ email: "Terlalu banyak permintaan ganti email. Coba lagi nanti." });
           } else if (authError.message.includes("User already registered")) {
                 setErrors({ email: "Email baru tersebut sudah terdaftar." });
           } else {
                 setErrors({ general: `Auth Error: ${authError.message}` });
           }
           throw new Error("Update data autentikasi gagal.");
        }

        if (isEmailChanged) emailUpdatePending = true;
        if (isPasswordChanged) passwordUpdated = true;
        if (isNameChanged) profileUpdated = true;

         if (isNameChanged && user) {
            await supabase.from('profiles').update({ full_name: name }).eq('id', user.id);
         }
      }

      const isPhoneChanged = phone !== (clientData?.phone || "");
      const isCompanyChanged = company !== (clientData?.company || "");

       if (isPhoneChanged || isCompanyChanged) {
           if (user) {
               const { data: existingClient, error: checkError } = await supabase
                   .from('clients')
                   .select('id')
                   .eq('user_id', user.id)
                   .maybeSingle();

               if (checkError && checkError.code !== 'PGRST116') {
                   throw new Error(`Check Client Error: ${checkError.message}`);
               }

               const clientPayload = {
                   phone: phone || null,
                   company: company || null,
                   updated_at: new Date().toISOString(),
               };

               if (existingClient) {
                   const { error: updateClientError } = await supabase
                       .from('clients')
                       .update(clientPayload)
                       .eq('user_id', user.id);
                   if (updateClientError) throw new Error(`Update Client Error: ${updateClientError.message}`);
               } else {
                   const { error: insertClientError } = await supabase
                       .from('clients')
                       .insert([{
                           user_id: user.id,
                           phone: phone || null,
                           company: company || null,
                           status: 'aktif',
                           join_date: new Date().toISOString(),
                           created_at: new Date().toISOString(),
                           updated_at: new Date().toISOString(),
                       }]);
                   if (insertClientError) throw new Error(`Insert Client Error: ${insertClientError.message}`);
               }
               profileUpdated = true;
           }
       }

      let successMessage = "Tidak ada perubahan disimpan.";
      if (profileUpdated && passwordUpdated) successMessage = "Profil dan Kata Sandi berhasil diperbarui!";
      else if (profileUpdated) successMessage = "Profil berhasil diperbarui!";
      else if (passwordUpdated) successMessage = "Kata Sandi berhasil diperbarui!";

      let successDescription = "";
      if (emailUpdatePending) {
          successDescription = "Link verifikasi telah dikirim ke email baru Anda."; // Pesan disesuaikan
      }

      toast.success(successMessage, { description: successDescription || undefined });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      router.push('/dashboard/profile');
      router.refresh();

    } catch (error: unknown) {
      console.error("Error saving changes:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal menyimpan perubahan. Periksa kembali input Anda.";
      if (!errors.currentPassword && !errors.email) {
         setErrors(prev => ({ ...prev, general: errorMessage }));
      }
      toast.error("Gagal Menyimpan", { description: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
        setName(user.user_metadata?.full_name || user.user_metadata?.name || "");
        setEmail(originalEmail);
        setPhone(clientData?.phone || "");
        setCompany(clientData?.company || "");
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setErrors({});
    router.push('/dashboard/profile');
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
     return (
       <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
         <p className="text-red-500">Gagal memuat data pengguna. Silakan coba login kembali.</p>
       </div>
     );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Profil</h1>
        <p className="text-muted-foreground">Ubah informasi akun dan kata sandi Anda</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-center justify-center pb-2">
           <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white dark:border-gray-800 flex items-center justify-center overflow-hidden">
              {user?.avatar_url ? (
                <Image src={user.avatar_url} alt={name || "Avatar"} width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-center mt-4">
            <CardTitle className="text-2xl font-bold">{name || user?.user_metadata?.name || "Pengguna"}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center">
              <Mail className="w-4 h-4 mr-1"/> {originalEmail}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveChanges} className="space-y-6 pt-6">
            {errors.general && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-200 flex items-start">
                <span className="mr-2">⚠️</span> {errors.general}
              </div>
            )}

            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Informasi Profil</h2>
            <div className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Nama Lengkap
                </Label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="size-5 text-muted-foreground" />
                    </div>
                    <Input
                    id="name"
                    type="text"
                    placeholder="Nama Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground pl-9 py-2 focus:ring-ring focus:border-ring h-11"
                    />
                </div>
                <FormError error={errors.name} />
                </div>

                {/* --- Field Email (Tombol Kirim Verifikasi Dihapus) --- */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                  </Label>
                  <div className="flex items-start gap-2 mt-1"> {/* Wrapper flex untuk input dan status */}
                      <div className="relative flex-grow"> {/* Input mengambil sisa ruang */}
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="size-5 text-muted-foreground" />
                          </div>
                          <Input
                              id="email"
                              type="email"
                              placeholder="email@contoh.com"
                              value={email || ''}
                              onChange={(e) => setEmail(e.target.value)}
                              className="bg-background border-input text-foreground placeholder:text-muted-foreground pl-9 py-2 focus:ring-ring focus:border-ring h-11"
                          />
                      </div>
                      {/* Tampilkan status Verified jika email akun SUDAH terverifikasi DAN email di form TIDAK diubah */}
                      {isEmailVerified && !isEmailChanged && (
                          <Button
                              type="button"
                              variant="outline"
                              className="h-11 border-green-500/50 bg-green-500/10 text-green-500 cursor-not-allowed px-4 whitespace-nowrap"
                              disabled
                              tabIndex={-1}
                          >
                              <ShieldCheck className="w-4 h-4 mr-2" />
                              Verified
                          </Button>
                      )}
                      {/* Tombol Kirim Verifikasi sudah dihapus */}
                  </div>
                  {/* Pesan jika email diubah */}
                  {isEmailChanged && (
                      <p className="text-xs text-yellow-500 mt-1 flex items-center">
                          <ShieldAlert className="w-4 h-4 mr-1" />
                          Verifikasi akan dikirim ke email baru setelah Anda menyimpan perubahan.
                      </p>
                  )}
                  {/* Pesan jika email akun belum diverifikasi dan tidak diubah */}
                  {!isEmailVerified && !isEmailChanged && (
                      <p className="text-xs text-red-500 mt-1 flex items-center">
                          <ShieldAlert className="w-4 h-4 mr-1" />
                          Email Anda saat ini belum terverifikasi.
                      </p>
                  )}
                  <FormError error={errors.email} />
                </div>
                {/* --- Akhir Field Email --- */}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center mb-2">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  Nomor Telepon
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="size-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Nomor telepon Anda"
                    value={phone || ''}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground pl-9 py-2 focus:ring-ring focus:border-ring h-11"
                  />
                </div>
                 <FormError error={errors.phone} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center mb-2">
                  <BuildingIcon className="w-4 h-4 mr-2" />
                  Perusahaan
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BuildingIcon className="size-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Nama perusahaan Anda"
                    value={company || ''}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground pl-9 py-2 focus:ring-ring focus:border-ring h-11"
                  />
                </div>
                <FormError error={errors.company} />
              </div>
            </div>

            </div>

            <h2 className="text-xl font-semibold border-b pb-2 mb-4 pt-4">Ganti Kata Sandi</h2>
             <p className="text-sm text-muted-foreground -mt-4 mb-4">Kosongkan jika tidak ingin mengganti kata sandi.</p>
            <div className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                <div className="relative">
                    <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground h-11 pr-10"
                    placeholder="Minimal 6 karakter"
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">
                    {showNewPassword ? <EyeOff className="size-5"/> : <Eye className="size-5" />}
                    </button>
                </div>
                <FormError error={errors.newPassword} />
                </div>

                <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Konfirmasi Kata Sandi Baru</Label>
                <div className="relative">
                    <Input
                    id="confirmNewPassword"
                    type={showConfirmNewPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground h-11 pr-10"
                    placeholder="Ulangi kata sandi baru"
                    />
                    <button type="button" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">
                    {showConfirmNewPassword ? <EyeOff className="size-5"/> : <Eye className="size-5" />}
                    </button>
                </div>
                <FormError error={errors.confirmNewPassword} />
                </div>
            </div>
             <div className="space-y-2 pt-6 border-t mt-6">
                <Label htmlFor="currentPassword" className="flex items-center text-lg font-medium">
                    <ShieldAlert className="size-5 mr-2 text-yellow-500" />
                    Konfirmasi Kata Sandi Saat Ini
                </Label>
                <p className="text-sm text-muted-foreground">Masukkan kata sandi Anda saat ini untuk menyimpan perubahan apa pun.</p>
                <div className="relative">
                    <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground h-11 pr-10"
                    placeholder="Kata sandi Anda saat ini"
                    required
                    />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">
                    {showCurrentPassword ? <EyeOff className="size-5"/> : <Eye className="size-5" />}
                    </button>
                </div>
                <FormError error={errors.currentPassword} />
            </div>

            <div className="flex space-x-2 pt-6">
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
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
// src/app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// Impor Input dan Label tetap dipertahankan sesuai permintaan
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  User as UserIcon,
  Edit3,
  Lock,
  Camera,
  Mail,
  Phone as PhoneIcon,
  Building as BuildingIcon,
  Calendar as CalendarIcon,
  QrCode,
  Copy,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialog } from "@/components/AlertDialog";
import { useDialog } from "@/hooks/useDialog";

// --- Interface Data Pengguna & Klien ---
type ExtendedSupabaseUser = SupabaseUser & {
    aal?: string | null;
    factors?: { id: string; factor_type: string; status: string }[] | null;
};

interface UserData {
  id: string;
  email: string | null;
  user_metadata: {
    name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
  full_name?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  updated_at?: string | null;
  factors?: { id: string; factor_type: string; status: string }[] | null;
  aal?: string | null;
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

// --- Fungsi Helper untuk QR Code ---
function svgToDataURL(svgString: string): string {
  // Pastikan string SVG valid sebelum encoding
  if (!svgString || typeof svgString !== 'string' || !svgString.trim().startsWith('<svg')) {
      console.error("Invalid SVG string passed to svgToDataURL:", svgString);
      return ""; // Kembalikan string kosong atau handle error lain
  }
  try {
      const encoded = encodeURIComponent(svgString)
          .replace(/'/g, '%27')
          .replace(/"/g, '%22');
      return `data:image/svg+xml,${encoded}`;
  } catch (error) {
      console.error("Error encoding SVG to Data URL:", error);
      return ""; // Kembalikan string kosong jika encoding gagal
  }
}


export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  // State MFA
  const [isMfaEnabled, setIsMfaEnabled] = useState<boolean | null>(null);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<{
    factorId: string;
    secret: string;
    qrCodeDataUrl: string;
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const { showAlertDialog, alertDialogState, closeAlertDialog } = useDialog();

  const supabase = createClient(); // Tetap di luar useEffect

  useEffect(() => {
    document.title = "Profil Pengguna | MiraiDev";
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

        // Gunakan instance supabase yang sudah dibuat di luar
        const { data: { user: currentUserData }, error: getUserError } = await supabase.auth.getUser();

        if (getUserError || !currentUserData) {
            console.error("Error fetching current user:", getUserError);
            router.push("/auth/login");
            return;
        }

        const currentUser = currentUserData as ExtendedSupabaseUser;

        const formattedUserData: UserData = {
          id: currentUser.id,
          email: currentUser.email || null,
          user_metadata: currentUser.user_metadata || {},
          full_name: currentUser.user_metadata?.full_name ?? currentUser.user_metadata?.name ?? null,
          avatar_url: currentUser.user_metadata?.avatar_url ?? null,
          role: currentUser.user_metadata?.role ?? null,
          factors: currentUser.factors ?? null,
          aal: currentUser.aal ?? null,
          updated_at: currentUser.updated_at ?? null,
        };

        setUser(formattedUserData);

        const mfaStatus = formattedUserData.aal === 'aal2';
        setIsMfaEnabled(mfaStatus);
        if (mfaStatus && formattedUserData.factors) {
          const totpFactor = formattedUserData.factors.find(f => f.factor_type === 'totp');
          if (totpFactor) {
            setMfaFactorId(totpFactor.id);
          }
        } else {
          setMfaFactorId(null);
        }

        const { data: clientDetails, error: clientError } = await supabase
          .from('clients')
          .select('id, user_id, phone, company, join_date, project_count, rating, status, created_at, updated_at')
          .eq('user_id', currentUser.id)
          .single();

        if (clientError && clientError.code !== 'PGRST116') {
          console.error("Error fetching client data:", clientError);
        } else if (clientDetails) {
          setClientData(clientDetails);
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error);
        toast.error("Gagal memuat data profil", { description: (error as Error).message });
        hasFetched.current = false;
      } finally {
        // PERBAIKAN: Selalu set isLoading false di finally
        setIsLoading(false);
      }
    };

    fetchUserData();
  // PERBAIKAN: Tambahkan supabase ke dependency array
  }, [authUser, authLoading, router, supabase]);

    const handleEnroll = async () => {
        setIsEnrolling(true);
        setEnrollError(null);
        setEnrollmentData(null);
        try {
            const { data, error } = await supabase.auth.mfa.enroll({
                factorType: 'totp',
            });
            if (error) throw error;
            const enrollData = data as { id: string; totp: { qr_code: string; secret: string } };
            if (!enrollData?.totp) throw new Error("Data enrollment TOTP tidak diterima dari Supabase.");

            let qrCodeSvg = enrollData.totp.qr_code;

            // PERBAIKAN: Coba ekstrak SVG jika ada prefix
            const svgStartIndex = qrCodeSvg.indexOf('<svg');
            if (svgStartIndex > 0) {
                console.warn("Received QR code with prefix, attempting to extract SVG content.");
                qrCodeSvg = qrCodeSvg.substring(svgStartIndex);
            } else if (svgStartIndex === -1) {
                 // Jika tidak ditemukan tag <svg sama sekali
                 console.error('Invalid SVG string received (no <svg tag found):', qrCodeSvg);
                 throw new Error("Format Kode QR tidak valid dari server (tidak ada tag <svg>).");
            }

            // Validasi ulang setelah potensi ekstraksi
            if (!qrCodeSvg || typeof qrCodeSvg !== 'string' || !qrCodeSvg.trim().startsWith('<svg')) {
                console.error('Invalid SVG string after potential extraction:', qrCodeSvg);
                throw new Error("Format Kode QR tidak valid dari server.");
            }

            const qrCodeDataUrl = svgToDataURL(qrCodeSvg);
            if (!qrCodeDataUrl) {
                // Handle error jika svgToDataURL gagal
                 throw new Error("Gagal mengonversi Kode QR SVG ke format gambar.");
            }


            setEnrollmentData({
                factorId: enrollData.id,
                secret: enrollData.totp.secret,
                qrCodeDataUrl: qrCodeDataUrl,
            });
            setShowEnrollDialog(true);
        } catch (error) {
            console.error("Error starting MFA enrollment:", error);
            setEnrollError((error as Error).message || "Gagal memulai proses aktivasi 2FA.");
            toast.error("Gagal Aktivasi 2FA", { description: (error as Error).message });
        } finally {
            setIsEnrolling(false);
        }
    };


    const handleVerifyAndEnable = async () => {
        if (!enrollmentData || !verificationCode) return;
        setIsVerifying(true);
        setEnrollError(null);
        try {
            const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
                factorId: enrollmentData.factorId,
            });
            if (challengeError) throw challengeError;
            const challengeResult = challengeData as { id: string };
            if (!challengeResult?.id) throw new Error("Challenge ID tidak diterima.");

            const { error: verifyError } = await supabase.auth.mfa.verify({
                factorId: enrollmentData.factorId,
                challengeId: challengeResult.id,
                code: verificationCode,
            });
            if (verifyError) throw verifyError;

            setIsMfaEnabled(true);
            setMfaFactorId(enrollmentData.factorId);
            setShowEnrollDialog(false);
            setVerificationCode("");
            setEnrollmentData(null);
            toast.success("Autentikasi Dua Faktor Berhasil Diaktifkan");

            const { data: { user: refreshedUser } } = await supabase.auth.refreshSession();
            if (refreshedUser) {
                const currentUser = refreshedUser as ExtendedSupabaseUser;
                const updatedUserData: UserData = {
                    id: currentUser.id,
                    email: currentUser.email || null,
                    user_metadata: currentUser.user_metadata || {},
                    full_name: currentUser.user_metadata?.full_name ?? null,
                    avatar_url: currentUser.user_metadata?.avatar_url ?? null,
                    role: currentUser.user_metadata?.role ?? null,
                    factors: currentUser.factors ?? null,
                    aal: currentUser.aal ?? null,
                    updated_at: currentUser.updated_at ?? null,
                };
                setUser(updatedUserData);
            }

        } catch (error) {
            console.error("Error verifying MFA code:", error);
            setEnrollError((error as Error).message || "Kode verifikasi tidak valid atau terjadi kesalahan.");
            toast.error("Verifikasi Gagal", { description: (error as Error).message });
        } finally {
            setIsVerifying(false);
        }
    };

    const handleUnenroll = async () => {
        if (!mfaFactorId) {
            toast.error("Tidak ada faktor MFA yang terdaftar untuk dinonaktifkan.");
            return;
        }

        closeAlertDialog();
        setIsEnrolling(true);
        try {
            const { error } = await supabase.auth.mfa.unenroll({
                factorId: mfaFactorId,
            });
            if (error) throw error;

            setIsMfaEnabled(false);
            setMfaFactorId(null);
            toast.success("Autentikasi Dua Faktor Berhasil Dinonaktifkan");

            const { data: { user: refreshedUser } } = await supabase.auth.refreshSession();
            if (refreshedUser) {
                const currentUser = refreshedUser as ExtendedSupabaseUser;
                const updatedUserData: UserData = {
                    id: currentUser.id,
                    email: currentUser.email || null,
                    user_metadata: currentUser.user_metadata || {},
                    full_name: currentUser.user_metadata?.full_name ?? null,
                    avatar_url: currentUser.user_metadata?.avatar_url ?? null,
                    role: currentUser.user_metadata?.role ?? null,
                    factors: currentUser.factors ?? null,
                    aal: currentUser.aal ?? null,
                    updated_at: currentUser.updated_at ?? null,
                };
                setUser(updatedUserData);
            }

        } catch (error) {
            console.error("Error unenrolling MFA:", error);
            toast.error("Gagal Menonaktifkan 2FA", { description: (error as Error).message });
        } finally {
            setIsEnrolling(false);
        }
    };

    const confirmUnenroll = () => {
        showAlertDialog(
            "Konfirmasi Nonaktifkan 2FA",
            "Apakah Anda yakin ingin menonaktifkan Autentikasi Dua Faktor? Ini akan mengurangi keamanan akun Anda.",
            handleUnenroll,
            "destructive"
        );
    };

    const copySecretToClipboard = () => {
        if (enrollmentData?.secret) {
        navigator.clipboard.writeText(enrollmentData.secret)
            .then(() => {
            toast.success("Kunci rahasia berhasil disalin!");
            })
            .catch(err => {
            console.error('Gagal menyalin kunci rahasia: ', err);
            toast.error("Gagal menyalin kunci rahasia.");
            });
        }
    };


  if (authLoading || isLoading || isMfaEnabled === null) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Tampilkan pesan error jika data user gagal diambil setelah loading selesai
  if (!user && !isLoading) {
     return (
       <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
         <p className="text-red-500">Gagal memuat data profil. Silakan coba lagi nanti atau login kembali.</p>
       </div>
     );
  }


  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profil Pengguna</h1>
          <p className="text-muted-foreground">
            Kelola informasi akun dan keamanan Anda
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-col items-center justify-center pb-2">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white dark:border-gray-800 flex items-center justify-center overflow-hidden">
                {user?.avatar_url ? (
                  <Image src={user.avatar_url} alt={user.full_name || "Avatar"} width={96} height={96} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-center mt-4">
              <CardTitle className="text-2xl font-bold">{user?.full_name || user?.user_metadata?.name || "Pengguna"}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-1"/> {user?.email}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {/* Gunakan Label meskipun Input tidak ada, agar styling konsisten */}
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <p id="phone" className="mt-1 text-muted-foreground flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-2"/> {clientData?.phone || '-'}
                  </p>
                </div>
                <div>
                  <Label htmlFor="company">Perusahaan</Label>
                  <p id="company" className="mt-1 text-muted-foreground flex items-center">
                    <BuildingIcon className="w-4 h-4 mr-2"/> {clientData?.company || '-'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="joinDate">Tanggal Bergabung</Label>
                  <p id="joinDate" className="mt-1 text-muted-foreground flex items-center">
                   <CalendarIcon className="w-4 h-4 mr-2"/> {clientData?.join_date ? new Date(clientData.join_date).toLocaleDateString('id-ID') : '-'}
                  </p>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button onClick={() => router.push('/dashboard/profile/edit')}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <h3 className="font-medium flex items-center">
                    Autentikasi Dua Faktor (2FA)
                    {isMfaEnabled ? (
                      <ShieldCheck className="w-4 h-4 text-green-500 ml-2" />
                    ) : (
                      <ShieldOff className="w-4 h-4 text-gray-500 ml-2" />
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isMfaEnabled
                      ? "2FA aktif. Tingkatkan keamanan akun Anda."
                      : "Tambahkan lapisan keamanan tambahan dengan 2FA."}
                  </p>
                </div>
                <Button
                  variant={isMfaEnabled ? "destructive" : "outline"}
                  onClick={isMfaEnabled ? confirmUnenroll : handleEnroll}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? (
                    <LoadingSpinner size="sm" />
                  ) : isMfaEnabled ? (
                    "Nonaktifkan"
                  ) : (
                    "Aktifkan"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent className="sm:max-w-[480px] bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center"><QrCode className="mr-2"/>Aktifkan Autentikasi Dua Faktor</DialogTitle>
            <DialogDescription className="text-gray-400">
              Pindai kode QR ini dengan aplikasi authenticator Anda (seperti Google Authenticator atau Authy), lalu masukkan kode verifikasi.
            </DialogDescription>
          </DialogHeader>
          {enrollmentData && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-center text-gray-300">Pindai Kode QR:</p>
                <div className="p-2 bg-white rounded-lg inline-block">
                  {enrollmentData.qrCodeDataUrl ? (
                    <Image src={enrollmentData.qrCodeDataUrl} alt="Kode QR MFA" width={200} height={200} />
                  ) : (
                    <p className="text-red-500">Gagal memuat Kode QR.</p>
                  )}
                </div>
                 <p className="text-sm text-center text-gray-300 mt-2">Atau masukkan kunci ini secara manual:</p>
                <div className="flex items-center gap-2 p-2 bg-gray-700 rounded-md border border-gray-600">
                  <code className="text-sm text-gray-200">{enrollmentData.secret}</code>
                   <Button variant="ghost" size="sm" onClick={copySecretToClipboard} className="p-1 h-auto">
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="verification-code" className="text-gray-300">Kode Verifikasi</Label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Masukkan 6 digit kode"
                  maxLength={6}
                  className="bg-gray-700 border-gray-600 text-white text-center text-lg tracking-widest"
                />
              </div>
              {enrollError && (
                <p className="text-sm text-red-400 text-center">{enrollError}</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnrollDialog(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Batal
            </Button>
            <Button
              onClick={handleVerifyAndEnable}
              disabled={isVerifying || verificationCode.length !== 6 || !enrollmentData}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isVerifying ? <LoadingSpinner size="sm" /> : "Verifikasi & Aktifkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </>
  );
}
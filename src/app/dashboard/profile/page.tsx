// src/app/dashboard/profile/page.tsx
"use client";

// Hapus 'FormEvent' dari import React
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { createClient } from "@/lib/supabase/client";
// Ganti MfaFactor menjadi Factor, hapus SupabaseUserType jika tidak terpakai langsung
import { User as SupabaseUserType, Factor } from "@supabase/supabase-js";
import {
  User as UserIcon,
  Edit3,
  Lock,
  Camera,
  Mail,
  Phone as PhoneIcon,
  Building2 as BuildingIcon,
  Calendar as CalendarIcon,
  QrCode,
  Copy,
  ShieldCheck,
  ShieldOff,
  KeyRound,
  // Hapus import ShieldAlert
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

type ExtendedSupabaseUser = SupabaseUserType & {
    aal?: string | null;
    factors?: Factor[] | null;
};

interface UserData {
  id: string;
  email: string | null;
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
  factors?: Factor[] | null;
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
  if (!svgString || typeof svgString !== 'string' || !svgString.trim().startsWith('<svg')) {
      console.error("Invalid SVG string passed to svgToDataURL:", svgString);
      return "";
  }
  try {
      const encoded = encodeURIComponent(svgString)
          .replace(/'/g, '%27')
          .replace(/"/g, '%22')
          .replace(/</g, '%3C')
          .replace(/>/g, '%3E')
          .replace(/#/g, '%23')
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29');
      return `data:image/svg+xml,${encoded}`;
  } catch (error) {
      console.error("Error encoding SVG to Data URL:", error);
      return "";
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
  const [isEnrollingOrUnenrolling, setIsEnrollingOrUnenrolling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const { showAlertDialog, alertDialogState, closeAlertDialog } = useDialog();

  // State baru untuk Unenroll Verification
  const [showUnenrollVerifyDialog, setShowUnenrollVerifyDialog] = useState(false);
  const [unenrollChallengeId, setUnenrollChallengeId] = useState<string | null>(null);
  const [unenrollVerificationCode, setUnenrollVerificationCode] = useState("");
  const [unenrollError, setUnenrollError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    document.title = "Profil Pengguna | MiraiDev";
  }, []);

  const fetchUserData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && hasFetched.current) {
        setIsLoading(false);
        return;
    }
    if (authLoading) {
        return;
    }

    setIsLoading(true);
    try {
      if (!authUser) {
        router.push("/auth/login");
        return;
      }

      const { data: { user: currentUserData }, error: getUserError } = await supabase.auth.getUser();

      if (getUserError || !currentUserData) {
          console.error("Error fetching current user:", getUserError);
          if (getUserError?.message.includes("invalid claim: expired") || getUserError?.message.includes("invalid JWT")) {
               await supabase.auth.signOut();
               router.push("/auth/login");
          } else {
               toast.error("Gagal mendapatkan data user terbaru. Coba refresh halaman.");
          }
          return;
      }

      const currentUser = currentUserData as ExtendedSupabaseUser;

      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) {
          console.error("Error listing MFA factors:", factorsError);
      }
      const activeFactors = factorsData?.all ?? [];
      const verifiedTotpFactor = activeFactors.find(f => f.factor_type === 'totp' && f.status === 'verified');

      const formattedUserData: UserData = {
        id: currentUser.id,
        email: currentUser.email || null,
        user_metadata: currentUser.user_metadata || {},
        full_name: currentUser.user_metadata?.full_name ?? currentUser.user_metadata?.name ?? null,
        avatar_url: currentUser.user_metadata?.avatar_url ?? null,
        role: currentUser.user_metadata?.role ?? null,
        factors: activeFactors,
        aal: currentUser.aal ?? null,
        updated_at: currentUser.updated_at ?? null,
      };

      setUser(formattedUserData);

      const mfaStatus = !!verifiedTotpFactor;
      setIsMfaEnabled(mfaStatus);
      setMfaFactorId(verifiedTotpFactor?.id || null);


      const { data: clientDetails, error: clientError } = await supabase
        .from('clients')
        .select('id, user_id, phone, company, join_date, project_count, rating, status, created_at, updated_at')
        .eq('user_id', currentUser.id)
        .single();

      if (clientError && clientError.code !== 'PGRST116') {
        console.error("Error fetching client data:", clientError);
        toast.error("Gagal mengambil detail data klien.", { description: clientError.message });
      } else if (clientDetails) {
        setClientData(clientDetails);
      }

      hasFetched.current = true;

    } catch (error) {
      console.error("Error in fetchUserData:", error);
      toast.error("Gagal memuat data profil", { description: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  }, [authUser, authLoading, router, supabase]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

    const handleEnroll = async () => {
        setIsEnrollingOrUnenrolling(true);
        setEnrollError(null);
        setEnrollmentData(null);
        try {
            const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
            if (error) throw error;
            const enrollData = data as { id: string; totp: { qr_code: string; secret: string } };
            if (!enrollData?.totp) throw new Error("Data enrollment TOTP tidak diterima.");

            let qrCodeSvg = enrollData.totp.qr_code;
            const svgStartIndex = qrCodeSvg.indexOf('<svg');
            if (svgStartIndex > 0) qrCodeSvg = qrCodeSvg.substring(svgStartIndex);
            else if (svgStartIndex === -1) throw new Error("Format Kode QR tidak valid (tag <svg> tidak ditemukan).");
            if (!qrCodeSvg.trim().startsWith('<svg')) throw new Error("Format Kode QR tidak valid.");

            const qrCodeDataUrl = svgToDataURL(qrCodeSvg);
            if (!qrCodeDataUrl) throw new Error("Gagal konversi Kode QR.");

            setEnrollmentData({ factorId: enrollData.id, secret: enrollData.totp.secret, qrCodeDataUrl });
            setShowEnrollDialog(true);
        } catch (error) {
            console.error("Error starting MFA enrollment:", error);
            setEnrollError((error as Error).message || "Gagal memulai aktivasi 2FA.");
            toast.error("Gagal Aktivasi 2FA", { description: (error as Error).message });
        } finally {
            setIsEnrollingOrUnenrolling(false);
        }
    };

    const handleVerifyAndEnable = async () => {
        if (!enrollmentData || !verificationCode) return;
        setIsVerifying(true);
        setEnrollError(null);
        try {
            const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: enrollmentData.factorId });
            if (challengeError) throw challengeError;
            const challengeResult = challengeData as { id: string };
            if (!challengeResult?.id) throw new Error("Challenge ID tidak diterima.");

            const { error: verifyError } = await supabase.auth.mfa.verify({ factorId: enrollmentData.factorId, challengeId: challengeResult.id, code: verificationCode });
            if (verifyError) throw verifyError;

            setShowEnrollDialog(false);
            setVerificationCode("");
            setEnrollmentData(null);
            toast.success("Autentikasi Dua Faktor Berhasil Diaktifkan");
            await fetchUserData(true);
        } catch (error) {
            console.error("Error verifying MFA code:", error);
            setEnrollError((error as Error).message || "Kode verifikasi salah.");
            toast.error("Verifikasi Gagal", { description: (error as Error).message });
        } finally {
            setIsVerifying(false);
        }
    };

    const startUnenrollProcess = async () => {
        closeAlertDialog();
        if (!mfaFactorId) {
            toast.error("Tidak ada faktor MFA yang terdaftar.");
            return;
        }
        setIsEnrollingOrUnenrolling(true);
        setUnenrollError(null);
        try {
            const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: mfaFactorId });
            if (challengeError) throw challengeError;
            const challengeResult = challengeData as { id: string };
            if (!challengeResult?.id) throw new Error("Challenge ID tidak diterima untuk unenroll.");

            setUnenrollChallengeId(challengeResult.id);
            setUnenrollVerificationCode("");
            setShowUnenrollVerifyDialog(true);
        } catch (error) {
            console.error("Error starting MFA unenrollment challenge:", error);
            toast.error("Gagal Memulai Proses Nonaktifkan 2FA", { description: (error as Error).message });
            setIsEnrollingOrUnenrolling(false);
        }
    };

    const handleVerifyAndUnenroll = async () => {
        if (!mfaFactorId || !unenrollChallengeId || !unenrollVerificationCode) {
            setUnenrollError("Informasi verifikasi tidak lengkap.");
            return;
        }
        setIsVerifying(true);
        setUnenrollError(null);

        try {
            const { error: verifyError } = await supabase.auth.mfa.verify({ factorId: mfaFactorId, challengeId: unenrollChallengeId, code: unenrollVerificationCode });
            if (verifyError) throw verifyError;

            const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: mfaFactorId });
            if (unenrollError) {
                 console.error("Supabase unenroll error after verification:", unenrollError);
                 throw new Error(unenrollError.message || "Gagal menonaktifkan 2FA setelah verifikasi.");
            }

            setShowUnenrollVerifyDialog(false);
            setUnenrollVerificationCode("");
            setUnenrollChallengeId(null);
            toast.success("Autentikasi Dua Faktor Berhasil Dinonaktifkan");
            await fetchUserData(true);
        } catch (error) {
            console.error("Error verifying and unenrolling MFA:", error);
            setUnenrollError((error as Error).message || "Kode verifikasi salah.");
            toast.error("Gagal Menonaktifkan 2FA", { description: (error as Error).message });
        } finally {
            setIsVerifying(false);
            setIsEnrollingOrUnenrolling(false);
        }
    };

    const confirmUnenroll = () => {
        showAlertDialog(
            "Nonaktifkan Autentikasi Dua Faktor",
            "Anda perlu memasukkan kode verifikasi dari aplikasi authenticator Anda untuk melanjutkan.",
            startUnenrollProcess,
            "destructive"
        );
    };


    const copySecretToClipboard = () => {
        if (enrollmentData?.secret) {
        navigator.clipboard.writeText(enrollmentData.secret)
            .then(() => toast.success("Kunci rahasia berhasil disalin!"))
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
                    {isMfaEnabled === true && (
                      <ShieldCheck className="w-4 h-4 text-green-500 ml-2" />
                    )}
                    {isMfaEnabled === false && (
                      <ShieldOff className="w-4 h-4 text-gray-500 ml-2" />
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isMfaEnabled === true
                      ? "2FA aktif. Akun Anda lebih aman."
                      : "Tambahkan lapisan keamanan tambahan dengan 2FA."}
                  </p>
                </div>
                <Button
                  variant={isMfaEnabled ? "destructive" : "outline"}
                  onClick={isMfaEnabled ? confirmUnenroll : handleEnroll}
                  disabled={isEnrollingOrUnenrolling}
                >
                  {isEnrollingOrUnenrolling ? (
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
                <Label htmlFor="verification-code-enroll" className="text-gray-300">Kode Verifikasi</Label>
                <Input
                  id="verification-code-enroll"
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

       <Dialog open={showUnenrollVerifyDialog} onOpenChange={(open) => {
           setShowUnenrollVerifyDialog(open);
           if (!open) {
               setIsEnrollingOrUnenrolling(false);
               setUnenrollError(null);
           }
       }}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center"><KeyRound className="mr-2"/>Verifikasi Nonaktifkan 2FA</DialogTitle>
            <DialogDescription className="text-gray-400">
              Masukkan kode dari aplikasi authenticator Anda untuk menonaktifkan Autentikasi Dua Faktor.
              Jika Anda sudah menghapus akun dari authenticator, Anda perlu menonaktifkannya via Supabase Dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code-unenroll" className="text-gray-300">Kode Verifikasi Saat Ini</Label>
              <Input
                id="verification-code-unenroll"
                value={unenrollVerificationCode}
                onChange={(e) => setUnenrollVerificationCode(e.target.value)}
                placeholder="Masukkan 6 digit kode"
                maxLength={6}
                className="bg-gray-700 border-gray-600 text-white text-center text-lg tracking-widest"
              />
            </div>
            {unenrollError && (
              <p className="text-sm text-red-400 text-center">{unenrollError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
                setShowUnenrollVerifyDialog(false);
                setIsEnrollingOrUnenrolling(false);
                setUnenrollError(null);
             }} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Batal
            </Button>
            <Button
              onClick={handleVerifyAndUnenroll}
              disabled={isVerifying || unenrollVerificationCode.length !== 6 || !unenrollChallengeId}
              variant="destructive"
            >
              {isVerifying ? <LoadingSpinner size="sm" /> : "Verifikasi & Nonaktifkan"}
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
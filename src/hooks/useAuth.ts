import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // PERBAIKAN: Path import diubah ke file yang benar

// Tipe Session ini bisa dihapus jika Anda sudah punya tipe global atau dari @supabase/supabase-js
interface Session {
  user?: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  };
  expires_at?: number;
}

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Buat client di dalam useEffect untuk memastikan hanya berjalan di sisi client
    const supabase = createClient();

    // onAuthStateChange sudah cukup untuk menangani sesi awal dan perubahannya
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false); // Set loading menjadi false setelah state auth pertama kali didapat
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Cukup dijalankan sekali saat komponen mount

  return { session, loading };
};
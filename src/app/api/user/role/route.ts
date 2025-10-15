import { createClient } from "@/lib/supabase/client";

export async function GET() {
  try {
    // Hanya bisa diakses oleh pengguna yang sudah login
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Tidak ada sesi pengguna" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Hanya ambil role dari tabel profiles, bukan dari metadata user
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching role from profiles:', error);
      // Jika gagal mengambil dari profiles, kembalikan role default 'user'
      return new Response(
        JSON.stringify({ role: 'user' }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ role: data?.role }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching user role:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan internal" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
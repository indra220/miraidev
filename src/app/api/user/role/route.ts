import { createSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    // Hanya bisa diakses oleh pengguna yang sudah login
    const supabase = createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Tidak ada sesi pengguna" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Cek role dari metadata user terlebih dahulu
    const metadataRole = session.user.user_metadata?.role as 'klien' | 'pegawai' | 'admin' | undefined;
    
    // Jika sudah ada role di metadata, kembalikan itu
    if (metadataRole) {
      return new Response(
        JSON.stringify({ role: metadataRole }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Jika tidak ada role di metadata, coba dapatkan dari tabel profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      return new Response(
        JSON.stringify({ error: "Gagal mengambil informasi role" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
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
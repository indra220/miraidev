// Sementara mengganti implementasi karena konflik tipe antara versi ai dan @ai-sdk/openai
// TODO: Harus diperbaiki setelah update dependency

export async function POST(req: Request) {
  // Untuk saat ini, kita tidak menggunakan autentikasi
  // Di masa depan, ini bisa diimplementasikan dengan sistem auth lain
  
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const { messages } = await req.json(); // eslint-disable-line @typescript-eslint/no-unused-vars

    // Fungsi chat sementara dinonaktifkan karena konflik tipe
    // TODO: Implementasikan kembali setelah perbaikan dependency
    return new Response(
      JSON.stringify({
        error: "Fungsi chat sedang dalam maintenance. Silakan coba lagi nanti."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error:
          "Failed to process chat request. Please check your API configuration.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

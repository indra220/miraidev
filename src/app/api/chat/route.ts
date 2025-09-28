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
    const { messages } = await req.json();

    // Simulasi respons dari AI
    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage?.content || "";

    // Buat respons sederhana
    const responseText = `Ini adalah simulasi balasan untuk pesan Anda: "${userMessage}". Sistem AI sedang dalam pengembangan.`;

    return new Response(
      JSON.stringify({
        text: responseText,
      }),
      {
        status: 200,
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

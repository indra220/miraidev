import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  // Ini akan menjadi endpoint WebSocket untuk chat real-time
  // Namun, karena Next.js App Router belum mendukung WebSocket secara native di edge runtime,
  // kita akan menggunakan pendekatan berbasis Server-Sent Events (SSE) sebagai alternatif sementara
  // atau menggunakan Supabase Realtime yang sudah terintegrasi di sisi klien
  
  // Untuk saat ini, kita hanya mengembalikan pesan bahwa endpoint ini untuk WebSocket
  return new Response(
    JSON.stringify({
      message: "Endpoint WebSocket untuk chat real-time",
      status: "connected"
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function POST(request: NextRequest) {
  // Menangani pengiriman pesan baru
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
      },
    }
  );

  try {
    const body = await request.json();
    const { message, sender_id, sender_type, project_id } = body;

    // Validasi input
    if (!message || !sender_id || !sender_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: message, sender_id, sender_type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validasi tipe sender
    if (!['user', 'admin'].includes(sender_type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid sender_type. Must be "user" or "admin"' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert pesan ke database
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([
        {
          sender_id,
          sender_type,
          message,
          project_id: project_id || null,
          read_status: false
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error inserting message:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send message', details: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Supabase Realtime akan secara otomatis memberi tahu klien lain
    // tentang perubahan data di tabel chat_messages

    return new Response(
      JSON.stringify({ 
        message: 'Message sent successfully', 
        data 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in POST /api/realtime-chat:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
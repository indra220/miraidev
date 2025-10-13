// src/app/api/conversations/messages/route.ts
import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
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
    // Get conversation ID from query params
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    
    if (!conversationId) {
      return new Response(
        JSON.stringify({ error: 'Conversation ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get messages for the conversation
    const { data, error } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch messages', details: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: 'Messages retrieved successfully', 
        messages: data 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in GET /api/conversations/messages:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const { conversation_id, sender_id, message, linked_project_id } = body;

    // Validasi input
    if (!conversation_id || !sender_id || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: conversation_id, sender_id, message' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validasi bahwa conversation_id ada
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversation_id)
      .single();

    if (convError || !conversation) {
      return new Response(
        JSON.stringify({ error: 'Invalid conversation ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert pesan ke database
    const { data, error } = await supabase
      .from('conversation_messages')
      .insert([
        {
          conversation_id,
          sender_id,
          message,
          linked_project_id: linked_project_id || null,
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
    // tentang perubahan data di tabel conversation_messages

    return new Response(
      JSON.stringify({ 
        message: 'Message sent successfully', 
        data 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in POST /api/conversations/messages:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
// src/app/api/chat/users/route.ts
import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
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
    // Get all users who have conversations
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        user_id,
        profiles (full_name, email)
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching users with conversations:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch users', details: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    interface ConversationData {
      user_id: string;
      profiles?: {
        full_name?: string | null;
        email?: string | null;
      };
    }
    
    // Format the data to match the expected structure
    const conversations = data as ConversationData[];
    const users = conversations.map((conv) => ({
      id: conv.user_id,
      name: conv.profiles?.full_name || 'Pengguna Tak Dikenal',
      email: conv.profiles?.email || 'Email tidak tersedia'
    }));

    return new Response(
      JSON.stringify({ 
        message: 'Users retrieved successfully', 
        users 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in GET /api/chat/users:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
// src/app/api/admin/conversations/route.ts
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
    // Get all conversations with user information
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id,
        user_id,
        created_at,
        updated_at,
        profiles (full_name, email)
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch conversations', details: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: 'Conversations retrieved successfully', 
        conversations: data 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in GET /api/admin/conversations:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
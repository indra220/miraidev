import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: NextRequest) {
  try {
    // Get cookies from the request headers
    const requestHeaders = new Headers(req.headers);
    const cookieHeader = requestHeaders.get('Cookie');
    
    // Create Supabase client for API routes
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            if (!cookieHeader) return undefined;
            const nameRegex = new RegExp(`(^| )${name}=([^;]+)`);
            const match = cookieHeader.match(nameRegex);
            return match ? match[2] : undefined;
          },
        },
      }
    );

    // Get user session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message_id, project_id } = await req.json();

    if (!message_id) {
      return Response.json({ error: 'Message ID is required' }, { status: 400 });
    }

    // Check if it's a project-specific message or general conversation message
    let result;
    if (project_id) {
      // For project-specific chat
      result = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', message_id)
        .eq('sender_id', user.id)
        .select('project_id')
        .single();
    } else {
      // For general conversation
      result = await supabase
        .from('conversation_messages')
        .delete()
        .eq('id', message_id)
        .eq('sender_id', user.id)
        .select('conversation_id')
        .single();
    }

    if (result.error) {
      console.error('Error deleting message:', result.error);
      return Response.json({ error: 'Failed to delete message' }, { status: 500 });
    }

    // Verify that the message belonged to the user or they have admin rights
    if (result.data === null) {
      return Response.json({ error: 'Message not found or unauthorized' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in delete message API:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
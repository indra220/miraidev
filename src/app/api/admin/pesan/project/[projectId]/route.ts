import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    
    // Cek variabel lingkungan
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Ambil pesan-pesan chat proyek
    const { data: projectMessages, error: messagesError } = await supabase
      .from('chat_messages')
      .select(`
        *,
        profiles (full_name, email)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching project messages:', messagesError);
      return new Response(JSON.stringify({ error: messagesError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ambil informasi proyek
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('id, title, user_id')
      .eq('id', projectId)
      .single();

    if (projectError) {
      console.error('Error fetching project:', projectError);
      return new Response(JSON.stringify({ error: projectError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ambil informasi pengguna terkait proyek
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', projectData.user_id)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return new Response(JSON.stringify({ error: userError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      project: projectData,
      user: userData,
      messages: projectMessages
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching project messages:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();
    
    if (!body.message || !body.senderId) {
      return new Response(JSON.stringify({ error: 'Message and senderId are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validasi bahwa proyek ada
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return new Response(JSON.stringify({ error: 'Project not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Simpan pesan baru
    const { data: newMessage, error: insertError } = await supabase
      .from('chat_messages')
      .insert([{
        project_id: projectId,
        sender_id: body.senderId,
        sender_type: 'admin',
        message: body.message
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting message:', insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Tambahkan informasi profil ke pesan baru
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', body.senderId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return new Response(JSON.stringify({ error: profileError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      message: 'Message sent successfully',
      data: { ...newMessage, profiles: profile }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error sending project message:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ContactSubmission } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
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
    
    const body = await request.json();
    
    if (!body.messageId || !body.reply) {
      return new Response(JSON.stringify({ error: 'Message ID and reply are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ambil pesan asli untuk mendapatkan informasi kontak
    const { data: originalMessage, error: fetchError } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', body.messageId)
      .single();

    if (fetchError) {
      console.error('Error fetching original message:', fetchError);
      return new Response(JSON.stringify({ error: 'Original message not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Di sini Anda bisa menambahkan logika untuk mengirim email balasan ke pengguna
    // Misalnya menggunakan layanan email seperti Resend, SendGrid, atau lainnya
    console.warn(`Sending reply to ${originalMessage.email}: ${body.reply}`);

    // Simpan balasan ke dalam riwayat percakapan
    const { error: threadError } = await supabase
      .from('contact_message_threads')
      .insert({
        contact_submission_id: body.messageId,
        sender_type: 'admin',
        message: body.reply
      });

    if (threadError) {
      console.error('Error saving reply to thread:', threadError);
      return new Response(JSON.stringify({ error: 'Failed to save reply to thread' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update status pesan menjadi 'dibaca' setelah dibalas
    const { error: updateError } = await supabase
      .from('contact_submissions')
      .update({ status: 'dibaca', updated_at: new Date().toISOString() })
      .eq('id', body.messageId);

    if (updateError) {
      console.error('Error updating message status:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update message status' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      message: 'Reply sent and saved successfully',
      originalMessage: originalMessage as ContactSubmission
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
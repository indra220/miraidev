import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ContactSubmission } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    
    // Ambil data contact submissions yang ditandai sebagai testimonial (misalnya dengan field khusus)
    // atau ambil yang memiliki rating tinggi atau status 'dibaca'
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('status', 'dibaca') // Ambil hanya yang sudah dibaca
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Filter tambahan untuk hanya testimonial yang valid
    const testimonials = data.filter(submission => 
      submission.message.length > 50 // Pesan cukup panjang untuk dianggap testimonial
    );
    
    return new Response(JSON.stringify({ data: testimonials } as { data: ContactSubmission[] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
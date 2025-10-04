import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are not set.');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // PERBAIKAN: Mengambil 'id' langsung dari params
    const { id } = params;

    if (!id) {
      return new NextResponse(JSON.stringify({ error: 'Portfolio ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { error } = await supabase.rpc('increment_portfolio_view', {
      portfolio_id: parseInt(id),
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      throw new Error(error.message);
    }

    return new NextResponse(JSON.stringify({ message: 'View count incremented successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
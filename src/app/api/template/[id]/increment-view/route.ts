// src/app/api/template/[id]/increment-view/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Perbaikan tipe untuk Next.js 13+ App Router
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are not set.');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Menunggu resolusi params dari Promise
    const resolvedParams = await params;
    const templateId = resolvedParams.id;

    if (!templateId || isNaN(parseInt(templateId))) {
      return new NextResponse(JSON.stringify({ error: 'Valid Template ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Panggil fungsi RPC dengan templateId
    const { error } = await supabase.rpc('increment_portfolio_view', {
      portfolio_id: parseInt(templateId),
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      throw new Error(error.message);
    }

    // Kode ini sekarang akan berjalan dan mengirim respons sukses
    return new NextResponse(JSON.stringify({ message: 'View count incremented successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
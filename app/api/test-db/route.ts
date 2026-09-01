import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch event
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('*')
      .single();

    if (eventError) throw eventError;

    // Fetch tiers separately
    const { data: tiers, error: tiersError } = await supabaseAdmin
      .from('ticket_tiers')
      .select('*')
      .eq('event_id', event.id);

    if (tiersError) throw tiersError;

    return NextResponse.json({
      success: true,
      event: event,
      tiers: tiers
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}
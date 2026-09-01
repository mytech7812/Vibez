import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .single();

    if (eventError) throw eventError;

    const { data: tiers, error: tiersError } = await supabase
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
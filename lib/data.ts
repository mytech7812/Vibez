import { supabase } from './supabase';

export async function getEvent() {
  const { data: event, error } = await supabase
    .from('events')
    .select('*, ticket_tiers(*)')
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    return null;
  }

  // Rename ticket_tiers to tiers for compatibility
  if (event) {
    event.tiers = event.ticket_tiers || [];
    delete event.ticket_tiers;
  }

  return event;
}
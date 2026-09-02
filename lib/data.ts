import { type EventRecord } from "./types";
import { getSupabase } from "./supabase";

export async function getEvent(): Promise<EventRecord | null> {
  const supabase = getSupabase();
  const { data: event, error } = await supabase
    .from('events')
    .select('*, ticket_tiers(*)')
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    return null;
  }

  return {
    slug: event.slug,
    title: event.title,
    subtitle: event.subtitle,
    category: event.category as EventRecord["category"],
    date: event.date,
    doorsOpen: event.doors_open,
    venueName: event.venue_name,
    venueAddress: event.venue_address,
    city: event.city,
    description: event.description,
    lineup: event.lineup ?? [],
    isFeatured: event.is_featured,
    isSellingFast: event.is_selling_fast,
    tiers: (event.ticket_tiers ?? []).map((tier: Record<string, unknown>) => {
      const totalCapacity = Number(tier.total_capacity ?? 0);
      const soldCount = Number(tier.sold_count ?? 0);

      return {
        id: String(tier.id),
        name: String(tier.name),
        description: String(tier.description ?? ""),
        price: Number(tier.price),
        perks: Array.isArray(tier.perks) ? tier.perks.map(String) : [],
        quantityAvailable: Math.max(0, totalCapacity - soldCount),
        isSoldOut: soldCount >= totalCapacity,
        total_capacity: totalCapacity,     // ← ADD THIS
        sold_count: soldCount,             // ← ADD THIS
      };
    }),
  };
}
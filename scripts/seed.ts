import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

async function seed() {
  const { getSupabaseAdmin } = await import("../lib/supabase-admin");
  const supabaseAdmin = getSupabaseAdmin();

  console.log('🌱 Seeding database...');

  // Get existing event
  const { data: event } = await supabaseAdmin
    .from('events')
    .select('id')
    .eq('slug', 'afterglow-rooftop-sessions')
    .single();

  if (!event) {
    console.log('❌ Event not found. Run full seed first.');
    return;
  }

  console.log('✅ Event found, seeding tiers...');

  const tiersData = [
    {
      event_id: event.id,
      name: "Men",
      description: "Standard entry, full venue access.",
      price: 15000,
      perks: ["Full venue access", "Access to all 3 floors"],
      total_capacity: 320,
      sold_count: 0,
    },
    {
      event_id: event.id,
      name: "Women",
      description: "Standard entry, full venue access.",
      price: 5000,
      perks: ["Full venue access", "Access to all 3 floors"],
      total_capacity: 280,
      sold_count: 0,
    }
  ];

  for (const tier of tiersData) {
    // Check if tier already exists
    const { data: existing } = await supabaseAdmin
      .from('ticket_tiers')
      .select('id')
      .eq('event_id', event.id)
      .eq('name', tier.name)
      .single();

    if (existing) {
      console.log(`⚠️ Tier already exists: ${tier.name}, skipping...`);
      continue;
    }

    const { error: tierError } = await supabaseAdmin
      .from('ticket_tiers')
      .insert(tier);

    if (tierError) {
      console.error('❌ Error seeding tier:', tierError.message);
    } else {
      console.log(`✅ Tier seeded: ${tier.name}`);
    }
  }

  console.log('🎉 Seed complete!');
}

seed();

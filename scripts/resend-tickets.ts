import { config } from "dotenv";
import { resolve } from "node:path";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { getSupabaseAdmin } from "../lib/supabase-admin";
import { sendTicketEmail } from "../lib/email/send";

async function resendTickets() {
  const orderId = process.argv[2];

  if (!orderId) {
    console.log("⚠️ Please provide an order ID");
    console.log("Usage: npx tsx scripts/resend-tickets.ts ORDER_ID");
    process.exit(1);
  }

  console.log("📧 Resending tickets for order:", orderId);

  const supabaseAdmin = getSupabaseAdmin();

  // Get order
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error("❌ Order not found:", orderId);
    process.exit(1);
  }

  // Get tickets
  const { data: tickets, error: ticketError } = await supabaseAdmin
    .from("tickets")
    .select("*")
    .eq("order_id", orderId);

  if (ticketError || !tickets || tickets.length === 0) {
    console.error("❌ No tickets found for order:", orderId);
    process.exit(1);
  }

  // Get event
  const { data: event } = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("id", order.event_id)
    .single();

  if (!event) {
    console.error("❌ Event not found");
    process.exit(1);
  }

  console.log("📦 Tickets:", tickets.length);
  console.log("👤 Buyer:", order.buyer_email);

  // Send email
  const result = await sendTicketEmail(order, tickets, event);

  if (result.success) {
    console.log("✅ Email sent to:", order.buyer_email);
  } else {
    console.error("❌ Email failed:", result.error);
  }
}

resendTickets();
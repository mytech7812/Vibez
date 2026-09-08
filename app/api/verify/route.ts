import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({
        valid: false,
        message: "Ticket code required"
      }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Check ticket by secret_token OR unique_code
    const { data: ticket, error } = await supabaseAdmin
      .from("tickets")
      .select(`
        unique_code,
        secret_token,
        is_verified,
        attendee_name,
        attendee_email,
        order_id,
        tier_id
      `)
      .or(`unique_code.eq.${code},secret_token.eq.${code}`)
      .single();

    if (error || !ticket) {
      // Fallback: check verification_tickets table
      const { data: vTicket, error: vError } = await supabaseAdmin
        .from("verification_tickets")
        .select("*")
        .eq("unique_code", code)
        .single();

      if (vError || !vTicket) {
        return NextResponse.json({
          valid: false,
          message: "Invalid ticket code"
        });
      }

      return NextResponse.json({
        valid: true,
        message: "Ticket found",
        ticket: {
          code: vTicket.unique_code,
          tier: vTicket.tier_name,
          buyer: vTicket.buyer_name,
          event: vTicket.event_title,
          is_verified: vTicket.is_verified || false,
        }
      });
    }

    // Get tier name
    const { data: tier } = await supabaseAdmin
      .from("ticket_tiers")
      .select("name")
      .eq("id", ticket.tier_id)
      .single();

    // Get order and event info
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select(`
        buyer_name,
        buyer_email,
        event_id
      `)
      .eq("id", ticket.order_id)
      .single();

    // Get event separately
    let eventTitle = "Event";
    if (order?.event_id) {
      const { data: event } = await supabaseAdmin
        .from("events")
        .select("title")
        .eq("id", order.event_id)
        .single();
      
      if (event) {
        eventTitle = event.title;
      }
    }

    const buyerName = order?.buyer_name || ticket.attendee_name || "Unknown";

    return NextResponse.json({
      valid: true,
      message: "Ticket found",
      ticket: {
        code: ticket.unique_code,
        secret: ticket.secret_token,
        tier: tier?.name || "Unknown",
        buyer: buyerName,
        event: eventTitle,
        is_verified: ticket.is_verified || false,
      }
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({
      valid: false,
      message: "Server error. Please try again."
    }, { status: 500 });
  }
}
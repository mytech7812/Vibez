import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({
        success: false,
        tickets: [],
        error: "Ticket code required"
      }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Search by secret_token OR unique_code
    const { data: tickets, error } = await supabaseAdmin
      .from("tickets")
      .select(`
        unique_code,
        secret_token,
        is_verified,
        attendee_name,
        attendee_email,
        order_id,
        tier_id,
        ticket_tiers (
          name
        ),
        orders (
          buyer_name,
          buyer_email,
          event_id,
          events (
            title
          )
        )
      `)
      .or(`unique_code.eq.${code},secret_token.eq.${code}`);

    if (error) {
      return NextResponse.json({
        success: false,
        tickets: [],
        error: "Database error"
      }, { status: 500 });
    }

    // Format response
    const formattedTickets = tickets.map((t: any) => ({
      unique_code: t.unique_code,
      secret_token: t.secret_token,
      tier_name: t.ticket_tiers?.name || "Unknown",
      buyer_name: t.orders?.buyer_name || t.attendee_name || "Unknown",
      event_title: t.orders?.events?.title || "Event",
      is_verified: t.is_verified || false,
    }));

    return NextResponse.json({
      success: true,
      tickets: formattedTickets
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({
      success: false,
      tickets: [],
      error: "Server error"
    }, { status: 500 });
  }
}
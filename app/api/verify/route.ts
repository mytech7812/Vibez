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

    // Check ticket in verification table
    const { data: ticket, error } = await supabaseAdmin
      .from("verification_tickets")
      .select("*")
      .eq("unique_code", code)
      .single();

    if (error || !ticket) {
      return NextResponse.json({
        valid: false,
        message: "Invalid ticket code"
      });
    }

    return NextResponse.json({
      valid: true,
      message: "Ticket found",
      ticket: {
        code: ticket.unique_code,
        tier: ticket.tier_name,
        buyer: ticket.buyer_name,
        event: ticket.event_title,
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
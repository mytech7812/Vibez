import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    const supabaseAdmin = getSupabaseAdmin();

    // If code is provided, search by unique code
    if (code) {
      const { data: ticket, error } = await supabaseAdmin
        .from("verification_tickets")
        .select("*")
        .eq("unique_code", code)
        .single();

      if (error || !ticket) {
        return NextResponse.json({
          success: false,
          tickets: [],
          error: "Ticket not found"
        });
      }

      return NextResponse.json({
        success: true,
        tickets: [ticket]
      });
    }

    // Otherwise search by email
    if (!email) {
      return NextResponse.json({
        success: false,
        tickets: [],
        error: "Email or ticket code required"
      }, { status: 400 });
    }

    const { data: tickets, error } = await supabaseAdmin
      .from("verification_tickets")
      .select("*")
      .eq("buyer_email", email.toLowerCase())
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({
        success: false,
        tickets: [],
        error: "Database error"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      tickets: tickets || []
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
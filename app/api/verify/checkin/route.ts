import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({
        success: false,
        message: "Ticket code required"
      }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Find ticket by secret_token OR unique_code
    const { data: ticket, error: findError } = await supabaseAdmin
      .from("tickets")
      .select("id, secret_token, unique_code, is_verified")
      .or(`unique_code.eq.${code},secret_token.eq.${code}`)
      .single();

    if (findError || !ticket) {
      return NextResponse.json({
        success: false,
        message: "Ticket not found"
      }, { status: 404 });
    }

    if (ticket.is_verified) {
      return NextResponse.json({
        success: false,
        message: "Ticket already checked in"
      }, { status: 400 });
    }

    // Update ticket
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("tickets")
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        verified_by: "scanner",
      })
      .eq("id", ticket.id)
      .eq("is_verified", false)
      .select()
      .single();

    if (updateError || !updated) {
      return NextResponse.json({
        success: false,
        message: "Ticket already checked in or not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Ticket checked in successfully",
      ticket: updated
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({
      success: false,
      message: "Server error. Please try again."
    }, { status: 500 });
  }
}
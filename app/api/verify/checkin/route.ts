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

    // Update verification_tickets
    const { data, error } = await supabaseAdmin
      .from("verification_tickets")
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        verified_by: "scanner",
        verification_method: "qr"
      })
      .eq("unique_code", code)
      .eq("is_verified", false)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({
        success: false,
        message: "Ticket already checked in or not found"
      }, { status: 404 });
    }

    // Update main tickets table (sync)
    await supabaseAdmin
      .from("tickets")
      .update({
        is_verified: true,
        verified_at: new Date().toISOString()
      })
      .eq("unique_code", code);

    return NextResponse.json({
      success: true,
      message: "Ticket checked in successfully",
      ticket: data
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({
      success: false,
      message: "Server error. Please try again."
    }, { status: 500 });
  }
}
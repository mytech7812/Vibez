import { NextResponse } from "next/server";
import { verifyPayment } from "@/lib/paystack";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ success: false, error: "Reference required" }, { status: 400 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Verify with Paystack
    const payment = await verifyPayment(reference);

    if (!payment?.status || payment.data?.status !== "success") {
      return NextResponse.json({ success: false, error: "Payment not successful" });
    }

    const orderId = payment.data.metadata?.order_id;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID not found" });
    }

    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, order_reference, buyer_name, buyer_email, subtotal, service_fee, total_amount, payment_reference")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ success: false, error: "Order not found" });
    }

    // Get event details
    const { data: event } = await supabaseAdmin
      .from("events")
      .select("title, date, doors_open, venue_name")
      .single();

    // Get ticket lines from metadata
    const ticketLines = payment.data.metadata?.ticket_lines || [];

    // Get ticket codes for this order
    const { data: ticketCodes } = await supabaseAdmin
      .from('tickets')
      .select('unique_code')
      .eq('order_id', orderId);

    return NextResponse.json({
      success: true,
      order,
      event: event ? {
        title: event.title,
        date: event.date,
        doorsOpen: event.doors_open,
        venueName: event.venue_name,
      } : null,
      ticketLines,
      ticketCodes: ticketCodes || [],  // ← Added this
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
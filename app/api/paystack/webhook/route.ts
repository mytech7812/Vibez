import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getPaystackSecret, verifyPayment } from "@/lib/paystack";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // Verify webhook signature
    const secret = getPaystackSecret();
    const hash = createHmac('sha512', secret)
      .update(body)
      .digest('hex');

    if (
      !signature ||
      signature.length !== hash.length ||
      !timingSafeEqual(Buffer.from(hash), Buffer.from(signature))
    ) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Handle successful payment
    if (event.event === 'charge.success') {
      const { reference } = event.data;

      // Verify payment
      const verification = await verifyPayment(reference);

      if (verification.status && verification.data.status === 'success') {
        const orderId = verification.data.metadata?.order_id;

        if (typeof orderId !== "string") {
          throw new Error("Paystack payment metadata is missing the order ID.");
        }

        // Update order status
        const supabaseAdmin = getSupabaseAdmin();
// Update order status
await supabaseAdmin
  .from('orders')
  .update({
    payment_status: 'paid',
    payment_method: verification.data.channel,
    payment_reference: reference,
    paid_at: new Date().toISOString(),
  })
  .eq('id', orderId);

// Update sold_count for each tier
const { data: orderTiers } = await supabaseAdmin
  .from('orders')
  .select('tier_quantities')
  .eq('id', orderId)
  .single();

if (orderTiers?.tier_quantities) {
  for (const [tierId, qty] of Object.entries(orderTiers.tier_quantities)) {
    await supabaseAdmin.rpc('increment_sold_count', {
      tier_id: tierId,
      amount: qty as number
    });
  }
}

console.log('✅ Payment confirmed for order:', orderId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

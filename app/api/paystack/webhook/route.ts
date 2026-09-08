import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getPaystackSecret, verifyPayment } from "@/lib/paystack";
import { sendTicketEmail } from "@/lib/email/send";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    console.log('🔔 Webhook received at:', new Date().toISOString());

    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    const secret = getPaystackSecret();
    const hash = createHmac('sha512', secret)
      .update(body)
      .digest('hex');

    if (
      !signature ||
      signature.length !== hash.length ||
      !timingSafeEqual(Buffer.from(hash), Buffer.from(signature))
    ) {
      console.error('❌ Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const { reference } = event.data;
      const verification = await verifyPayment(reference);

      if (verification.status && verification.data.status === 'success') {
        const orderId = verification.data.metadata?.order_id;

        if (typeof orderId !== "string") {
          throw new Error("Paystack payment metadata is missing the order ID.");
        }

        const supabaseAdmin = getSupabaseAdmin();

        // 1. Check if order is already fulfilled
        const { data: existingOrder } = await supabaseAdmin
          .from('orders')
          .select('payment_status, fulfillment_status')
          .eq('id', orderId)
          .single();

        if (existingOrder?.payment_status === 'paid' && existingOrder?.fulfillment_status === 'fulfilled') {
          console.log('⏭️ Order already fulfilled, skipping duplicate webhook');
          return NextResponse.json({ received: true, already_processed: true });
        }

        // 2. Get order details for validation
        const { data: orderData } = await supabaseAdmin
          .from('orders')
          .select('total_amount, buyer_email, payment_reference')
          .eq('id', orderId)
          .single();

        if (!orderData) {
          console.error('❌ Order not found for validation');
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // VALIDATION CHECKS
        // 1. Check if this order already has a different payment reference
        if (orderData.payment_reference && orderData.payment_reference !== reference) {
          console.error('❌ Payment reference mismatch. Order has:', orderData.payment_reference, 'Received:', reference);
          return NextResponse.json({ error: 'Payment reference mismatch' }, { status: 400 });
        }

        // 2. Verify amount matches
        const expectedAmount = Math.round(Number(orderData.total_amount) * 100);
        const receivedAmount = Number(verification.data.amount);
        if (receivedAmount !== expectedAmount) {
          console.error('❌ Amount mismatch. Expected:', expectedAmount, 'Received:', receivedAmount);
          return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
        }

        // 3. Verify currency
        if (verification.data.currency !== 'NGN') {
          console.error('❌ Currency mismatch. Expected: NGN, Received:', verification.data.currency);
          return NextResponse.json({ error: 'Currency mismatch' }, { status: 400 });
        }

        // 4. Verify email matches
        const customerEmail = verification.data.customer?.email?.toLowerCase();
        const orderEmail = orderData.buyer_email?.toLowerCase();
        if (customerEmail !== orderEmail) {
          console.error('❌ Email mismatch. Order:', orderEmail, 'Paystack:', customerEmail);
          return NextResponse.json({ error: 'Email mismatch' }, { status: 400 });
        }

        console.log('✅ All payment validations passed');

        // 3. Update order status with fulfillment guard
        const { data: updatedOrder, error: updateError } = await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'paid',
            payment_method: verification.data.channel,
            payment_reference: reference,
            paid_at: new Date().toISOString(),
            fulfillment_status: 'processing',
          })
          .eq('id', orderId)
          .eq('payment_status', 'pending')
          .select()
          .single();

        if (updateError || !updatedOrder) {
          console.log('⏭️ Order already processed or not found');
          return NextResponse.json({ received: true, already_processed: true });
        }

        // 4. Get full order details for ticket generation
        const { data: fullOrderData } = await supabaseAdmin
          .from('orders')
          .select('buyer_name, buyer_email, tier_quantities, event_id, order_reference')
          .eq('id', orderId)
          .single();

        if (!fullOrderData) {
          console.error('❌ Order not found for ticket generation');
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // 5. Generate tickets
        const tierQuantities = fullOrderData.tier_quantities || {};
        const orderRef = fullOrderData.order_reference;

        // Get tier names
        const { data: tiers } = await supabaseAdmin
          .from('ticket_tiers')
          .select('id, name')
          .in('id', Object.keys(tierQuantities));

        const tierMap: Record<string, string> = {};
        tiers?.forEach((t: any) => { tierMap[t.id] = t.name; });


function generateShortCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateSecretToken() {
  return randomBytes(32).toString('base64url');
}

        const ticketsToInsert: any[] = [];
        const usedCodes = new Set<string>();

        for (const [tierId, quantity] of Object.entries(tierQuantities) as [string, number][]) {
          for (let i = 0; i < quantity; i++) {
            let uniqueCode;
            let attempts = 0;
            do {
              uniqueCode = generateShortCode();
              attempts++;
            } while (usedCodes.has(uniqueCode) && attempts < 100);
            
            usedCodes.add(uniqueCode);
const secretToken = generateSecretToken();

ticketsToInsert.push({
  order_id: orderId,
  tier_id: tierId,
  unique_code: uniqueCode,
  secret_token: secretToken,  // ← Add this
  attendee_name: fullOrderData.buyer_name,
  attendee_email: fullOrderData.buyer_email,
  is_verified: false,
});
          }
        }

        // 6. Insert tickets
        if (ticketsToInsert.length > 0) {
          const { data: insertedData, error: ticketError } = await supabaseAdmin
            .from('tickets')
            .insert(ticketsToInsert)
            .select();

          if (ticketError) {
            console.error('❌ TICKET INSERT ERROR:', ticketError);
          } else {
            console.log(`✅ Generated ${ticketsToInsert.length} tickets`);
            
            // Send email
            try {
              const { data: eventData } = await supabaseAdmin
                .from('events')
                .select('*')
                .eq('id', fullOrderData.event_id)
                .single();

              if (eventData) {
                await sendTicketEmail(fullOrderData, ticketsToInsert, eventData);
                console.log('✅ Email sent to:', fullOrderData.buyer_email);
              }
            } catch (emailError) {
              console.error('❌ Email error:', emailError);
            }
          }
        }

        // 7. Mark order as fulfilled
        await supabaseAdmin
          .from('orders')
          .update({
            fulfillment_status: 'fulfilled',
          })
          .eq('id', orderId);

        // 8. Update sold_count
        for (const [tierId, qty] of Object.entries(tierQuantities) as [string, number][]) {
          await supabaseAdmin.rpc('increment_sold_count', {
            tier_id: tierId,
            amount: qty
          });
        }

        console.log('✅ Order fulfilled:', orderId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
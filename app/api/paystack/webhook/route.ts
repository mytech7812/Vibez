import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getPaystackSecret, verifyPayment } from "@/lib/paystack";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    console.log('🔔 Webhook received at:', new Date().toISOString());

    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    console.log('📝 Signature present:', !!signature);

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

    console.log('✅ Signature verified');

    const event = JSON.parse(body);
    console.log('📝 Event type:', event.event);

    if (event.event === 'charge.success') {
      console.log('✅ Charge success event received');
      const { reference } = event.data;
      console.log('📦 Reference:', reference);

      const verification = await verifyPayment(reference);
      console.log('📦 Verification status:', verification.status);

      if (verification.status && verification.data.status === 'success') {
        console.log('✅ Payment verified successfully');

        const orderId = verification.data.metadata?.order_id;
        console.log('📦 Order ID from metadata:', orderId);

        if (typeof orderId !== "string") {
          throw new Error("Paystack payment metadata is missing the order ID.");
        }

        const supabaseAdmin = getSupabaseAdmin();

        // 1. Update order status
        console.log('🔄 Updating order status...');
        await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'paid',
            payment_method: verification.data.channel,
            payment_reference: reference,
            paid_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        // 2. Get order details
        console.log('🔄 Fetching order details...');
        const { data: orderData } = await supabaseAdmin
          .from('orders')
          .select('buyer_name, buyer_email, tier_quantities, event_id, order_reference')
          .eq('id', orderId)
          .single();

        if (!orderData) {
          console.error('❌ Order not found for ticket generation');
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        console.log('📦 Order data found:', {
          orderId: orderId,
          buyer: orderData.buyer_name,
          tierQuantities: orderData.tier_quantities,
          orderRef: orderData.order_reference
        });

        // 3. Generate tickets
        const tierQuantities = orderData.tier_quantities || {};
        const orderRef = orderData.order_reference;

        console.log('📦 Tier quantities:', JSON.stringify(tierQuantities));

        // Get tier names
        const { data: tiers } = await supabaseAdmin
          .from('ticket_tiers')
          .select('id, name')
          .in('id', Object.keys(tierQuantities));

        const tierMap: Record<string, string> = {};
        tiers?.forEach((t: any) => { tierMap[t.id] = t.name; });

        console.log('📦 Tier map:', JSON.stringify(tierMap));

        // Generate unique ticket code
        function generateTicketCode(orderRef: string, tierName: string, index: number) {
          const tierShort = tierName.slice(0, 4).toUpperCase();
          return `${orderRef}-${tierShort}-${String(index).padStart(2, '0')}`;
        }

        // Create tickets
        const ticketsToInsert: any[] = [];
        let ticketCount = 0;

        for (const [tierId, quantity] of Object.entries(tierQuantities) as [string, number][]) {
          const tierName = tierMap[tierId] || 'TKT';
          
          for (let i = 0; i < quantity; i++) {
            ticketCount++;
            const uniqueCode = generateTicketCode(orderRef, tierName, ticketCount);
            ticketsToInsert.push({
              order_id: orderId,
              tier_id: tierId,
              unique_code: uniqueCode,
              attendee_name: orderData.buyer_name,
              attendee_email: orderData.buyer_email,
              is_verified: false,
            });
          }
        }

        console.log(`📦 Tickets to insert: ${ticketsToInsert.length}`);
        if (ticketsToInsert.length > 0) {
          console.log('📦 First ticket sample:', JSON.stringify(ticketsToInsert[0]));
        }

        // 4. Insert tickets
        if (ticketsToInsert.length > 0) {
          console.log('🔄 Inserting tickets...');
          const { data: insertedData, error: ticketError } = await supabaseAdmin
            .from('tickets')
            .insert(ticketsToInsert)
            .select();

          if (ticketError) {
            console.error('❌ TICKET INSERT ERROR:');
            console.error('❌ Code:', ticketError.code);
            console.error('❌ Message:', ticketError.message);
            console.error('❌ Details:', ticketError.details);
            console.error('❌ Hint:', ticketError.hint);
          } else {
            console.log(`✅ Generated ${ticketsToInsert.length} tickets for order ${orderId}`);
            console.log('📦 Inserted data:', JSON.stringify(insertedData));
          }
        }

        // 5. Update sold_count
        console.log('🔄 Updating sold_count...');
        for (const [tierId, qty] of Object.entries(tierQuantities) as [string, number][]) {
          console.log(`📦 Updating sold_count for tier ${tierId}: +${qty}`);
          await supabaseAdmin.rpc('increment_sold_count', {
            tier_id: tierId,
            amount: qty
          });
        }

        console.log('✅ Payment confirmed for order:', orderId);
      } else {
        console.error('❌ Payment verification failed:', verification);
      }
    } else {
      console.log('📝 Ignoring event type:', event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
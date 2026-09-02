import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { initializePayment } from "@/lib/paystack";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type TicketQuantity = { tierId: string; quantity: number };
type TicketTierRow = {
  id: string;
  event_id: string;
  name: string;
  price: number;
  total_capacity: number;
  sold_count: number;
};

function parseTierQuantities(value: unknown): TicketQuantity[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Select at least one ticket before continuing.");
  }

  const selections = Object.entries(value)
    .map(([tierId, quantity]) => ({ tierId, quantity: Number(quantity) }))
    .filter(({ quantity }) => quantity > 0);

  if (
    selections.length === 0 ||
    selections.some(
      ({ tierId, quantity }) =>
        !tierId || !Number.isInteger(quantity) || quantity > 10
    )
  ) {
    throw new Error("Your ticket selection is invalid.");
  }

  return selections;
}

export async function POST(request: Request) {
  try {
    const { email, name, phone, tierQuantities } = await request.json();

    if (
      typeof email !== "string" ||
      typeof name !== "string" ||
      typeof phone !== "string" ||
      !email.trim() ||
      !name.trim() ||
      !phone.trim()
    ) {
      return NextResponse.json(
        { success: false, error: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    const selections = parseTierQuantities(tierQuantities);
    const supabaseAdmin = getSupabaseAdmin();
    const tierIds = selections.map(({ tierId }) => tierId);
    const { data: tierRows, error: tiersError } = await supabaseAdmin
      .from("ticket_tiers")
      .select("id, event_id, name, price, total_capacity, sold_count")
      .in("id", tierIds);

    if (tiersError || !tierRows || tierRows.length !== selections.length) {
      throw new Error("One or more selected ticket types are unavailable.");
    }

    const tiers = tierRows as TicketTierRow[];
    const tierById = new Map(tiers.map((tier) => [tier.id, tier]));
    const eventIds = new Set(tiers.map((tier) => tier.event_id));

    if (eventIds.size !== 1) {
      throw new Error("Tickets must belong to the same event.");
    }

    const subtotal = selections.reduce((sum, { tierId, quantity }) => {
      const tier = tierById.get(tierId);

      if (!tier) {
        throw new Error("A selected ticket type is unavailable.");
      }

      const remaining = tier.total_capacity - (tier.sold_count ?? 0);
      if (quantity > remaining) {
        throw new Error(`${tierId} does not have enough tickets remaining.`);
      }

      return sum + tier.price * quantity;
    }, 0);

    const serviceFee = Math.round(subtotal * 0.05);
    const total = subtotal + serviceFee;
    const eventId = tiers[0].event_id;
    const orderRef = `VD-${randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_reference: orderRef,
        event_id: eventId,
        buyer_name: name.trim(),
        buyer_email: email.trim().toLowerCase(),
        buyer_phone: phone.trim(),
        subtotal,
        service_fee: serviceFee,
        total_amount: total,
        payment_status: "pending",
        tier_quantities: selections.reduce<Record<string, number>>(
          (quantities, { tierId, quantity }) => {
            quantities[tierId] = quantity;
            return quantities;
          },
          {}
        )
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error(orderError?.message || "Could not create the order.");
    }

    const callbackUrl = new URL("/checkout/confirmation", request.url);
    callbackUrl.searchParams.set("order", order.id);

    const payment = await initializePayment({
      email: email.trim().toLowerCase(),
      amount: total,
      callbackUrl: callbackUrl.toString(),
      metadata: {
        order_id: order.id,
        order_reference: orderRef,
        tier_quantities: selections.reduce<Record<string, number>>(
          (quantities, { tierId, quantity }) => {
            quantities[tierId] = quantity;
            return quantities;
          },
          {}
        ),
        ticket_lines: selections.map(({ tierId, quantity }) => {
          const tier = tierById.get(tierId)!;
          return { tier_id: tier.id, name: tier.name, quantity, price: tier.price };
        }),
      },
    });

    if (!payment.status || !payment.data?.authorization_url || !payment.data?.reference) {
      throw new Error(payment.message || "Payment initialization failed.");
    }

    const { error: referenceError } = await supabaseAdmin
      .from("orders")
      .update({ payment_reference: payment.data.reference })
      .eq("id", order.id);

    if (referenceError) {
      throw new Error("Could not save the payment reference.");
    }

    return NextResponse.json({
      success: true,
      authorization_url: payment.data.authorization_url,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    const message =
      error instanceof Error ? error.message : "Payment initialization failed.";

    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

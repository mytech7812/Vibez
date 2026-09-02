import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/CheckoutForm";
import { OrderSummary, type OrderLine } from "@/components/OrderSummary";
import { getEvent } from "@/lib/data";
import { formatNaira } from "@/lib/format";

export const dynamic = "force-dynamic";

type CheckoutSearchParams = Record<string, string | string[] | undefined>;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: CheckoutSearchParams;
}) {
  const event = await getEvent();

  if (!event) {
    redirect("/#tickets");
  }

  const lines: OrderLine[] = event.tiers
    .map((tier) => {
      const rawQuantity = searchParams[tier.id];
      const quantity = Array.isArray(rawQuantity)
        ? Number(rawQuantity[0])
        : Number(rawQuantity || 0);

      return {
        tierId: tier.id,
        name: tier.name,
        qty: Number.isInteger(quantity) && quantity > 0 ? quantity : 0,
        price: tier.price,
      };
    })
    .filter((line) => line.qty > 0);

  if (lines.length === 0) {
    redirect("/#tickets");
  }

  const tierQuantities = Object.fromEntries(
    lines.map((line) => [line.tierId, line.qty])
  );
  const subtotal = lines.reduce(
    (sum, line) => sum + line.qty * line.price,
    0
  );
  const total = subtotal + Math.round(subtotal * 0.05);

  return (
    <section className="container-page grid grid-cols-1 gap-12 pb-24 pt-36 lg:grid-cols-[1fr_400px] lg:gap-16">
      <div>
        <p className="text-[13px] font-medium tracking-wide text-signal">
          Checkout
        </p>
        <h1 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
          Almost there
        </h1>
        <div className="mt-10 max-w-lg">
          <CheckoutForm
            total={formatNaira(total)}
            tierQuantities={tierQuantities}
          />
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <OrderSummary event={event} lines={lines} />
      </aside>
    </section>
  );
}

import { redirect } from "next/navigation";
import { getEvent } from "@/lib/data";
import { OrderSummary, OrderLine } from "@/components/OrderSummary";
import { CheckoutForm } from "@/components/CheckoutForm";
import { formatNaira } from "@/lib/format";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const event = await getEvent();

  if (!event) {
    redirect("/");
  }

  const lines: OrderLine[] = event.tiers
    .map((tier: any) => {
      const raw = params[tier.id];
      const qty = Array.isArray(raw) ? Number(raw[0]) : Number(raw || 0);
      return { tierId: tier.id, name: tier.name, qty, price: tier.price };
    })
    .filter((line: any) => line.qty > 0);

  if (lines.length === 0) {
    redirect("/#tickets");
  }

  const subtotal = lines.reduce((sum, l) => sum + l.qty * l.price, 0);
  const total = subtotal + Math.round(subtotal * 0.05);

  const queryString = new URLSearchParams(
    Object.fromEntries(lines.map((l) => [l.tierId, String(l.qty)]))
  ).toString();

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
          <CheckoutForm queryString={queryString} total={formatNaira(total)} />
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <OrderSummary event={event} lines={lines} />
      </aside>
    </section>
  );
}
import { CheckCircle2, QrCode } from "lucide-react";
import { getEvent } from "@/lib/data";
import { formatEventDate, formatNaira } from "@/lib/format";
import { LinkButton } from "@/components/Button";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const event = await getEvent();

  if (!event) {
    return <div>Event not found</div>;
  }

  const name = (params.name as string) || "Guest";
  const email = (params.email as string) || "";

  const lines = event.tiers
    .map((tier: any) => {
      const raw = params[tier.id];
      const qty = Array.isArray(raw) ? Number(raw[0]) : Number(raw || 0);
      return { name: tier.name, qty, price: tier.price };
    })
    .filter((l: any) => l.qty > 0);

  const subtotal = lines.reduce((sum: number, l: any) => sum + l.qty * l.price, 0);
  const total = subtotal + Math.round(subtotal * 0.05);
  const orderRef = `VD-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <section className="container-page flex flex-col items-center pb-24 pt-36 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-signal/15 text-signal">
        <CheckCircle2 size={28} />
      </span>
      <h1 className="mt-6 font-display text-3xl text-ink sm:text-4xl">
        You&apos;re going, {name.split(" ")[0]}
      </h1>
      <p className="mt-3 max-w-md text-[15px] text-ink-muted">
        A confirmation and your tickets have been sent to{" "}
        <span className="text-ink">{email || "your email"}</span>. This is a
        preview order — no payment was taken.
      </p>

      <div className="mt-10 w-full max-w-md rounded-card border border-surface-line bg-surface p-6 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-faint">Order reference</span>
          <span className="font-sans text-sm font-semibold text-ink">
            {orderRef}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-center rounded-card border border-dashed border-surface-line bg-surface-raised py-8">
          <div className="flex flex-col items-center gap-2">
            <QrCode size={64} className="text-ink-muted" />
            <span className="text-xs text-ink-faint">
              QR ticket generates here
            </span>
          </div>
        </div>

        <div className="mt-5 border-t border-surface-line pt-5">
          <h2 className="font-display text-lg text-ink">{event.title}</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {formatEventDate(event.date)} · {event.doorsOpen}
          </p>
          <p className="text-sm text-ink-muted">
            {event.venueName}, {event.city}
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t border-surface-line pt-5">
          {lines.map((line: any) => (
            <div key={line.name} className="flex justify-between text-sm">
              <span className="text-ink-muted">
                {line.qty} × {line.name}
              </span>
              <span className="text-ink">
                {formatNaira(line.qty * line.price)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-surface-line pt-4">
          <span className="text-sm font-medium text-ink">Total paid</span>
          <span className="font-display text-xl text-ink">
            {formatNaira(total)}
          </span>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <LinkButton href="/#tickets" variant="outline" size="md">
          Back to tickets
        </LinkButton>
        <LinkButton href="/" variant="primary" size="md">
          Back to home
        </LinkButton>
      </div>
    </section>
  );
}
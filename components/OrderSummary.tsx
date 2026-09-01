import { EventRecord } from "@/lib/types";
import { formatEventDate, formatNaira } from "@/lib/format";

export type OrderLine = { tierId: string; name: string; qty: number; price: number };

export function OrderSummary({
  event,
  lines,
}: {
  event: EventRecord;
  lines: OrderLine[];
}) {
  const subtotal = lines.reduce((sum, l) => sum + l.qty * l.price, 0);
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  return (
    <div className="rounded-card border border-surface-line bg-surface p-6">
      <span className="text-[11px] font-medium tracking-wide text-ink-muted">
        {event.category.toUpperCase()}
      </span>
      <h3 className="mt-1 font-display text-xl leading-snug text-ink">
        {event.title}
      </h3>
      <p className="mt-1 text-sm text-ink-muted">
        {formatEventDate(event.date)} · {event.doorsOpen}
      </p>
      <p className="text-sm text-ink-muted">
        {event.venueName}, {event.city}
      </p>

      <div className="mt-6 flex flex-col gap-3 border-t border-surface-line pt-5">
        {lines.map((line) => (
          <div key={line.tierId} className="flex items-start justify-between">
            <div>
              <p className="text-sm text-ink">{line.name}</p>
              <p className="text-xs text-ink-faint">
                {line.qty} × {formatNaira(line.price)}
              </p>
            </div>
            <span className="text-sm text-ink">
              {formatNaira(line.qty * line.price)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-surface-line pt-5 text-sm">
        <div className="flex justify-between text-ink-muted">
          <span>Subtotal</span>
          <span>{formatNaira(subtotal)}</span>
        </div>
        <div className="flex justify-between text-ink-muted">
          <span>Service fee</span>
          <span>{formatNaira(serviceFee)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-surface-line pt-4">
        <span className="font-sans text-sm font-semibold text-ink">Total</span>
        <span className="font-display text-2xl text-ink">
          {formatNaira(total)}
        </span>
      </div>
    </div>
  );
}

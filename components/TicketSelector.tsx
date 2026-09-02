"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { EventRecord } from "@/lib/types";
import { formatNaira } from "@/lib/format";
import { QuantityStepper } from "./QuantityStepper";
import { Button } from "./Button";

export function TicketSelector({ event }: { event: EventRecord }) {
  const router = useRouter();
  const [selection, setSelection] = useState<Record<string, number>>({});

  const totalQty = useMemo(
    () => Object.values(selection).reduce((sum, n) => sum + n, 0),
    [selection]
  );

  const totalPrice = useMemo(
    () =>
      event.tiers.reduce(
        (sum, tier) => sum + (selection[tier.id] || 0) * tier.price,
        0
      ),
    [selection, event.tiers]
  );

  function setQty(tierId: string, qty: number) {
    setSelection((prev) => ({ ...prev, [tierId]: qty }));
  }

  function handleContinue() {
    const params = new URLSearchParams();
    Object.entries(selection)
      .filter(([, qty]) => qty > 0)
      .forEach(([tierId, qty]) => params.append(tierId, String(qty)));
    router.push(`/checkout?${params.toString()}`);
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col divide-y divide-surface-line border-y border-surface-line">
        {event.tiers.map((tier) => {
          const qty = selection[tier.id] || 0;
          const selected = qty > 0;
          return (
            <div
              key={tier.id}
              className={`flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between ${
                tier.isSoldOut ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {selected && !tier.isSoldOut && (
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-signal">
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </span>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-sans text-[15px] font-semibold text-ink">
                      {tier.name}
                    </h4>
                    {tier.isSoldOut && (
                      <span className="rounded-sm bg-surface-raised px-2 py-0.5 text-[10px] font-medium tracking-wide text-ink-muted">
                        SOLD OUT
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">
                    {tier.description}
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {tier.perks.map((perk) => (
                      <li
                        key={perk}
                        className="text-xs text-ink-faint before:mr-1 before:content-['—']"
                      >
                        {perk}
                      </li>
                    ))}
                  </ul>
                  {/* Remaining tickets count */}
<p className="mt-2 text-xs text-ink-faint">
  {tier.quantityAvailable} tickets remaining
</p>

                </div>
              </div>

              <div className="flex items-center justify-between gap-6 sm:justify-end">
                <span className="font-sans text-[15px] font-semibold text-ink">
                  {formatNaira(tier.price)}
                </span>
                <QuantityStepper
                  value={qty}
                  onChange={(next) => setQty(tier.id, next)}
                  disabled={tier.isSoldOut}
                  max={Math.min(10, tier.quantityAvailable || 10)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 mt-6 flex flex-col gap-4 rounded-card border border-surface-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-ink-muted">
            {totalQty > 0
              ? `${totalQty} ticket${totalQty > 1 ? "s" : ""} selected`
              : "Select tickets to continue"}
          </p>
          <p className="font-display text-2xl text-ink">
            {formatNaira(totalPrice)}
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          disabled={totalQty === 0}
          onClick={handleContinue}
          className="w-full sm:w-auto"
        >
          Continue to Checkout
        </Button>
      </div>
    </div>
  );
}

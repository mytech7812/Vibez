"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCard";
import { formatNaira } from "@/lib/format";
import { supabase } from "@/lib/supabase";

interface Tier {
  id: string;
  name: string;
  price: number;
  total_capacity: number;
  sold_count: number;
}

export default function AdminTicketsPage() {
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { price: number; remaining: number }>>({});
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTiers() {
      const { data } = await supabase
        .from('ticket_tiers')
        .select('*');

      if (data) {
        setTiers(data);
        const initialDrafts: Record<string, { price: number; remaining: number }> = {};
        data.forEach((tier: Tier) => {
          initialDrafts[tier.id] = {
            price: tier.price,
            remaining: tier.total_capacity - (tier.sold_count || 0),
          };
        });
        setDrafts(initialDrafts);
      }
      setLoading(false);
    }

    fetchTiers();
  }, []);

  function updateDraft(id: string, patch: Partial<{ price: number; remaining: number }>) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  }

  async function handleSave(id: string) {
    const draft = drafts[id];
    const tier = tiers.find((t) => t.id === id);
    if (!tier || !draft) return;

    const { error } = await supabase
      .from('ticket_tiers')
      .update({
        price: draft.price,
        total_capacity: (tier.sold_count || 0) + draft.remaining,
      })
      .eq('id', id);

    if (!error) {
      setSavedId(id);
      setTimeout(() => setSavedId(null), 2000);
      // Refresh tiers
      const { data } = await supabase.from('ticket_tiers').select('*');
      if (data) setTiers(data);
    } else {
      alert('Error saving ticket: ' + error.message);
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-[var(--a-ink-muted)]">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--a-ink)]">Tickets</h1>
        <p className="mt-1 text-sm text-[var(--a-ink-muted)]">
          Manage pricing and remaining inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {tiers.map((tier) => {
          const sold = tier.sold_count || 0;
          const draft = drafts[tier.id];
          if (!draft) return null;
          const capacity = sold + draft.remaining;

          return (
            <AdminCard key={tier.id} title={`${tier.name}'s Ticket`}>
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <Stat label="Sold" value={sold.toLocaleString()} />
                  <Stat label="Capacity" value={capacity.toLocaleString()} />
                </div>

                <label className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-[var(--a-ink-muted)]">
                    Price (₦)
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={draft.price}
                    onChange={(e) =>
                      updateDraft(tier.id, { price: Number(e.target.value) })
                    }
                    className="rounded-md border border-[var(--a-line)] bg-[var(--a-surface-raised)] px-3 py-2.5 text-sm text-[var(--a-ink)] focus:border-signal"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-[var(--a-ink-muted)]">
                    Remaining inventory
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={draft.remaining}
                    onChange={(e) =>
                      updateDraft(tier.id, {
                        remaining: Number(e.target.value),
                      })
                    }
                    className="rounded-md border border-[var(--a-line)] bg-[var(--a-surface-raised)] px-3 py-2.5 text-sm text-[var(--a-ink)] focus:border-signal"
                  />
                </label>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--a-ink-faint)]">
                    Currently listed at {formatNaira(tier.price)}
                  </span>
                  <button
                    onClick={() => handleSave(tier.id)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-signal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-signal-dim"
                  >
                    {savedId === tier.id ? (
                      <>
                        <Check size={14} /> Saved
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </button>
                </div>
              </div>
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--a-line)] bg-[var(--a-surface-raised)] p-3.5">
      <p className="text-xs text-[var(--a-ink-faint)]">{label}</p>
      <p className="mt-1 font-display text-xl text-[var(--a-ink)]">{value}</p>
    </div>
  );
}
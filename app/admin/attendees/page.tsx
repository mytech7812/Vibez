"use client";

import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { AdminCard, StatusDot } from "@/components/admin/AdminCard";
import { formatNaira } from "@/lib/format";
import { getSupabase } from "@/lib/supabase";

interface Order {
  id: string;
  order_reference: string;
  buyer_name: string;
  buyer_email: string;
  total_amount: number;
  payment_status: string;
  created_at: string;
  tier_quantities: Record<string, number> | null;
}

interface Tier {
  id: string;
  name: string;
}

export default function AdminAttendeesPage() {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = getSupabase();
      
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, order_reference, buyer_name, buyer_email, total_amount, payment_status, created_at, tier_quantities')
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false });

      if (ordersData) setOrders(ordersData);

      const { data: tiersData } = await supabase
        .from('ticket_tiers')
        .select('id, name');

      if (tiersData) setTiers(tiersData);

      setLoading(false);
    }

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.buyer_name.toLowerCase().includes(q) ||
        o.buyer_email.toLowerCase().includes(q) ||
        o.order_reference.toLowerCase().includes(q)
    );
  }, [query, orders]);

  if (loading) {
    return <div className="text-center py-20 text-[var(--a-ink-muted)]">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-[var(--a-ink)]">
            Attendees
          </h1>
          <p className="mt-1 text-sm text-[var(--a-ink-muted)]">
            {orders.length} paid orders · {filtered.length} shown
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--a-ink-faint)]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search by name, email, or ID"
            className="w-full rounded-md border border-[var(--a-line)] bg-[var(--a-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--a-ink)] placeholder:text-[var(--a-ink-faint)] focus:border-signal"
          />
        </div>
      </div>

      <AdminCard>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="text-xs text-[var(--a-ink-faint)]">
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Buyer ID</th>
                <th className="pb-3 font-medium">Ticket Tier</th>
                <th className="pb-3 font-medium">Qty</th>
                <th className="pb-3 text-right font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-[var(--a-line)]">
                  <td className="py-3 text-[var(--a-ink-muted)] whitespace-nowrap">
                    {new Date(o.created_at).toLocaleString("en-NG", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 text-[var(--a-ink)]">{o.buyer_name}</td>
                  <td className="py-3 text-[var(--a-ink-muted)] font-mono text-xs">
                    {o.order_reference}
                  </td>
                  <td className="py-3 text-[var(--a-ink-muted)]">
                    {formatTierSummary(o.tier_quantities, tiers)}
                  </td>
                  <td className="py-3 text-[var(--a-ink-muted)]">
                    {formatQtySummary(o.tier_quantities)}
                  </td>
                  <td className="py-3 text-right text-[var(--a-ink)]">
                    {formatNaira(Number(o.total_amount || 0))}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-[var(--a-ink-faint)]"
                  >
                    No paid orders match &ldquo;{query}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}

function formatTierSummary(
  tierQuantities: Record<string, number> | null,
  tiers: Tier[]
) {
  if (!tierQuantities) return "—";
  const tierNames = new Map(tiers.map((t) => [t.id, t.name]));
  const summary = Object.entries(tierQuantities)
    .filter(([, qty]) => Number(qty) > 0)
    .map(([tierId]) => tierNames.get(tierId) || "Ticket");
  return summary.length > 0 ? summary.join(", ") : "—";
}

function formatQtySummary(tierQuantities: Record<string, number> | null) {
  if (!tierQuantities) return "—";
  const total = Object.values(tierQuantities).reduce(
    (sum, qty) => sum + Number(qty),
    0
  );
  return total > 0 ? String(total) : "—";
}
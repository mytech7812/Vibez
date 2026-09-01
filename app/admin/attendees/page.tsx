"use client";

import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { AdminCard, StatusDot } from "@/components/admin/AdminCard";
import { formatNaira } from "@/lib/format";
import { supabase } from "@/lib/supabase";

interface Order {
  id: string;
  order_reference: string;
  buyer_name: string;
  buyer_email: string;
  ticket_type: string;
  quantity: number;
  amount: number;
  status: string;
}

export default function AdminAttendeesPage() {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setOrders(data);
      }
      setLoading(false);
    }

    fetchOrders();
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
            {orders.length} orders · {filtered.length} shown
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
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="text-xs text-[var(--a-ink-faint)]">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Buyer</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Qty</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-[var(--a-line)]">
                  <td className="py-3 text-[var(--a-ink)]">{o.order_reference}</td>
                  <td className="py-3 text-[var(--a-ink)]">{o.buyer_name}</td>
                  <td className="py-3 text-[var(--a-ink-muted)]">{o.buyer_email}</td>
                  <td className="py-3 text-[var(--a-ink-muted)]">{o.ticket_type}</td>
                  <td className="py-3 text-[var(--a-ink-muted)]">{o.quantity}</td>
                  <td className="py-3">
                    <StatusDot status={o.status as "Successful" | "Pending" | "Failed"} />
                  </td>
                  <td className="py-3 text-right text-[var(--a-ink)]">
                    {formatNaira(o.amount)}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-[var(--a-ink-faint)]"
                  >
                    No orders match &ldquo;{query}&rdquo;.
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
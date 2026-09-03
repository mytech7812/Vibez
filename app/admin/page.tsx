"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AdminCard, StatCard, StatusDot } from "@/components/admin/AdminCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { TicketSplitChart } from "@/components/admin/TicketSplitChart";
import { formatNaira } from "@/lib/format";
import { getSupabase } from '@/lib/supabase';


interface Order {
  id: string;
  buyer_name: string;
  buyer_email: string;
  ticket_type: string;
  quantity: number;
  amount: number;
  payment_status: string;
  order_reference: string;
}

interface Tier {
  id: string;
  name: string;
  price: number;
  sold_count: number;
  total_capacity: number;
}

export default function AdminOverviewPage() {
  const [period, setPeriod] = useState<"monthly" | "weekly">("monthly");
  const [orders, setOrders] = useState<Order[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = getSupabase();

      setLoading(true);
      
      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersData) {
        setOrders(ordersData);
      }

      // Fetch tiers
      const { data: tiersData } = await supabase
        .from('ticket_tiers')
        .select('*');

      if (tiersData) {
        setTiers(tiersData);
      }

      setLoading(false);
    }

    fetchData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Calculate stats
  const totalTicketsSold = tiers.reduce((sum, t) => sum + (t.sold_count || 0), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalCapacity = tiers.reduce((sum, t) => sum + t.total_capacity, 0);
  const remaining = totalCapacity - totalTicketsSold;

  const menTier = tiers.find(t => t.name === 'Men');
  const womenTier = tiers.find(t => t.name === 'Women');
  const menSold = menTier?.sold_count || 0;
  const womenSold = womenTier?.sold_count || 0;

  // Mock chart data (replace with real data later)
  const monthlyRevenue = [
    { month: "Jun", revenue: 320000 },
    { month: "Jul", revenue: 810000 },
    { month: "Aug", revenue: 1650000 },
    { month: "Sep", revenue: 1245000 },
  ];

  const weeklyRevenue = [
    { month: "Wk 1", revenue: 610000 },
    { month: "Wk 2", revenue: 480000 },
    { month: "Wk 3", revenue: 890000 },
    { month: "Wk 4", revenue: 1040000 },
    { month: "Wk 5", revenue: 705000 },
    { month: "Wk 6", revenue: 300000 },
  ];

  if (loading) {
    return <div className="text-center py-20 text-ink-muted">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--a-ink)]">
          Overview
        </h1>
        <p className="mt-1 text-sm text-[var(--a-ink-muted)]">
          Afterglow: Rooftop Sessions — Sep 19, 2026
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Tickets Sold"
          value={totalTicketsSold.toLocaleString()}
          trend="18.4%"
          trendDirection="up"
        />
        <StatCard
          label="Total Revenue"
          value={formatNaira(totalRevenue)}
          trend="24.1%"
          trendDirection="up"
        />
        <StatCard
          label="Men's Tickets"
          value={menSold.toLocaleString()}
          trend="12.0%"
          trendDirection="up"
        />
        <StatCard
          label="Women's Tickets"
          value={womenSold.toLocaleString()}
          trend="9.6%"
          trendDirection="up"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <AdminCard
          title="Revenue"
          action={
            <div className="relative">
              <select
                value={period}
                onChange={(e) =>
                  setPeriod(e.target.value as "monthly" | "weekly")
                }
                className="appearance-none rounded-md border border-[var(--a-line)] bg-[var(--a-surface-raised)] py-2 pl-3 pr-8 text-sm text-[var(--a-ink)]"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--a-ink-faint)]"
              />
            </div>
          }
        >
          <RevenueChart data={period === "monthly" ? monthlyRevenue : weeklyRevenue} />
        </AdminCard>

        <AdminCard title="Ticket Split">
          <TicketSplitChart men={menSold} women={womenSold} />
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <span className="flex items-center gap-2 text-[var(--a-ink-muted)]">
              <span className="h-2.5 w-2.5 rounded-full bg-signal" /> Men
            </span>
            <span className="flex items-center gap-2 text-[var(--a-ink-muted)]">
              <span className="h-2.5 w-2.5 rounded-full bg-volt" /> Women
            </span>
          </div>
          <p className="mt-4 text-center text-xs text-[var(--a-ink-faint)]">
            {remaining.toLocaleString()} tickets remaining of{" "}
            {totalCapacity.toLocaleString()} capacity
          </p>
        </AdminCard>
      </div>

      <AdminCard title="Recent Transactions">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-xs text-[var(--a-ink-faint)]">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Buyer</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((order) => (
                <tr key={order.id} className="border-t border-[var(--a-line)]">
                  <td className="py-3 text-[var(--a-ink)]">{order.order_reference || order.id.slice(0, 8)}</td>
                  <td className="py-3 text-[var(--a-ink-muted)]">{order.buyer_name}</td>
                  <td className="py-3 text-[var(--a-ink-muted)]">{order.ticket_type || 'N/A'}</td>
                  <td className="py-3">
                    <StatusDot status={order.payment_status as "Successful" | "Pending" | "Failed"} />
                  </td>
                  <td className="py-3 text-right text-[var(--a-ink)]">
                    {formatNaira(order.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
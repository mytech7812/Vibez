"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Point = { month: string; revenue: number };

export function RevenueChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff2d5e" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#ff2d5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          stroke="var(--a-line)"
          strokeDasharray="4 4"
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--a-ink-faint)", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--a-ink-faint)", fontSize: 12 }}
          tickFormatter={(v: number) => `${v / 1000}k`}
          width={40}
        />
        <Tooltip
          cursor={{ stroke: "var(--a-line)", strokeWidth: 1 }}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const value = payload[0].value as number;
            return (
              <div className="rounded-md bg-[var(--a-ink)] px-3 py-2 text-xs text-[var(--a-bg)] shadow-lg">
                <p className="font-medium">{label}</p>
                <p>
                  ₦
                  {value.toLocaleString("en-NG")}
                </p>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#ff2d5e"
          strokeWidth={2}
          fill="url(#revenueFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

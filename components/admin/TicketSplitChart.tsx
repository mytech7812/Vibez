"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function TicketSplitChart({
  men,
  women,
}: {
  men: number;
  women: number;
}) {
  const total = men + women;
  const data = [
    { name: "Men", value: men, color: "#ff2d5e" },
    { name: "Women", value: women, color: "#a855f7" },
  ];

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={72}
            outerRadius={100}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-[var(--a-ink-muted)]">Total sold</span>
        <span className="font-display text-2xl text-[var(--a-ink)]">
          {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

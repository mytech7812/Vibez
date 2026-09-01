import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export function AdminCard({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[var(--a-line)] bg-[var(--a-surface)] p-6 ${className}`}
    >
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between">
          {title && (
            <h3 className="font-display text-lg text-[var(--a-ink)]">
              {title}
            </h3>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  trend,
  trendDirection,
}: {
  label: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
}) {
  const up = trendDirection === "up";
  return (
    <div className="rounded-xl border border-[var(--a-line)] bg-[var(--a-surface)] p-6">
      <p className="text-sm text-[var(--a-ink-muted)]">{label}</p>
      <p className="mt-3 font-display text-3xl text-[var(--a-ink)]">{value}</p>
      <div className="mt-3 flex items-center gap-1.5 text-xs">
        <span
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
            up
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-signal/10 text-signal"
          }`}
        >
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </span>
        <span className="text-[var(--a-ink-faint)]">vs. last month</span>
      </div>
    </div>
  );
}

export function StatusDot({ status }: { status: "Successful" | "Pending" | "Failed" }) {
  const map = {
    Successful: "bg-emerald-500",
    Pending: "bg-amber-400",
    Failed: "bg-signal",
  } as const;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-[var(--a-ink)]">
      <span className={`h-2 w-2 rounded-full ${map[status]}`} />
      {status}
    </span>
  );
}

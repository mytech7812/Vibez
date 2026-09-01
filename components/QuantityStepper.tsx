"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  onChange,
  max = 10,
  disabled = false,
}: {
  value: number;
  onChange: (next: number) => void;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1 rounded-sm border border-surface-line ${
        disabled ? "opacity-40" : ""
      }`}
    >
      <button
        type="button"
        disabled={disabled || value <= 0}
        onClick={() => onChange(Math.max(0, value - 1))}
        aria-label="Decrease quantity"
        className="flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30"
      >
        <Minus size={15} />
      </button>
      <span className="w-6 text-center font-sans text-sm tabular-nums text-ink">
        {value}
      </span>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase quantity"
        className="flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

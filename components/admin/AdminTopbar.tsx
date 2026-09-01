"use client";

import { Search, Bell, Settings, Sun, Moon } from "lucide-react";

export function AdminTopbar({
  theme,
  onToggleTheme,
}: {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[var(--a-line)] px-6 py-4 sm:px-8">
      <div className="relative hidden max-w-xs flex-1 sm:block">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--a-ink-faint)]"
        />
        <input
          type="text"
          placeholder="Search orders, attendees…"
          className="w-full rounded-md border border-[var(--a-line)] bg-[var(--a-surface-raised)] py-2.5 pl-10 pr-4 text-sm text-[var(--a-ink)] placeholder:text-[var(--a-ink-faint)] focus:border-signal"
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="flex h-9 items-center gap-2 rounded-full border border-[var(--a-line)] px-3 text-xs text-[var(--a-ink-muted)] transition-colors hover:text-[var(--a-ink)]"
        >
          {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
          {theme === "dark" ? "Dark" : "Light"}
        </button>

        <button
          aria-label="Settings"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--a-line)] text-[var(--a-ink-muted)] transition-colors hover:text-[var(--a-ink)]"
        >
          <Settings size={16} />
        </button>

        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--a-line)] text-[var(--a-ink-muted)] transition-colors hover:text-[var(--a-ink)]"
        >
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-signal" />
        </button>

        <div className="flex items-center gap-2.5 border-l border-[var(--a-line)] pl-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised font-sans text-sm font-semibold text-[var(--a-ink)] ring-1 ring-[var(--a-line)]">
            VD
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-medium text-[var(--a-ink)]">Vibe Admin</p>
            <p className="text-xs text-[var(--a-ink-faint)]">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

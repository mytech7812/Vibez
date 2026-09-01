"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutGrid, Ticket, Users } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutGrid },
  { label: "Attendees", href: "/admin/attendees", icon: Users },
  { label: "Event", href: "/admin/event", icon: CalendarDays },
  { label: "Tickets", href: "/admin/tickets", icon: Ticket },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin navigation"
      className="grid grid-cols-4 gap-1 border-b border-[var(--a-line)] bg-[var(--a-surface)] px-2 py-2 lg:hidden"
    >
      {navItems.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-w-0 flex-col items-center gap-1 rounded-md px-1 py-2 text-center text-[11px] font-medium transition-colors sm:flex-row sm:justify-center sm:gap-2 sm:text-xs ${
              active
                ? "bg-signal text-white"
                : "text-[var(--a-ink-muted)] hover:bg-[var(--a-surface-raised)] hover:text-[var(--a-ink)]"
            }`}
          >
            <Icon size={16} className="shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

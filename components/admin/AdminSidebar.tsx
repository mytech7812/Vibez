"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, CalendarDays, Ticket } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutGrid },
  { label: "Attendees", href: "/admin/attendees", icon: Users },
  { label: "Event", href: "/admin/event", icon: CalendarDays },
  { label: "Tickets", href: "/admin/tickets", icon: Ticket },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[var(--a-line)] bg-[var(--a-surface)] px-5 py-6 lg:flex lg:flex-col">
      <Link href="/" className="flex items-center gap-2 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-signal font-display text-sm text-white">
          V
        </span>
        <span className="font-display text-lg text-[var(--a-ink)]">
          Vibe District
        </span>
      </Link>

      <nav className="mt-9 flex flex-col gap-1">
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
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-signal text-white"
                  : "text-[var(--a-ink-muted)] hover:bg-[var(--a-surface-raised)] hover:text-[var(--a-ink)]"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

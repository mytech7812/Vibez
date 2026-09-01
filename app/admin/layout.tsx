"use client";

import { useState } from "react";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <div
      className="admin-shell min-h-screen bg-[var(--a-bg)] p-3 sm:p-6"
      data-theme={theme}
    >
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1520px] overflow-hidden rounded-2xl border border-[var(--a-line)] bg-[var(--a-bg)] lg:flex-row">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar
            theme={theme}
            onToggleTheme={() =>
              setTheme((t) => (t === "dark" ? "light" : "dark"))
            }
          />
          <AdminMobileNav />
          <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

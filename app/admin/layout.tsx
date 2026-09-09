"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Skip auth check if already on login page
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin/login");
        return;
      }

      setLoading(false);
    }

    checkAuth();
  }, [router, pathname]);

  // Show loading only for protected pages
  if (loading && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-signal border-t-transparent"></div>
      </div>
    );
  }

  // Login page - no sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

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
          <main className="flex-1 px-5 py-6 pb-24 sm:px-8 sm:pt-8 sm:pb-24 lg:py-8">
            {children}
          </main>
        </div>
      </div>
      <AdminMobileNav />
    </div>
  );
}

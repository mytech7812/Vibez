"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LinkButton } from "./Button";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Lineup", href: "#lineup" },
  { label: "Venue", href: "#venue" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-tight text-ink">
          Vibe District
        </Link>

        <div className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] font-sans font-medium text-ink/80 hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center">
          <LinkButton href="#tickets" variant="primary" size="md">
            Buy Tickets
          </LinkButton>
        </div>

        <button
          className="lg:hidden text-ink"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-base/98 border-t border-surface-line">
          <div className="container-page flex flex-col gap-1 py-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-[15px] font-sans text-ink/85 border-b border-surface-line/60"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-5">
              <LinkButton href="#tickets" variant="primary" size="md">
                Buy Tickets
              </LinkButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

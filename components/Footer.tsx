import Link from "next/link";
import { Instagram, Twitter, Music2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-surface-line bg-base">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-5">
          <div className="col-span-2">
            <div className="font-display text-2xl text-ink">Vibe District</div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              Tickets for the nights and shows worth planning around. Curated
              events, verified tickets, zero guesswork.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="text-ink-muted hover:text-ink transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                aria-label="Twitter / X"
                className="text-ink-muted hover:text-ink transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="text-ink-muted hover:text-ink transition-colors"
              >
                <Music2 size={18} />
              </a>
            </div>
          </div>

          <div>
            <div className="text-[13px] font-medium text-ink">Explore</div>
            <div className="mt-4 flex flex-col gap-3 text-sm text-ink-muted">
              <a href="#about" className="hover:text-ink transition-colors">
                About the night
              </a>
              <a href="#lineup" className="hover:text-ink transition-colors">
                Lineup
              </a>
              <a href="#tickets" className="hover:text-ink transition-colors">
                Tickets
              </a>
            </div>
          </div>

          <div>
            <div className="text-[13px] font-medium text-ink">Support</div>
            <div className="mt-4 flex flex-col gap-3 text-sm text-ink-muted">
              <Link href="#" className="hover:text-ink transition-colors">
                Help center
              </Link>
              <Link href="#" className="hover:text-ink transition-colors">
                Refund policy
              </Link>
              <Link href="#" className="hover:text-ink transition-colors">
                Contact us
              </Link>
            </div>
          </div>

          <div>
            <div className="text-[13px] font-medium text-ink">Company</div>
            <div className="mt-4 flex flex-col gap-3 text-sm text-ink-muted">
              <Link href="#" className="hover:text-ink transition-colors">
                About
              </Link>
              <Link href="#" className="hover:text-ink transition-colors">
                Partner with us
              </Link>
              <Link href="#" className="hover:text-ink transition-colors">
                Careers
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-surface-line pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} Vibe District. All rights reserved.
          </p>
          <Link
            href="/admin"
            className="text-xs text-ink-faint hover:text-ink-muted transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

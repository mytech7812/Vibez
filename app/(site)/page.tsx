import { Calendar, Clock, MapPin, ShieldCheck, Zap, QrCode } from "lucide-react";
import { LinkButton } from "@/components/Button";
import { TicketSelector } from "@/components/TicketSelector";
import { getEvent } from "@/lib/data";
import { formatEventDate } from "@/lib/format";
import Image from "next/image";
import landingImage from "../../landing.png";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const event = await getEvent();

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <>
      {/* Hero */}
<section className="relative flex min-h-[760px] w-full items-end overflow-hidden bg-base sm:min-h-[860px]">
  {/* Hero Background Image */}
  <div className="absolute inset-0">
    <Image
      src={landingImage}
      alt="Vibe District event crowd"
      fill
      className="object-cover"
      priority
    />
  </div>
  <div className="absolute inset-0 bg-gradient-to-t from-base via-base/60 to-transparent" />

        <div className="container-page relative pb-20 pt-40 sm:pb-28">
          <div className="max-w-3xl">
            <p className="font-sans text-[13px] font-medium tracking-wide text-signal">
              {formatEventDate(event.date)} · {event.venueName}
            </p>
            <h1 className="mt-5 font-display text-[2.75rem] leading-[1.05] text-ink sm:text-6xl lg:text-[5rem]">
              {event.title}
            </h1>
            <p
              className="mt-6 max-w-xl text-[15px] leading-relaxed text-white sm:text-base"
              style={{ color: "#ffffff" }}
            >
              {event.subtitle}. Doors {event.doorsOpen} at {event.venueName},{" "}
              {event.city}.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="#tickets" variant="primary" size="lg">
                Buy Tickets
              </LinkButton>
              <LinkButton href="#about" variant="outline" size="lg">
                Event Details
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-surface-line bg-base">
        <div className="container-page grid grid-cols-1 gap-8 py-10 sm:grid-cols-3">
          <TrustPoint
            icon={<ShieldCheck size={18} />}
            title="Verified tickets"
            copy="Every ticket is issued with a unique QR code and validated at the door."
          />
          <TrustPoint
            icon={<Zap size={18} />}
            title="Instant checkout"
            copy="Select, pay, and get your ticket in your inbox in under a minute."
          />
          <TrustPoint
            icon={<QrCode size={18} />}
            title="No paper needed"
            copy="Your phone is your ticket. Show the QR code and walk in."
          />
        </div>
      </section>

      {/* About */}
      <section id="about" className="container-page py-20 sm:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
              About the night
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
              {event.description}
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-card border border-surface-line bg-surface p-6">
            <InfoRow icon={<Calendar size={17} />} label="Date" value={formatEventDate(event.date)} />
            <InfoRow icon={<Clock size={17} />} label="Doors open" value={event.doorsOpen} />
            <InfoRow icon={<MapPin size={17} />} label="Venue" value={`${event.venueName}, ${event.city}`} />
          </div>
        </div>
      </section>

      {/* Lineup */}
      <section id="lineup" className="border-y border-surface-line bg-surface/40">
        <div className="container-page py-20 sm:py-28">
          <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
            Lineup
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-muted">
            Four sets, one stage, no repeats.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-surface-line sm:grid-cols-2 lg:grid-cols-4">
            {event.lineup.map((act: string) => (
              <div key={act} className="bg-base px-6 py-8">
                <span className="font-display text-lg text-ink">{act}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue */}
      <section id="venue" className="container-page py-20 sm:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
              Venue
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
              {event.venueName}
              <br />
              {event.venueAddress}, {event.city}
            </p>
            <p className="mt-4 text-sm text-ink-faint">
              Entry closes 45 minutes after doors. Valid government ID
              required at check-in.
            </p>
          </div>
          <div className="flex h-64 items-center justify-center rounded-card border border-surface-line bg-surface-raised lg:h-full">
            <span className="text-xs tracking-wide text-ink-faint">
              MAP PLACEHOLDER
            </span>
          </div>
        </div>
      </section>

      {/* Tickets */}
      <section id="tickets" className="container-page pb-24">
        <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
          Tickets
        </h2>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-muted">
          Prices include applicable taxes. Choose your ticket type and
          quantity below.
        </p>
        <div className="mt-8">
          <TicketSelector event={event} />
        </div>
      </section>
    </>
  );
}

function TrustPoint({
  icon,
  title,
  copy,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-signal">
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{copy}</p>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-signal">{icon}</span>
      <div>
        <p className="text-xs text-ink-faint">{label}</p>
        <p className="mt-0.5 text-sm text-ink">{value}</p>
      </div>
    </div>
  );
}

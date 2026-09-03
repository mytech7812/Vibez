"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Receipt,
  User,
  Download,
  Share2,
} from "lucide-react";
import { LinkButton } from "@/components/Button";
import { QRCodeDisplay } from "@/components/QRCode";
import { formatEventDate, formatNaira } from "@/lib/format";

type Order = {
  id: string;
  order_reference: string;
  buyer_name: string;
  buyer_email: string;
  subtotal: number;
  service_fee: number;
  total_amount: number;
  payment_reference: string | null;
};

type EventData = {
  title: string;
  date: string;
  doorsOpen: string;
  venueName: string;
};

type TicketLine = {
  tierId: string;
  name: string;
  quantity: number;
  price: number;
};

function PaymentIssue({ title, message }: { title: string; message: string }) {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center pb-24 pt-36 text-center">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-muted">
        {message}
      </p>
      <div className="mt-8">
        <LinkButton href="/#tickets" variant="primary" size="md">
          Back to tickets
        </LinkButton>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center pb-24 pt-36 text-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-signal border-t-transparent"></div>
      <p className="mt-4 text-ink-muted">Verifying your payment...</p>
    </section>
  );
}

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [event, setEvent] = useState<EventData | null>(null);
  const [ticketLines, setTicketLines] = useState<TicketLine[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      // Get reference from URL params
      const params = new URLSearchParams(window.location.search);
      const reference = params.get("reference") || params.get("trxref");

      if (!reference) {
        setError("Payment not confirmed");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/paystack/verify?reference=${reference}`);
        const data = await response.json();

        if (!data.success) {
          setError(data.error || "Payment verification failed");
          setLoading(false);
          return;
        }

        setOrder(data.order);
        setEvent(data.event);
        setTicketLines(data.ticketLines || []);
        setLoading(false);
      } catch (err) {
        setError("Could not verify payment. Please refresh.");
        setLoading(false);
      }
    }

    verifyPayment();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !order || !event) {
    return <PaymentIssue title="Payment not confirmed" message={error || "Order not found"} />;
  }

  return (
    <section className="container-page flex flex-col items-center pb-24 pt-36">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
          <CheckCircle2 size={32} />
        </span>
        <h1 className="mt-6 font-display text-4xl text-ink sm:text-5xl">
          You&apos;re going, {order.buyer_name.split(" ")[0]}!
        </h1>
        <p className="mt-3 max-w-md text-[15px] text-ink-muted">
          Your tickets have been confirmed and sent to{" "}
          <span className="font-medium text-ink">{order.buyer_email}</span>.
        </p>
      </div>

      <div className="mt-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-surface-line bg-surface">
        <div className="flex items-center justify-between border-b border-surface-line bg-surface-raised px-6 py-4">
          <div className="flex items-center gap-3">
            <Receipt size={18} className="text-ink-muted" />
            <span className="text-sm font-medium text-ink">Order</span>
            <span className="font-mono text-sm text-ink-muted">
              {order.order_reference}
            </span>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-500">
            Confirmed
          </span>
        </div>

        <div className="border-b border-surface-line px-6 py-5">
          <h2 className="font-display text-xl text-ink">{event.title}</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <Calendar size={15} className="text-signal" />
              <span>{formatEventDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <Clock size={15} className="text-signal" />
              <span>Doors {event.doorsOpen}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <MapPin size={15} className="text-signal" />
              <span>{event.venueName}</span>
            </div>
          </div>
        </div>

        <div className="border-b border-surface-line px-6 py-5">
          <h3 className="mb-4 text-sm font-medium text-ink">Ticket summary</h3>
          <div className="space-y-3">
            {ticketLines && ticketLines.length > 0 ? (
              ticketLines.map((line, index) => (
                <div
                  key={line.tierId || `ticket-${index}`}
                  className="flex items-center justify-between border-b border-surface-line/60 py-2 last:border-0"
                >
                  <div>
                    <span className="text-sm font-medium text-ink">{line.name}</span>
                    <span className="ml-3 text-xs text-ink-muted">
                      x {line.quantity}
                    </span>
                  </div>
                  <span className="text-sm text-ink">
                    {formatNaira(line.quantity * line.price)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink-muted">No tickets found.</p>
            )}
          </div>

          <div className="mt-4 border-t border-surface-line pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Subtotal</span>
              <span className="text-ink">{formatNaira(Number(order.subtotal))}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm">
              <span className="text-ink-muted">Service fee</span>
              <span className="text-ink">
                {formatNaira(Number(order.service_fee))}
              </span>
            </div>
            <div className="mt-3 flex justify-between border-t border-surface-line pt-3">
              <span className="font-semibold text-ink">Total paid</span>
              <span className="font-display text-2xl text-signal">
                {formatNaira(Number(order.total_amount))}
              </span>
            </div>
          </div>
        </div>

<div className="flex flex-col items-center bg-surface-raised px-6 py-6">
  <div className="flex flex-col items-center gap-4 w-full max-w-md">
    <h3 className="text-sm font-medium text-ink">Your Tickets</h3>
    
 {ticketLines && ticketLines.length > 0 ? (
  ticketLines.map((line, index) => {
    // Generate unique code per ticket using order reference + tier + number
    const tierShort = line.tierId ? line.tierId.slice(0, 4) : 'TKT';
    const ticketCodes = Array.from({ length: line.quantity }, (_, i) => 
      `${order.order_reference}-${tierShort}-${String(i + 1).padStart(2, '0')}`
    );
    
    return ticketCodes.map((code, ticketIndex) => (
      <div key={code} className="w-full flex flex-col items-center gap-3 border-b border-surface-line/60 pb-5 last:border-0 last:pb-0">
        {/* Ticket Label */}
        <div className="flex items-center gap-3 w-full justify-center">
          <span className="text-sm font-medium text-ink">{line.name}</span>
          <span className="text-xs text-ink-muted">Ticket #{ticketIndex + 1}</span>
          <span className="text-[10px] text-ink-faint font-mono ml-2">{code}</span>
        </div>
        
        {/* QR Code */}
        <div className="rounded-xl bg-white p-3 shadow-sm" id={`qr-${code}`}>
          <QRCodeDisplay value={code} />
        </div>
        
        {/* Action Buttons - Side by Side */}
        <div className="flex gap-3 mt-1">
          {/* Save Button */}
          <button
            onClick={() => {
              try {
                const container = document.querySelector(`#qr-${code}`);
                const canvas = container?.querySelector('canvas') as HTMLCanvasElement | null;
                if (canvas) {
                  const link = document.createElement('a');
                  link.download = `ticket-${code}.png`;
                  link.href = canvas.toDataURL('image/png');
                  link.click();
                }
              } catch (err) {
                alert('Could not save QR code.');
              }
            }}
            className="flex items-center gap-2 rounded-full bg-surface border border-surface-line px-4 py-2 text-xs font-medium text-ink hover:bg-surface-raised hover:border-ink-muted transition"
          >
            <Download size={14} /> Save
          </button>

          {/* Share Button */}
          <button
            onClick={async () => {
              try {
                const container = document.querySelector(`#qr-${code}`);
                const canvas = container?.querySelector('canvas') as HTMLCanvasElement | null;
                if (canvas) {
                  const blob = await new Promise<Blob>((resolve) => {
                    canvas.toBlob((b) => resolve(b!), 'image/png');
                  });
                  const file = new File([blob], `ticket-${code}.png`, { type: 'image/png' });
                  
                  if (navigator.share) {
                    await navigator.share({
                      title: 'My Ticket',
                      text: `Ticket for ${event.title} - ${line.name}`,
                      files: [file],
                    });
                  } else {
                    const url = `${window.location.origin}/verify?code=${code}`;
                    await navigator.clipboard.writeText(url);
                    alert('Ticket link copied! Share it with your friends.');
                  }
                }
              } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                  alert('Could not share. Please take a screenshot.');
                }
              }
            }}
            className="flex items-center gap-2 rounded-full bg-signal px-4 py-2 text-xs font-medium text-white hover:bg-signal-dim transition"
          >
            <Share2 size={14} /> Share
          </button>
        </div>

        {/* Ticket Code */}
        <p className="text-[10px] text-ink-faint font-mono">ID: {code}</p>
      </div>
    ));
  })
) : (
  <p className="text-sm text-ink-muted">No tickets to display.</p>
)}
    
    <p className="text-xs text-ink-faint mt-2">
      Show these QR codes at the door for entry.
    </p>
  </div>
</div>

        <div className="grid grid-cols-2 gap-4 border-t border-surface-line bg-surface-raised/50 px-6 py-4 text-sm">
          <div>
            <p className="flex items-center gap-1 text-xs text-ink-faint">
              <User size={12} /> Attendee
            </p>
            <p className="font-medium text-ink">{order.buyer_name}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs text-ink-faint">
              <Mail size={12} /> Email
            </p>
            <p className="truncate font-medium text-ink">{order.buyer_email}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <LinkButton href="/#tickets" variant="outline" size="md">
          Back to tickets
        </LinkButton>
        <LinkButton href="/" variant="primary" size="md">
          Back to home
        </LinkButton>
      </div>
    </section>
  );
}
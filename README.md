# Vibe District

Frontend for Vibe District, a single-event ticketing site, plus an admin
panel for managing that event's data. Built with Next.js (App Router),
TypeScript, and Tailwind CSS.

## What's included

### Public site
- **Home** (`/`) — single scrolling event page: hero, about, lineup, venue,
  and ticket selection (anchored sections: `#about`, `#lineup`, `#venue`,
  `#tickets`)
- **Checkout** (`/checkout`) — attendee info form + order summary
- **Confirmation** (`/checkout/confirmation`) — mock order confirmation with
  a QR placeholder

Two ticket types are on sale: **Men — ₦15,000** and **Women — ₦5,000**
(`lib/data.ts`).

### Admin panel (`/admin`)
- **Overview** — stat cards, a revenue chart (monthly/weekly toggle), a
  ticket-split donut (Men vs. Women), and a recent transactions table
- **Attendees** (`/admin/attendees`) — searchable order list
- **Event** (`/admin/event`) — edit the event's title, date, venue, lineup,
  and description
- **Tickets** (`/admin/tickets`) — edit price and remaining inventory per
  ticket type

The admin panel has its own light/dark toggle (top right) and is visually
separate from the public site — reach it via the "Admin" link in the public
site's footer, or by going to `/admin` directly.

There is no backend yet. Admin edits update local component state only (to
show the intended UX) and are not persisted — see "Where things are
structured for future integration" below.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000 for the public site and
http://localhost:3000/admin for the admin panel.

## Images

Every image in the UI (hero background, venue map) is a labeled placeholder
block. Swap these for real photography by replacing the placeholder `<div>`
markup in:

- `app/(site)/page.tsx` (hero background, venue map)

## Where things are structured for future integration

- **Supabase**: `lib/data.ts` exports a single `event` object and
  `lib/admin-data.ts` exports mock orders/stats in the shape a real backend
  would return — swap these for data-fetching functions of the same shape.
- **Paystack**: `components/CheckoutForm.tsx` has a single `handleSubmit`
  function — swap the simulated `setTimeout` for a real payment call.
- **QR ticket generation**: the confirmation page
  (`app/(site)/checkout/confirmation/page.tsx`) has a placeholder block ready
  to receive a generated QR code image per order.
- **Admin auth**: `/admin` has no authentication yet — add a check in
  `app/admin/layout.tsx` once you have real admin accounts.
- **Admin writes**: `app/admin/tickets/page.tsx` and `app/admin/event/page.tsx`
  already have local form state and a `handleSave` function each — point
  those at real mutations (e.g. Supabase updates) when the backend exists.

## Design tokens

Colors, type, and spacing live in `tailwind.config.ts` — dark base (`base`,
`surface`), warm ink text, and a signal red-pink accent (`signal`), set in
Fraunces (display) and Space Grotesk (UI/body). The admin panel reuses these
via CSS variables scoped to `.admin-shell` in `app/globals.css`, so its
light/dark toggle doesn't affect the public site.

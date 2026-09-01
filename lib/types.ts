export type TicketTier = {
  id: string;
  name: string;
  description: string;
  price: number; // in smallest currency unit displayed as whole number (NGN)
  perks: string[];
  quantityAvailable: number;
  isSoldOut?: boolean;
};

export type EventRecord = {
  slug: string;
  title: string;
  subtitle: string;
  category: "Nightlife" | "Concert" | "Festival" | "Live Show";
  date: string; // ISO date
  doorsOpen: string; // e.g. "9:00 PM"
  venueName: string;
  venueAddress: string;
  city: string;
  description: string;
  lineup: string[];
  tiers: TicketTier[];
  isFeatured?: boolean;
  isSellingFast?: boolean;
};

export type CartSelection = Record<string, number>; // tierId -> quantity

export type CheckoutInfo = {
  fullName: string;
  email: string;
  phone: string;
};

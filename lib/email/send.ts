import { Resend } from "resend";
import { TicketEmail } from "./TicketEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTicketEmail(
  order: any,
  tickets: any[],
  event: any
) {
  const formattedTickets = tickets.map((t) => ({
    code: t.unique_code,
    tier: t.ticket_tiers?.name || "Ticket",
  }));

  try {
    const { data, error } = await resend.emails.send({
      from: `Vibe District <tickets@vibingdistrict.com>`,
      to: [order.buyer_email],
      subject: `Your tickets for ${event.title}`,
      react: TicketEmail({
        buyerName: order.buyer_name,
        eventTitle: event.title,
        eventDate: new Date(event.date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        eventTime: event.doors_open,
        venueName: event.venue_name,
        venueAddress: event.venue_address,
        tickets: formattedTickets,
      }),
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error };
    }

    console.log("✅ Email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}
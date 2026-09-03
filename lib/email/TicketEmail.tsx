import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface TicketEmailProps {
  buyerName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  tickets: Array<{
    code: string;
    tier: string;
  }>;
}

export const TicketEmail = ({
  buyerName,
  eventTitle,
  eventDate,
  eventTime,
  venueName,
  venueAddress,
  tickets,
}: TicketEmailProps) => {
  const previewText = `Your tickets for ${eventTitle}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Heading style={headerTitle}>Vibe District</Heading>
            <Text style={headerSubtitle}>Your tickets are ready</Text>
          </Section>

          {/* Greeting */}
          <Section style={greetingSection}>
            <Text style={greetingText}>Hey {buyerName.split(" ")[0]},</Text>
            <Text style={bodyText}>
              You&apos;re all set for <strong>{eventTitle}</strong>. Here are your tickets.
            </Text>
          </Section>

          {/* Event Details */}
          <Section style={detailsSection}>
            <Text style={detailsTitle}>Event Details</Text>
            <Text style={detailsText}>
              <strong>{eventTitle}</strong>
              <br />
              {eventDate} · {eventTime}
              <br />
              {venueName}, {venueAddress}
            </Text>
          </Section>

          {/* Tickets */}
          <Section style={ticketsSection}>
            <Text style={ticketsTitle}>Your Tickets</Text>
            {tickets.map((ticket, index) => (
              <Section key={ticket.code} style={ticketCard}>
                <Row>
                  <Column style={ticketInfo}>
                    <Text style={ticketTier}>{ticket.tier}</Text>
                    <Text style={ticketCode}>ID: {ticket.code}</Text>
                    <Text style={ticketNumber}>Ticket #{index + 1}</Text>
                  </Column>
                  <Column style={ticketQrPlaceholder}>
                    <Text style={qrPlaceholderText}>QR CODE</Text>
                    <Text style={qrPlaceholderSub}>Scan at door</Text>
                  </Column>
                </Row>
              </Section>
            ))}
          </Section>

          {/* Instructions */}
          <Section style={instructionsSection}>
            <Text style={instructionsTitle}>What to do next</Text>
            <Text style={instructionsText}>
              1. Save this email or screenshot the QR codes
              <br />
              2. Bring your phone to the event
              <br />
              3. Show your QR code at the door for scanning
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Questions? Contact us at support@vibingdistrict.com
            </Text>
            <Text style={footerTextSmall}>
              © {new Date().getFullYear()} Vibe District. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const headerSection = {
  textAlign: "center" as const,
  padding: "20px 0",
  borderBottom: "2px solid #ff2d5e",
};

const headerTitle = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#ff2d5e",
  margin: "0",
};

const headerSubtitle = {
  fontSize: "16px",
  color: "#666666",
  margin: "4px 0 0",
};

const greetingSection = {
  padding: "20px 0",
};

const greetingText = {
  fontSize: "18px",
  color: "#111111",
  margin: "0 0 8px",
};

const bodyText = {
  fontSize: "16px",
  color: "#333333",
  lineHeight: "1.6",
  margin: "0",
};

const detailsSection = {
  backgroundColor: "#f8f9fa",
  padding: "16px",
  borderRadius: "8px",
  margin: "10px 0",
};

const detailsTitle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#666666",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const detailsText = {
  fontSize: "15px",
  color: "#111111",
  lineHeight: "1.8",
  margin: "0",
};

const ticketsSection = {
  padding: "16px 0",
};

const ticketsTitle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#111111",
  margin: "0 0 12px",
};

const ticketCard = {
  backgroundColor: "#f8f9fa",
  padding: "12px 16px",
  borderRadius: "8px",
  margin: "8px 0",
  border: "1px solid #e9ecef",
};

const ticketInfo = {
  width: "70%",
};

const ticketTier = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#111111",
  margin: "0",
};

const ticketCode = {
  fontSize: "12px",
  color: "#666666",
  margin: "2px 0",
  fontFamily: "monospace",
};

const ticketNumber = {
  fontSize: "11px",
  color: "#999999",
  margin: "0",
};

const ticketQrPlaceholder = {
  width: "30%",
  textAlign: "center" as const,
  backgroundColor: "#ffffff",
  padding: "8px",
  borderRadius: "4px",
  border: "1px dashed #cccccc",
};

const qrPlaceholderText = {
  fontSize: "10px",
  color: "#666666",
  margin: "0",
  fontWeight: "bold",
};

const qrPlaceholderSub = {
  fontSize: "8px",
  color: "#999999",
  margin: "2px 0 0",
};

const instructionsSection = {
  backgroundColor: "#f8f9fa",
  padding: "16px",
  borderRadius: "8px",
  margin: "10px 0",
};

const instructionsTitle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#666666",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const instructionsText = {
  fontSize: "14px",
  color: "#333333",
  lineHeight: "1.8",
  margin: "0",
};

const footerSection = {
  borderTop: "1px solid #e9ecef",
  padding: "16px 0 0",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "13px",
  color: "#666666",
  margin: "0",
};

const footerTextSmall = {
  fontSize: "11px",
  color: "#999999",
  margin: "4px 0 0",
};

export default TicketEmail;
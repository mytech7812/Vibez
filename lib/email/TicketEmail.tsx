import React from "react";
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
  Hr,
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
          {/* Header - Boarding Pass Style */}
          <Section style={headerSection}>
            <Row>
              <Column style={headerLeft}>
                <Text style={headerTitle}>VIBE DISTRICT</Text>
                <Text style={headerSubtitle}>BOARDING PASS</Text>
              </Column>
              <Column style={headerRight}>
                <Text style={eventBadge}>EVENT TICKET</Text>
              </Column>
            </Row>
          </Section>

          {/* Event Name - Large */}
          <Section style={eventNameSection}>
            <Text style={eventName}>{eventTitle}</Text>
          </Section>

          {/* Event Details - Like Flight Details */}
          <Section style={detailsGrid}>
            <Row style={detailsRow}>
              <Column style={detailColumn}>
                <Text style={detailLabel}>DATE</Text>
                <Text style={detailValue}>{eventDate}</Text>
              </Column>
              <Column style={detailColumn}>
                <Text style={detailLabel}>DOORS OPEN</Text>
                <Text style={detailValue}>{eventTime}</Text>
              </Column>
              <Column style={detailColumn}>
                <Text style={detailLabel}>VENUE</Text>
                <Text style={detailValue}>{venueName}</Text>
              </Column>
            </Row>
          </Section>

          {/* Divider */}
          <Hr style={divider} />

          {/* Ticket(s) - Boarding Pass Style */}
          {tickets.map((ticket, index) => (
            <Section key={ticket.code} style={ticketSection}>
              <Row style={ticketRow}>
                <Column style={ticketLeft}>
                  <Text style={ticketLabel}>TICKET {index + 1}</Text>
                  <Text style={ticketTier}>{ticket.tier}</Text>
                  <Text style={ticketCodeLabel}>PASSENGER</Text>
                  <Text style={ticketCode}>{buyerName}</Text>
                </Column>
                <Column style={ticketRight}>
                  <Text style={ticketCodeLabel}>TICKET ID</Text>
                  <Text style={ticketCodeValue}>{ticket.code}</Text>
                </Column>
              </Row>
            </Section>
          ))}

          {/* QR Code - Full Width, Bold, Below */}
          <Section style={qrSection}>
            <Text style={qrTitle}>SCAN TO ENTER</Text>
            <Text style={qrSubtitle}>Show this QR code at the door</Text>
            <Container style={qrContainer}>
              <Img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${tickets[0]?.code || 'TICKET'}`}
                alt="QR Code"
                style={qrImage}
              />
            </Container>
            <Text style={qrInstruction}>Present this QR code at the entrance for scanning</Text>
          </Section>

          {/* Footer - Tear-off Style */}
          <Section style={footerSection}>
            <Text style={footerText}>
              <span style={footerIcon}>✦</span> Valid ID required for entry <span style={footerIcon}>✦</span>
            </Text>
            <Text style={footerTextSmall}>
              Questions? Contact support@vibingdistrict.com
            </Text>
            <Text style={footerFinePrint}>
              © {new Date().getFullYear()} Vibe District. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles - Boarding Pass / Flight Ticket Inspired
const main = {
  backgroundColor: "#f0ece6",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  padding: "30px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
};

// Header
const headerSection = {
  backgroundColor: "#0b0b0e",
  padding: "20px 30px",
};

const headerLeft = {
  width: "70%",
};

const headerRight = {
  width: "30%",
  textAlign: "right" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "700",
  letterSpacing: "3px",
  margin: "0",
  fontFamily: "monospace",
};

const headerSubtitle = {
  color: "#ff2d5e",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "4px",
  margin: "2px 0 0",
};

const eventBadge = {
  color: "#ffffff",
  fontSize: "10px",
  fontWeight: "600",
  letterSpacing: "2px",
  backgroundColor: "#ff2d5e",
  padding: "4px 12px",
  borderRadius: "20px",
  display: "inline-block",
  margin: "0",
};

// Event Name
const eventNameSection = {
  padding: "24px 30px 10px",
};

const eventName = {
  fontSize: "26px",
  fontWeight: "700",
  color: "#0b0b0e",
  margin: "0",
  letterSpacing: "-0.5px",
};

// Details Grid
const detailsGrid = {
  padding: "10px 30px 20px",
};

const detailsRow = {
  backgroundColor: "#f8f6f2",
  borderRadius: "12px",
  padding: "12px 16px",
};

const detailColumn = {
  width: "33.33%",
};

const detailLabel = {
  fontSize: "9px",
  fontWeight: "600",
  color: "#888888",
  letterSpacing: "1.5px",
  margin: "0 0 2px",
  textTransform: "uppercase" as const,
};

const detailValue = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#0b0b0e",
  margin: "0",
};

// Divider
const divider = {
  borderColor: "#e8e4de",
  margin: "0 30px",
};

// Ticket Section - Boarding Pass Style
const ticketSection = {
  padding: "16px 30px",
  margin: "0",
  borderBottom: "1px dashed #e8e4de",
};

const ticketRow = {
  display: "flex" as const,
};

const ticketLeft = {
  width: "65%",
};

const ticketRight = {
  width: "35%",
  textAlign: "right" as const,
};

const ticketLabel = {
  fontSize: "9px",
  fontWeight: "600",
  color: "#ff2d5e",
  letterSpacing: "2px",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
};

const ticketTier = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#0b0b0e",
  margin: "0 0 6px",
};

const ticketCodeLabel = {
  fontSize: "8px",
  fontWeight: "600",
  color: "#888888",
  letterSpacing: "1px",
  margin: "0 0 2px",
  textTransform: "uppercase" as const,
};

const ticketCode = {
  fontSize: "13px",
  fontWeight: "500",
  color: "#0b0b0e",
  margin: "0",
};

const ticketCodeValue = {
  fontSize: "13px",
  fontWeight: "700",
  color: "#0b0b0e",
  fontFamily: "monospace",
  margin: "0",
};

// QR Section - Full Width, Bold
const qrSection = {
  padding: "24px 30px 30px",
  textAlign: "center" as const,
  backgroundColor: "#faf8f5",
};

const qrTitle = {
  fontSize: "10px",
  fontWeight: "700",
  color: "#0b0b0e",
  letterSpacing: "3px",
  textTransform: "uppercase" as const,
  margin: "0 0 4px",
};

const qrSubtitle = {
  fontSize: "13px",
  fontWeight: "400",
  color: "#666666",
  margin: "0 0 16px",
};

const qrContainer = {
  backgroundColor: "#ffffff",
  padding: "16px",
  borderRadius: "12px",
  display: "inline-block" as const,
  border: "2px solid #e8e4de",
  maxWidth: "200px",
  margin: "0 auto",
};

const qrImage = {
  width: "200px",
  height: "200px",
  display: "block",
};

const qrInstruction = {
  fontSize: "11px",
  fontWeight: "600",
  color: "#0b0b0e",
  letterSpacing: "0.5px",
  margin: "16px 0 0",
};

// Footer
const footerSection = {
  padding: "20px 30px",
  textAlign: "center" as const,
  borderTop: "2px solid #0b0b0e",
};

const footerText = {
  fontSize: "12px",
  fontWeight: "500",
  color: "#0b0b0e",
  margin: "0 0 6px",
};

const footerIcon = {
  color: "#ff2d5e",
};

const footerTextSmall = {
  fontSize: "11px",
  color: "#888888",
  margin: "4px 0 8px",
};

const footerFinePrint = {
  fontSize: "10px",
  color: "#aaaaaa",
  margin: "0",
};

export default TicketEmail;
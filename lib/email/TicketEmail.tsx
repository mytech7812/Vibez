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
  const previewText = `Your Vibe District ticket for ${eventTitle} is confirmed`;

  return (
    <Html>
      <Head />

      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Container style={container}>
          {/* =========================================
              HEADER
          ========================================= */}

          <Section style={header}>
            <Row>
              <Column>
                <Text style={brand}>VIBE DISTRICT</Text>
              </Column>

              <Column style={headerRight}>
                <Text style={confirmedBadge}>CONFIRMED</Text>
              </Column>
            </Row>
          </Section>

          {/* =========================================
              INTRO
          ========================================= */}

          <Section style={introSection}>
            <Text style={greeting}>Hey {buyerName},</Text>

            <Heading style={mainHeading}>
              Your ticket is
              <br />
              <span style={pinkText}>confirmed.</span>
            </Heading>

            <Text style={introText}>
              You&apos;re officially on the list for {eventTitle}. Keep this email
handy for the day of the event.
            </Text>
          </Section>

          {/* =========================================
              EVENT INFORMATION
          ========================================= */}

          <Section style={eventSection}>
            <Text style={sectionEyebrow}>YOUR EVENT</Text>

            <Heading style={eventTitleStyle}>{eventTitle}</Heading>

            <Hr style={lightDivider} />

            <Row style={eventDetailsRow}>
              <Column style={eventDetailColumn}>
                <Text style={detailLabel}>DATE</Text>
                <Text style={detailValue}>{eventDate}</Text>
              </Column>

              <Column style={eventDetailColumn}>
                <Text style={detailLabel}>TIME</Text>
                <Text style={detailValue}>{eventTime}</Text>
              </Column>
            </Row>

            <Row style={venueRow}>
              <Column>
                <Text style={detailLabel}>VENUE</Text>

                <Text style={venueNameStyle}>{venueName}</Text>

                <Text style={venueAddressStyle}>{venueAddress}</Text>
              </Column>
            </Row>
          </Section>

          {/* =========================================
              TICKETS
          ========================================= */}

          {tickets.map((ticket, index) => (
            <Section key={ticket.code} style={ticketWrapper}>
              <Section style={ticketCard}>
                {/* Ticket heading */}

                <Row>
                  <Column>
                    <Text style={ticketNumber}>
                      TICKET {String(index + 1).padStart(2, "0")}
                    </Text>

                    <Text style={ticketTier}>{ticket.tier}</Text>

                    <Text style={guestLabel}>GUEST</Text>

                    <Text style={guestName}>{buyerName}</Text>
                  </Column>
                </Row>

                {/* Entry code */}

                <Section style={codeSection}>
                  <Text style={codeLabel}>ENTRY CODE</Text>

                  <Text style={entryCode}>
                    {formatCode(ticket.code)}
                  </Text>

                  <Text style={codeHelp}>
                    Use this code if your ticket needs to be verified
                    manually.
                  </Text>
                </Section>

                {/* QR */}

                <Section style={qrSection}>
                  <Text style={scanTitle}>SCAN TO ENTER</Text>

                  <Text style={scanSubtitle}>
                    Show this QR code at the entrance
                  </Text>

                  <Section style={qrBox}>
                    <Img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
                        ticket.code
                      )}`}
                      alt={`QR code for ticket ${ticket.code}`}
                      width="240"
                      height="240"
                      style={qrImage}
                    />
                  </Section>

                  <Text style={qrBottomText}>
                    Your QR code is unique to this ticket.
                  </Text>
                </Section>
              </Section>
            </Section>
          ))}

          {/* =========================================
              ENTRY REMINDER
          ========================================= */}

          <Section style={reminderSection}>
            <Text style={reminderTitle}>KEEP THIS EMAIL HANDY</Text>

            <Text style={reminderText}>
              You&apos;ll need your QR code to enter the event. We recommend
keeping this email accessible on your phone on the day.
            </Text>

            <Text style={idReminder}>
              Valid ID may be required for entry.
            </Text>
          </Section>



          {/* =========================================
              FOOTER
          ========================================= */}

          <Section style={footer}>
            <Text style={footerBrand}>VIBE DISTRICT</Text>

            <Text style={footerContact}>
              Questions? Contact{" "}
              <a
                href="mailto:support@vibingdistrict.com"
                style={footerLink}
              >
                support@vibingdistrict.com
              </a>
            </Text>

            <Text style={copyright}>
              © {new Date().getFullYear()} Vibe District. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

/* =========================================
   HELPERS
========================================= */

/**
 * Makes a 5-digit code easier to read.
 *
 * Example:
 * 12345 → 1 2 3 4 5
 *
 * If the supplied code is longer than 5 characters,
 * it will simply be displayed as supplied.
 */
const formatCode = (code: string) => {
  const cleanCode = code.trim();

  if (cleanCode.length === 5) {
    return cleanCode.split("").join(" ");
  }

  return cleanCode;
};

/* =========================================
   MAIN
========================================= */

const main = {
  backgroundColor: "#efede9",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: "0",
  padding: "40px 16px",
};

/* =========================================
   CONTAINER
========================================= */

const container = {
  backgroundColor: "#ffffff",
  maxWidth: "600px",
  margin: "0 auto",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
};

/* =========================================
   HEADER
========================================= */

const header = {
  backgroundColor: "#0b0b0e",
  padding: "26px 32px",
};

const brand = {
  color: "#ffffff",
  fontSize: "17px",
  fontWeight: "800",
  letterSpacing: "4px",
  margin: "0",
};

const headerRight = {
  textAlign: "right" as const,
};

const confirmedBadge = {
  color: "#ff2d5e",
  fontSize: "9px",
  fontWeight: "800",
  letterSpacing: "1.5px",
  margin: "0",
};

/* =========================================
   INTRO
========================================= */

const introSection = {
  padding: "42px 36px 34px",
};

const greeting = {
  color: "#777777",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0 0 18px",
};

const mainHeading = {
  color: "#0b0b0e",
  fontSize: "42px",
  lineHeight: "1.05",
  fontWeight: "800",
  letterSpacing: "-1.8px",
  margin: "0 0 20px",
};

const pinkText = {
  color: "#ff2d5e",
};

const introText = {
  color: "#666666",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0",
  maxWidth: "480px",
};

/* =========================================
   EVENT SECTION
========================================= */

const eventSection = {
  backgroundColor: "#f7f5f1",
  padding: "30px 36px 34px",
};

const sectionEyebrow = {
  color: "#ff2d5e",
  fontSize: "9px",
  fontWeight: "800",
  letterSpacing: "2px",
  margin: "0 0 9px",
};

const eventTitleStyle = {
  color: "#0b0b0e",
  fontSize: "28px",
  lineHeight: "1.15",
  fontWeight: "800",
  letterSpacing: "-0.8px",
  margin: "0",
};

const lightDivider = {
  borderColor: "#dedbd5",
  margin: "24px 0",
};

const eventDetailsRow = {
  marginBottom: "24px",
};

const eventDetailColumn = {
  width: "50%",
};

const detailLabel = {
  color: "#888888",
  fontSize: "8px",
  fontWeight: "800",
  letterSpacing: "1.5px",
  margin: "0 0 5px",
};

const detailValue = {
  color: "#0b0b0e",
  fontSize: "14px",
  fontWeight: "700",
  margin: "0",
};

const venueRow = {
  marginTop: "4px",
};

const venueNameStyle = {
  color: "#0b0b0e",
  fontSize: "14px",
  fontWeight: "700",
  margin: "0 0 3px",
};

const venueAddressStyle = {
  color: "#777777",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0",
};

/* =========================================
   TICKET WRAPPER
========================================= */

const ticketWrapper = {
  padding: "28px 24px 0",
  backgroundColor: "#ffffff",
};

const ticketCard = {
  border: "1px solid #e5e2dc",
  borderRadius: "18px",
  overflow: "hidden",
  backgroundColor: "#ffffff",
};

/* =========================================
   TICKET DETAILS
========================================= */

const ticketNumber = {
  color: "#ff2d5e",
  fontSize: "9px",
  fontWeight: "800",
  letterSpacing: "2px",
  margin: "26px 28px 7px",
};

const ticketTier = {
  color: "#0b0b0e",
  fontSize: "23px",
  fontWeight: "800",
  letterSpacing: "-0.5px",
  margin: "0 28px 22px",
};

const guestLabel = {
  color: "#999999",
  fontSize: "8px",
  fontWeight: "800",
  letterSpacing: "1.5px",
  margin: "0 28px 4px",
};

const guestName = {
  color: "#0b0b0e",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 28px 26px",
};

/* =========================================
   ENTRY CODE
========================================= */

const codeSection = {
  backgroundColor: "#0b0b0e",
  textAlign: "center" as const,
  padding: "25px 20px 27px",
};

const codeLabel = {
  color: "#a8a8ad",
  fontSize: "9px",
  fontWeight: "800",
  letterSpacing: "2.5px",
  margin: "0 0 10px",
};

const entryCode = {
  color: "#ffffff",
  fontSize: "38px",
  lineHeight: "1",
  fontWeight: "900",
  letterSpacing: "9px",
  margin: "0 0 12px",
  paddingLeft: "9px",
};

const codeHelp = {
  color: "#a8a8ad",
  fontSize: "10px",
  lineHeight: "1.5",
  margin: "0 auto",
  maxWidth: "330px",
};

/* =========================================
   QR SECTION
========================================= */

const qrSection = {
  textAlign: "center" as const,
  padding: "28px 20px 30px",
};

const scanTitle = {
  color: "#0b0b0e",
  fontSize: "10px",
  fontWeight: "900",
  letterSpacing: "2.5px",
  margin: "0 0 5px",
};

const scanSubtitle = {
  color: "#777777",
  fontSize: "12px",
  margin: "0 0 20px",
};

const qrBox = {
  backgroundColor: "#ffffff",
  border: "1px solid #e7e4df",
  borderRadius: "14px",
  padding: "14px",
  display: "inline-block" as const,
};

const qrImage = {
  display: "block",
  width: "240px",
  height: "240px",
};

const qrBottomText = {
  color: "#999999",
  fontSize: "10px",
  margin: "14px 0 0",
};

/* =========================================
   REMINDER
========================================= */

const reminderSection = {
  padding: "34px 36px",
  textAlign: "center" as const,
};

const reminderTitle = {
  color: "#0b0b0e",
  fontSize: "9px",
  fontWeight: "900",
  letterSpacing: "2px",
  margin: "0 0 10px",
};

const reminderText = {
  color: "#777777",
  fontSize: "12px",
  lineHeight: "1.6",
  maxWidth: "430px",
  margin: "0 auto 12px",
};

const idReminder = {
  color: "#0b0b0e",
  fontSize: "11px",
  fontWeight: "600",
  margin: "0",
};

/* =========================================
   FOOTER
========================================= */

const footer = {
  backgroundColor: "#0b0b0e",
  textAlign: "center" as const,
  padding: "28px 24px",
};

const footerBrand = {
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "800",
  letterSpacing: "3px",
  margin: "0 0 12px",
};

const footerContact = {
  color: "#88888d",
  fontSize: "11px",
  margin: "0 0 10px",
};

const footerLink = {
  color: "#ff2d5e",
  textDecoration: "none",
};

const copyright = {
  color: "#55555a",
  fontSize: "9px",
  margin: "0",
};

export default TicketEmail;